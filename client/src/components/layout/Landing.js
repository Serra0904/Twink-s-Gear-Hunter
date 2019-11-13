import React, { Component } from "react";
import { Link } from "react-router-dom";

class Landing extends Component {
  render() {
    return (
      <div style={{ height: "75vh" }} className="container valign-wrapper">
        <div className="row">
          <div className="col s12 center-align">
            <h4>
              <b>Find</b> your twink item's <br />
              through auctions house of all european servers..
              <br /> <b>In same time.</b>
            </h4>
            <p className="flow-text grey-text text-darken-1">
              Increase your profitability and stay one step ahead of your
              competitors.
            </p>
            <br />
            <div className="col s12">
              <Link
                to="/login"
                style={{
                  borderRadius: "3px",
                  letterSpacing: "1.5px"
                }}
                className="btn btn-large btn-flat waves-effect white black-text"
              >
                Connexion
              </Link>
            </div>
            <div className="col s12">
              <a
                href="https://discord.gg/HPnrPxk"
                style={{
                  borderRadius: "3px",
                  letterSpacing: "1.5px"
                }}
                className="btn btn-large btn-flat waves-effect white black-text"
              >
                Dont have account ? contact us on Discord.
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Landing;
