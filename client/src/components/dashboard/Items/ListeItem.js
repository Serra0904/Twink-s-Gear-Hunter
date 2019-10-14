import React, { useState, useEffect } from "react";
import axios from "axios";
import { connect } from "react-redux";

import Item from "./Items";

function ListeItem(props) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const userId = props.auth.user.id;

    try {
      axios
        .post("../api/users/itemsSearched", { userId: userId })
        .then(response => {
          setItems(response.data);
          console.log(response.data);
        })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  let listItems = items.map((item, index) => {
    console.log(item);
    return <Item item={item[0]} ilvls={item[1]} key={index} />;
  });

  return (
    <div style={{ minHeight: "75vh" }} className="container">
      <div className="row" style={{ width: "100%" }}>
        <div className="landing-copy col s12 center-align">
          <h4>
            <p className="flow-text grey-text text-darken-1">
              Liste de vos <b>items..</b>
            </p>
          </h4>
        </div>
      </div>

      <div className="row">{listItems}</div>
    </div>
  );
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  null
)(ListeItem);
