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
              <span className="card-title">
                Nom de l'item :
                {auction.item === 12987
                  ? " Brai des ombres"
                  : auction.item === 12994
                  ? "Gantelet de thorbia"
                  : auction.item === 2911
                  ? "Ceinturon de Keller"
                  : auction.item === 1121
                  ? "Bottes du lynx"
                  : "error"}
              </span>
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
