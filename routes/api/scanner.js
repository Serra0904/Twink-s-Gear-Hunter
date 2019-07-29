const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");
const axios = require("axios");
let realm = [
  { realm: "archimonde", zone: "fr" },
  { realm: "arathi", zone: "fr" },
  { realm: "Arak-arahm", zone: "fr" },
  { realm: "Chants éternels", zone: "fr" },
  { realm: "Cho'gall", zone: "fr" },
  { realm: "Confrérie du Thorium", zone: "fr" },
  { realm: "Culte de la Rive noire", zone: "fr" },
  { realm: "Dalaran", zone: "fr" },
  { realm: "Drek'Thar", zone: "fr" },
  { realm: "Eitrigg", zone: "fr" },
  { realm: "Eldre'Thalas", zone: "fr" },
  { realm: "Elune", zone: "fr" },
  { realm: "Garona", zone: "fr" },
  { realm: "Hyjal", zone: "fr" },
  { realm: "Illidan", zone: "fr" },
  { realm: "Kael'thas", zone: "fr" },
  { realm: "Khaz Modan", zone: "fr" },
  { realm: "Kirin Tor", zone: "fr" },
  { realm: "Krasus", zone: "fr" },
  { realm: "La Croisade écarlate", zone: "fr" },
  { realm: "Les Clairvoyants", zone: "fr" },
  { realm: "Les Sentinelles", zone: "fr" },
  { realm: "Marécage de Zangar", zone: "fr" },
  { realm: "Medivh", zone: "fr" },
  { realm: "Naxxramas", zone: "fr" },
  { realm: "Ner'zhul", zone: "fr" },
  { realm: "Rashgarroth", zone: "fr" },
  { realm: "Sargeras", zone: "fr" },
  { realm: "Sinstralis", zone: "fr" },
  { realm: "Suramar", zone: "fr" },
  { realm: "Temple noir", zone: "fr" },
  { realm: "Throk'Feroth", zone: "fr" },
  { realm: "Uldaman", zone: "fr" },
  { realm: "Varimathras", zone: "fr" },
  { realm: "Vol'jin", zone: "fr" },
  { realm: "Ysondre", zone: "fr" },
  { realm: "Aegwynn", zone: "ge" },
  { realm: "Alexstrasza", zone: "ge" },
  { realm: "Alleria", zone: "ge" },
  { realm: "Aman'Thul", zone: "ge" },
  { realm: "Ambossar", zone: "ge" },
  { realm: "Anetheron", zone: "ge" },
  { realm: "Antonidas", zone: "ge" },
  { realm: "Anub'arak", zone: "ge" },
  { realm: "Area 52", zone: "ge" },
  { realm: "Arthas", zone: "ge" },
  { realm: "Arygos", zone: "ge" },
  { realm: "Azshara", zone: "ge" },
  { realm: "Baelgun", zone: "ge" },
  { realm: "Blackhand", zone: "ge" },
  { realm: "Blackmoore", zone: "ge" },
  { realm: "Blackrock", zone: "ge" },
  { realm: "Blutkessel", zone: "ge" },
  { realm: "Dalvengyr", zone: "ge" },
  { realm: "Das Konsortium", zone: "ge" },
  { realm: "Das Syndikat", zone: "ge" },
  { realm: "Der Mithrilorden", zone: "ge" },
  { realm: "Der Rat von Dalaran", zone: "ge" },
  { realm: "Der abyssische Rat", zone: "ge" },
  { realm: "Destromath", zone: "ge" },
  { realm: "Dethecus", zone: "ge" },
  { realm: "Die Aldor", zone: "ge" },
  { realm: "Die Nachtwache", zone: "ge" },
  { realm: "Die Silberne Hand", zone: "ge" },
  { realm: "Die Todeskrallen", zone: "ge" },
  { realm: "Dun Morogh", zone: "ge" },
  { realm: "Durotan", zone: "ge" },
  { realm: "Echsenkessel", zone: "ge" },
  { realm: "Eredar", zone: "ge" },
  { realm: "Festung der Stürme", zone: "ge" },
  { realm: "Forscherliga", zone: "ge" },
  { realm: "Frostmourne", zone: "ge" },
  { realm: "Frostwolf", zone: "ge" },
  { realm: "Garrosh", zone: "ge" },
  { realm: "Gilneas", zone: "ge" },
  { realm: "Gorgonnash", zone: "ge" },
  { realm: "Gul'dan", zone: "ge" },
  { realm: "Kargath", zone: "ge" },
  { realm: "Kel'Thuzad", zone: "ge" },
  { realm: "Khaz'goroth", zone: "ge" },
  { realm: "Kil'jaeden", zone: "ge" },
  { realm: "Krag'jin", zone: "ge" },
  { realm: "Kult der Verdammten", zone: "ge" },
  { realm: "Lordaeron", zone: "ge" },
  { realm: "Lothar", zone: "ge" },
  { realm: "Madmortem", zone: "ge" },
  { realm: "Mal'Ganis", zone: "ge" },
  { realm: "Malfurion", zone: "ge" },
  { realm: "Malorne", zone: "ge" },
  { realm: "Malygos", zone: "ge" },
  { realm: "Mannoroth", zone: "ge" },
  { realm: "Mug'thol", zone: "ge" },
  { realm: "Nathrezim", zone: "ge" },
  { realm: "Nazjatar", zone: "ge" },
  { realm: "Nefarian", zone: "ge" },
  { realm: "Nera'thor", zone: "ge" },
  { realm: "Nethersturm", zone: "ge" },
  { realm: "Norgannon", zone: "ge" },
  { realm: "Nozdormu", zone: "ge" },
  { realm: "Onyxia", zone: "ge" },
  { realm: "Perenolde", zone: "ge" },
  { realm: "Proudmoore", zone: "ge" },
  { realm: "Rajaxx", zone: "ge" },
  { realm: "Rexxar", zone: "ge" },
  { realm: "Shattrath", zone: "ge" },
  { realm: "Taerar", zone: "ge" },
  { realm: "Teldrassil", zone: "ge" },
  { realm: "Terrordar", zone: "ge" },
  { realm: "Theradras", zone: "ge" },
  { realm: "Thrall", zone: "ge" },
  { realm: "Tichondrius", zone: "ge" },
  { realm: "Tirion", zone: "ge" },
  { realm: "Todeswache", zone: "ge" },
  { realm: "Ulduar", zone: "ge" },
  { realm: "Un'Goro", zone: "ge" },
  { realm: "Vek'lor", zone: "ge" },
  { realm: "Wrathbringer", zone: "ge" },
  { realm: "Ysera", zone: "ge" },
  { realm: "Zirkel des Cenarius", zone: "ge" },
  { realm: "Zuluhed", zone: "ge" }
];

let urls = [];

let getUrls = () => {
  realm.map(scan => {
    axios
      .get(
        `https://eu.api.blizzard.com/wow/auction/data/${
          scan.realm
        }?locale=fr_FR&access_token=US44kVpNcQiol8uCgs55VsqidnzVqj1ggv`
      )
      .then(auctionsUrl => {
        urls.push(auctionsUrl.data.files[0].url);
      })
      .catch(error => {
        console.log(error);
      });
  });
};

let fetchUrls = () => {
  axios.all(urls.map(l => axios.get(l))).then(
    axios.spread(function(...res) {
      // all requests are now complete
      console.log(res);
    })
  );
};

let executeUrls = async () => {
  await getUrls();
};

setTimeout(() => {
  executeUrls();
}, 2000);

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
