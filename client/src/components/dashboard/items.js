import React, { Component } from "react";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import axios from "axios";

class Items extends Component {
  state = {
    auctions: []
  };

  componentDidMount() {
    try {
      axios
        .get("api/scanner/get/all")
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }



  render() {

    let currentAuction = this.state.map(auction => {
        return (


        );
    });

    return (
      <div style={{ minHeight: "75vh" }} className="container valign-wrapper">
        <div className="row">
          <div className="landing-copy col s12 center-align">
            <h4>
              <p className="flow-text grey-text text-darken-1">
                Enchères en <b>cours..</b>
              </p>
            </h4>
          </div>
        </div>
        <div class="row">
          <div class="col s12 m7">
            <div class="card">
              <div class="card-image">
                <img src="images/sample-1.jpg" />
                <span class="card-title">Card Title</span>
              </div>
              <div class="card-content">
                <p>I am a very simple card. I am good at containing small bits of information.
          I am convenient because I require little markup to use effectively.</p>
              </div>
              <div class="card-action">
                <a href="#">This is a link</a>
              </div>
            </div>
            <div class="card">
              <div class="card-image">
                <img src="images/sample-1.jpg" />
                <span class="card-title">Card Title</span>
              </div>
              <div class="card-content">
                <p>I am a very simple card. I am good at containing small bits of information.
          I am convenient because I require little markup to use effectively.</p>
              </div>
              <div class="card-action">
                <a href="#">This is a link</a>
              </div>
            </div>
            <div class="card">
              <div class="card-image">
                <img src="images/sample-1.jpg" />
                <span class="card-title">Card Title</span>
              </div>
              <div class="card-content">
                <p>I am a very simple card. I am good at containing small bits of information.
          I am convenient because I require little markup to use effectively.</p>
              </div>
              <div class="card-action">
                <a href="#">This is a link</a>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Items);
