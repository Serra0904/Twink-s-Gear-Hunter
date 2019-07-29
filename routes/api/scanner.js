const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");

// @route GET api/scanner/scann
// @desc Register user
// @access Public
router.get("/scann", (req, res) => {
  axios
    .get(
      `https://eu.api.blizzard.com/wow/auction/data/archimonde?locale=fr_FR&access_token=`
    )
    .then(auctionsUrl => {
      console.log(auctionsUrl);
    })
    .catch(error => console.log(error));
});
