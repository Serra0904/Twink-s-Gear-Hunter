import React, { Component } from "react";
import axios from "axios";
import Moment from "react-moment";

class items extends Component {
  state = {
    auctions: [{ auctions: [] }]
  };

  componentDidMount() {
    try {
      axios
        .get("../api/scanner/get/all")
        .then(response => {
          this.setState({ auctions: response.data });
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
      let prix = auction.buyout / 10000;
      console.log(auction);
      return (
        <div class="col s12 m4">
          <div class="card">
            <div class="card-image">
              <img
                src="https://cdn.arstechnica.net/wp-content/uploads/2014/12/wowgold-640x481.png"
                alt=""
              />
              <span class="card-title">Id de l'item : {auction.item}</span>
            </div>
            <div class="card-content">
              <p>Serveur : {auction.ownerRealm}</p>
              <p>Vendeur : {auction.owner}</p>
              <p>Prix : {prix} POs</p>
              <p>Temps restant : {auction.timeLeft}</p>
              <p>Ilvl : 28</p>
            </div>
            <div class="card-action">
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
                <Moment format=":mm:ss a" interval={0}>
                  {this.state.auctions[0].data}
                </Moment>
              </p>
            </h6>
          </div>
        </div>

        <div class="row">
          {currentAuction.length === 0
            ? "Aucun item disponible..."
            : currentAuction}
        </div>
      </div>
    );
  }
}

export default items;
