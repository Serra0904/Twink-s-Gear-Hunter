// Load Token model
const User = require("../models/User");
let token = "";
User.find({ _id: "5d3c1c0b5270e926c0546526" })
  .then(response => {
    token = response[0].token;
    console.log(token);
  })
  .catch(error => {
    console.log(error);
  });

let keys = {
  mongoURI:
    "mongodb+srv://nico:Darkpvp09@cluster0-yjoid.mongodb.net/twinkHunter?retryWrites=true",
  secretOrKey: "twinksgearhunter",
  blizzardApi: token
};

module.exports = keys;
