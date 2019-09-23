const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const axios = require("axios");
const users = require("./routes/api/users");
const scanner = require("./routes/api/scanner");
const app = express();
const keys = require("./config/keys");
const path = require("path");
const Nexmo = require("nexmo");

const nexmo = new Nexmo({
  apiKey: "68216ee7",
  apiSecret: "rUiSBsUTKxRDJ49t"
});

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

//Refresh access token every 12 hours
setInterval(() => {
  axios
    .post(
      "https://us.battle.net/oauth/token",
      "grant_type=client_credentials&scope=all&client_id=87942a232baa4b41842d6191424aec43&client_secret=29LxYtcM3o9S1u1Nduy8JT73eOeboDr2"
    )
    .then(function(res) {
      console.log(res.data.access_token);
      User.updateMany(
        {},
        { $set: { token: res.data.access_token } },
        { safe: true, multi: true },
        function(err, obj) {
          if (!err) {
            //console.log(obj);
          } else {
            //console.log(err);
          }
        }
      );
    })
    .catch(error => {
      console.log(error);
    });
}, 216000);

// Routes
app.use("/api/users", users);
app.use("/api/scanner", scanner);

const from = "GearHunter";
const to = "33638503252";
const text = "Démarrage des serveurs de GearHunter...";
/*nexmo.message.sendSms(from, to, text);*/

// *Serve static assets if we are in production
if (process.env.NODE_ENV === "production") {
  // set static folder*
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server up and running on port ${port} !`));
