import React from "react";
import ilvlList from "../../../config/ilvlList";

export default function Items(props) {
  console.log(ilvlList);

  let ilvls = props.ilvls.map((ilvl, index) => {
    return <i key={index}>{ilvlList[ilvl]} ,</i>;
  });

  let ImageItem =
    props.item === 12987
      ? "https://wow.zamimg.com/images/wow/icons/large/inv_pants_06.jpg"
      : props.item === 12994
      ? "https://wow.zamimg.com/images/wow/icons/large/inv_gauntlets_11.jpg"
      : props.item === 2911
      ? "https://wow.zamimg.com/images/wow/icons/large/inv_belt_04.jpg"
      : props.item === 1121
      ? "https://wow.zamimg.com/images/wow/icons/large/inv_boots_wolf.jpg"
      : props.item === 12977
      ? "https://wow.zamimg.com/images/wow/icons/large/inv_gauntlets_27.jpg"
      : props.item === 4446
      ? "https://wow.zamimg.com/images/wow/icons/large/inv_weapon_shortblade_02.jpg"
      : "https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg";

  let nameItem =
    props.item === 12987
      ? " Brai des ombres"
      : props.item === 12994
      ? " Gantelet de thorbia"
      : props.item === 2911
      ? " Ceinturon de Keller"
      : props.item === 1121
      ? " Bottes du lynx"
      : props.item === 12977
      ? " Gants poing-de-mage"
      : props.item === 4446
      ? " Lame de venin noir"
      : " error";

  return (
    <div className="col s12 m4">
      <div className="card">
        <img
          src={ImageItem}
          style={{ position: "absolute", width: "50px", zIndex: "100" }}
        />
        <div className="card-image">
          <img
            src="https://cdn.arstechnica.net/wp-content/uploads/2014/12/wowgold-640x481.png"
            alt=""
          />
          <span
            className="card-title"
            style={{
              backgroundColor: "grey",
              width: "100%",
              fontSize: "1.2rem"
            }}
          >
            Nom de l'item :
            <u>
              <b>{nameItem}</b>
            </u>
          </span>
        </div>
        <div className="card-content">
          <p>Id de l'item : {props.item}</p>
          <p>ilvls : {ilvls}</p>
        </div>
        <div className="card-action">
          <a href="#">Gérer..</a>
        </div>
      </div>
    </div>
  );
}
