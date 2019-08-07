import React, { Component } from "react";
import axios from "axios";
import Moment from "react-moment";

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
            this.setState({ ...this.state, currentServers: response.data });
            console.log(response.data);
          })
          .catch(error => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    }, 10000);
  }

  render() {
    let currentAuction = this.state.auctions[0].auctions.map(auction => {
      let prix = auction.buyout / 10000;
      console.log(auction);
      return (
        <div className="col s12 m4">
          <div className="card">
            <div className="card-image">
              <img
                src="https://cdn.arstechnica.net/wp-content/uploads/2014/12/wowgold-640x481.png"
                alt=""
              />
              <span className="card-title">Id de l'item : {auction.item}</span>
            </div>
            <div className="card-content">
              <p>Serveur : {auction.ownerRealm}</p>
              <p>Vendeur : {auction.owner}</p>
              <p>Prix : {prix} POs</p>
              <p>Temps restant : {auction.timeLeft}</p>
              <p>Ilvl : 28</p>
            </div>
            <div className="card-action">
              <a href="#">Disponible..</a>
            </div>
          </div>
        </div>
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
                Dernière mise à jour :{" "}
                {this.state.auctions[0].date ? (
                  <Moment interval={0} format="HH:mm">
                    {this.state.auctions[0].date}
                  </Moment>
                ) : (
                  ""
                )}
              </p>
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
