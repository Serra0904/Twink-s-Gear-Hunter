import React, { Component } from "react";
import { Link } from "react-router-dom";

class Landing extends Component {
  render() {
    return (
      <div style={{ height: "75vh" }} className="container valign-wrapper">
        <div className="row">
          <div className="col s12 center-align">
            <h4>
              <b>Cherche</b> l'item de ton choix <br />à travers tous les hôtels
              de vente du jeu.
              <br /> <b>En même temps.</b>
            </h4>
            <p className="flow-text grey-text text-darken-1">
              Augmente ta rentabilité et garde un coup d'avance sur tes
              concurrents.
            </p>
            <br />
            <div className="col s12">
              <Link
                to="/login"
                style={{
                  width: "140px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px"
                }}
                className="btn btn-large btn-flat waves-effect white black-text"
              >
                Connexion
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Landing;
