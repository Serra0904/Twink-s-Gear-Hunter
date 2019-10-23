import React, { Component } from "react";
import axios from "axios";
import Moment from "react-moment";
import Item from "./items";

import { connect } from "react-redux";
class items extends Component {
  state = {
    auctions: [{ auctions: [] }],
    currentServers: []
  };

  componentDidMount() {
    console.log(this.props.auth);
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

    setInterval(() => {
      try {
        axios
          .post("../api/scanner/get/lastServerScanned")
          .then(response => {
            this.setState({
              ...this.state,
              currentServers: response.data[0].servers
            });
            console.log(response.data[0].servers);
          })
          .catch(error => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    }, 7000);
  }

  render() {
    let currentAuction = this.state.auctions[0].auctions.map(auction => {
      return (
        <Item
          item={auction.item}
          ownerRealm={auction.ownerRealm}
          owner={auction.owner}
          timeLeft={auction.timeLeft}
          buyout={auction.buyout}
        />
      );
    });

    let scannCurrentlyScanned = this.state.currentServers.map(server => {
      return <span className="currentServer">{server.name}, </span>;
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
                Le dernier scann s'est terminé à :{" "}
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
              les serveurs {scannCurrentlyScanned} sont en train d'être
              scannés...
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
