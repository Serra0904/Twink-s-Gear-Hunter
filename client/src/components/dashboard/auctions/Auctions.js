import React, { Component } from "react";
import axios from "axios";
import Moment from "react-moment";

import { connect } from "react-redux";

import Item from "./Items";
import CurrentlyScanned from "./CurrentlyScanned";

class items extends Component {
  state = {
    auctions: [{ auctions: [] }]
  };

  componentDidMount() {
    const userId = this.props.auth.user.id;
    try {
      axios
        .post("../api/scanner/get/all", { userId: userId })
        .then(response => {
          this.setState({ ...this.state, auctions: response.data });
          console.log(response.data);
        })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    let currentAuction = this.state.auctions[0].auctions.map(auction => {
      return (
        <Item
          owner={auction.owner}
          owernerRealm={auction.owernerRealm}
          item={auction.item}
          buyout={auction.buyout}
          timeLeft={auction.timeLeft}
        />
      );
    });

    return (
      <div style={{ minHeight: "75vh" }} className="container">
        <div className="row" style={{ width: "100%" }}>
          <div className="landing-copy col s12 center-align">
            <h4>
              <p className="flow-text grey-text text-darken-1">
                Enchères en <b>cours..</b>
              </p>
            </h4>
            <h6>
              <p>
                Le dernier scann s'est terminé à :
                {this.state.auctions[0].date ? (
                  <Moment interval={0} format="HH:mm">
                    {this.state.auctions[0].date}
                  </Moment>
                ) : (
                  ""
                )}
              </p>
            </h6>
            <h6>
              les serveurs <CurrentlyScanned /> sont en train d'être scannés...
            </h6>
          </div>
        </div>

        <div className="row">
          {currentAuction.length === 0
            ? "Aucun item disponible..."
            : currentAuction}
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  null
)(items);
