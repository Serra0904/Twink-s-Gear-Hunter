import React, { useEffect } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";

export default function CreateItem() {
  const animatedComponents = makeAnimated();
  let options = [
    { value: 3900, label: "18 ilvl" },
    { value: 3901, label: "28 ilvl" },
    { value: 3902, label: "33 ilvl" },
    { value: 3903, label: "38 ilvl" },
    { value: 3904, label: "43 ilvl" },
    { value: 3905, label: "53 ilvl" },
    { value: 3941, label: "28 ilvl" },
    { value: 3941, label: "48 ilvl" }
  ];
  return (
    <div>
      <div style={{ minHeight: "75vh" }} className="container">
        <div className="row" style={{ width: "100%" }}>
          <div className="landing-copy col s12 m11 center-align">
            <h4>
              <p className="flow-text grey-text text-darken-1">
                Ajouter un <b>items..</b>
              </p>
            </h4>
          </div>
        </div>

        <div className="row">
          <form action="#">
            <div className="landing-copy col s12 center-align">
              <div class="input-field col s12 m6 offset-m3">
                <input
                  placeholder="Wow head Link"
                  id="first_name"
                  type="text"
                  className="validate"
                  style={{ margin: "auto" }}
                />
                <label for="first_name">Item</label>
              </div>

              <div class="input-field col s12 m6 offset-m3">
                <Select
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  defaultValue={options[0]}
                  isMulti
                  options={options}
                />
              </div>
              <button
                class="btn waves-effect waves-light"
                type="submit"
                name="action"
              >
                Submit
                <i class="material-icons right">send</i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
