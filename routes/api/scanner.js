const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");
const axios = require("axios");
const sendmail = require("sendmail")({ silent: true });

// * Je charge le modèle des enchères
const Auction = require("../../models/Auctions");
const User = require("../../models/User.js");

/**
 * *Je récupère le token de l'api wow dans la bdd (qui est refresh toutes les 6h) oui
 */
let token = "";
User.find({ _id: "5d3c1c0b5270e926c0546526" })
  .then(response => {
    token = response[0].token;
  })
  .catch(error => {
    console.log(error);
  });

/**
 * *LISTE DES ROYAUMES A SCANNER
 */
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
  { realm: "Krasus", zone: "fr" }
];

// *tableau qui va contenir toutes les urls avec les data en json
let urls = [];
// *Tableau qui va contenir toutes les enchères en cours
let auctions = [];

const getUrls = async () => {
  /**
   * * Get urls est une fonction asynchrone qui boucle autour du tableau des serveurs Wow, et qui va taper dans l'API pour récuperer
   * * l'url qui contient le flux JSON de l'hotel des ventes *
   * ! Certains serveurs plante, l'exception est normalement gérée et le script continu
   * @param ne prend aucun paramètre
   */

  // *Je réinitialise le tableau
  auctions = [];

  let ArrayUrls = realm.map(async scan => {
    await axios
      .get(
        `https://eu.api.blizzard.com/wow/auction/data/${
          scan.realm
        }?locale=fr_FR&access_token=${token}`
      )
      .then(auctionsUrl => {
        /**
         * *Push toutes les urls dans le tableau urls, pour être résolue plus tard
         */
        urls.push(auctionsUrl.data.files[0].url);
      })
      .catch(error => {
        console.log(error);
      });
  });

  /**
   * *Attends que toutes les urls soient piush dans le tableau avant de résoudre,
   * *afin d'éviter que axios ne plante (trop de requête en même temps)
   */
  await Promise.all(ArrayUrls);

  /**
   * *Une fois toutes les urls obtenues et stockés dans le tableau urls, on lance la fonction fetchUrls
   */
  //fetchUrls();
  fetchUrls(urls);
  console.log(urls);
};

/**
 * @param Array arr : liste d'urls
 * *Fonction récursive, qui va effectuer un appel asynchrone sur chaque url du tableau "arr",
 * *Une fois que les données ont étés traités, la fonction s'appelle elle même jusqu'à ce que
 * *toutes les urls soivent traitées
 */
const fetchUrls = arr => {
  let index = 0;
  // * Fonction qui va être appellée de manière récursive
  const request = () => {
    return axios
      .get(arr[index])
      .then(res => {
        index++;
        res.data.auctions.map(item => {
          // * Liste des objets à rechercher (va être dynamique)
          if (
            item.item === 1121 ||
            item.item === 12994 ||
            item.item === 2911 ||
            item.item === 12987 ||
            item.item === 12977
          ) {
            auctions.push(item);
            console.log(
              "************************* ITEM 28 ILVL FOUND***************************"
            );
            console.log(item);
            console.log(
              "******************************************************************"
            );

            console.log("wrong ilevel..");
          }
        });
        if (index >= arr.length) {
          // * toutes les urls on étés fetch
          console.log("done");
          console.log(auctions);
          const newAuction = new Auction({
            auctions: auctions
          });
          newAuction
            .save()
            .then(response => {
              console.log(response);
              if (auctions.length > 0) {
                sendmail(
                  {
                    from: "serranicolas0904@gmail.com",
                    to: "twinkunivers@gmail.com",
                    subject: "NOTIFICATION NOUVEL ITEM RARE",
                    html:
                      "<h1>UN NOUVEL ITEM RARE A ÉTÉ TROUVÉ PAR GEAR HUNTER</h1> <a href='https://gearhunter.herokuapp.com/dashboard/items'>Voir tout</a> "
                  },
                  function(err, reply) {
                    console.dir(reply);
                    if (!err) res.json("envoyé").status(200);
                    else res.json("error").status(401);
                  }
                );
              }
            })
            .catch(error => {
              console.log(error);
            });

          return "done";
        }
        // !Appel récursif
        return request();
      })
      .catch(error => {
        console.log(error);
        // !Appel récursif
        return request();
      });
  };

  return request();
};

setTimeout(() => {
  getUrls();
}, 10000);

setInterval(() => {
  getUrls();
}, 3600000);

// @route GET api/scanner/scann
// @desc Register user
// @access Public
router.get("/get/all", (req, res) => {
  Auction.find({}, (err, auctions) => {
    if (err) return res.json("error").status(401);
    else return res.json(auctions).status(200);
  })
    .sort({ $natural: -1 })
    .limit(1);
});

module.exports = router;
