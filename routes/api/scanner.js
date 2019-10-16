const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");
const axios = require("axios");
const sendmail = require("sendmail")({ silent: true });
const Nexmo = require("nexmo");

const nexmo = new Nexmo({
  apiKey: "68216ee7",
  apiSecret: "rUiSBsUTKxRDJ49t"
});

// * Je charge les modèles de base de données dont j'ai besoin
const Auction = require("../../models/Auctions");
const User = require("../../models/User.js");
const ServerCurrentlyScanned = require("../../models/ServerCurrentlyScanned.js");
const ItemSearched = require("../../models/ItemSearched");

//* serveurs
const realms = require("../../config/serverWow");

// *tableau qui va contenir toutes les urls avec les data en json
let urls = [];
// *Tableau qui va contenir toutes les enchères en cours
var auctions = [];
// *Tableau qui va contenir les items à chercher
let idItems = [];

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
 *
 * @param {*} id
 * @param {*} ilvl
 * @param {*} item
 */
const notification = (numero, email, item = null) => {
  //*Envoie du SMS de notification
  const from = "GearHunter";
  const to = numero;
  const text = `
    UN NOUVEL ITEM A ETE TROUVE
    item : ${item.item}.
    serveur : ${item.ownerRealm}.
    prix : ${item.buyout} coppers.
    `;
  nexmo.message.sendSms(from, to, text);

  //* Envoie du mail de notification
  sendmail(
    {
      from: "twinkunivers@gmail.com",
      to: email,
      subject: "NOTIFICATION NOUVEL ITEM RARE",
      html: `<h1>UN NOUVEL ITEM RARE A ÉTÉ TROUVÉ PAR GEAR HUNTER</h1> <a href='https://gearhunter.herokuapp.com/dashboard/items'>Voir tout</a> <br> <h1>&{item}</h1> `
    },
    function(err, reply) {
      console.dir(reply);
      if (!err) console.log("ok");
      else console.log("error");
    }
  );
};

/**
 * @params Prend en paramètre l'id de l'item recherché, id, et l'ilvl, ilvl
 * *La fonction doit permettre de gérer dynamiquement les tests ilvl
 *
 */
const findItem = (id, ilvl, item) => {
  //*Vérification si l'id de l'enchère correspond à l'id recehrché
  if (id === item.item) {
    //* si l'item de l'enchère n'a pas de bonus ILVL, je skip
    if (item.bonusLists !== undefined) {
      //* Je vérifie si l'ilvl de l'item est dans la tableau des ilvl recherchés
      console.log(item.bonusLists[0].bonusListId);
      console.log(ilvl);

      if (ilvl.includes(item.bonusLists[0].bonusListId)) {
        //* Je vérifie si le vendeur de l'objet n'est pas Htag, devra-t-être dynamique par la suite
        //* J'initialise un checkeur à false
        let checkAlreadyExist = false;

        //* Je map sur le tableau d'auctions pour vérifier si l'encher n'existe pas déjà
        auctions.map(auction => {
          auction.auc === item.auc ? (checkAlreadyExist = true) : "";
        });

        //* Je push l'item dans le tableau des enchères
        if (!checkAlreadyExist) {
          auctions.push(item);
          notification("33784006727", "twinkunivers@gmail.com", item);
        }
      } else if (item.bonusLists === undefined && ilvl.includes(0)) {
        console.log("ITEM RARE SANS ILVL TROUVE");
        console.log(item);
      } else {
        console.log("wrong ilvl");
        //console.log(item);
      }
    } else if (item.bonusLists === undefined && ilvl.includes(0)) {
      console.log("ITEM RARE SANS ILVL TROUVE");
      console.log(item);
    }
  }
};

/**
 * * Get urls est une fonction asynchrone qui boucle autour du tableau des serveurs Wow, et qui va taper dans l'API pour récuperer
 * * l'url qui contient le flux JSON de l'hotel des ventes *
 * ! Certains serveurs plante, l'exception est normalement gérée et le script continu
 * @param ne prend aucun paramètre
 */

const getUrls = async () => {
  // *Je réinitialise le tableau des urls
  urls = [];
  // *Je réinitialise le tableau des enchères
  auctions = [];

  await ItemSearched.find({ _id: "5d88820b91b1900904cab8f7" })
    .then(response => {
      console.log(response[0].items);
      idItems = response[0].items;
    })
    .catch(error => {
      console.log(error);
    });

  let ArrayUrls = realms.map(async scan => {
    await axios
      .get(
        `https://eu.api.blizzard.com/wow/auction/data/${scan.realm}?locale=fr_FR&access_token=${token}`
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
   * *Attends que toutes les urls soient push dans le tableau avant de résoudre,
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
  console.log("DEBUT DU SCAN");
  let index = 0;
  // * Fonction qui va être appellée de manière récursive
  const request = () => {
    try {
      return axios
        .get(arr[index])
        .then(res => {
          index++;
          /**
           *  J'enregistre en base la liste des serveurs qui sont en train d'être scanné..
           */
          let currentServer = new ServerCurrentlyScanned({
            servers: res.data.realms
          });
          currentServer
            .save()
            .then(res => {
              //console.log("res: ", res);
            })
            .catch(error => {
              //console.log("error: ", error);
            });
          /**
           *  ! Ici, j'ai enregistré les serveurs qui vont être scanné, et je commence le scann !
           */

          res.data.auctions.map(auctionItem => {
            // * Liste des objets à rechercher (va être dynamique)

            idItems.map(itemSearched => {
              idItem = itemSearched[0];
              ilvlItem = itemSearched[1];
              findItem(idItem, ilvlItem, auctionItem);
            });
          });

          if (index >= arr.length) {
            // * toutes les urls on étés fetch
            console.log(
              "************************** DONE *****************************"
            );
            console.log(auctions);
            const newAuction = new Auction({
              auctions: auctions,
              region: "EU"
            });
            newAuction
              .save()
              .then(response => {
                console.log(response);
                if (auctions.length > 0) {
                  sendmail(
                    {
                      from: "twinkunivers@gmail.com",
                      to: "twinkunivers@gmail.com",
                      subject: "NOTIFICATION NOUVEL ITEM RARE",
                      html:
                        "<h1>UN NOUVEL ITEM RARE A ÉTÉ TROUVÉ PAR GEAR HUNTER</h1> <a href='https://gearhunter.herokuapp.com/dashboard/items'>Voir tout</a> "
                    },
                    function(err, reply) {
                      console.dir(reply);
                      // *Je réinitialise le tableau des enchères
                      if (!err) console.log("ok");
                      else console.log("error");
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
    } catch (error) {
      console.log(error);
    }
  };

  return request();
};

setTimeout(() => {
  getUrls();
}, 10000);

setInterval(() => {
  getUrls();
}, 2000000);

// @route GET api/scanner/scann
// @desc Récupère la dernière enchère
// @access Public
router.post("/get/all", (req, res) => {
  console.log(req.body);
  Auction.find({}, (err, auctions) => {
    if (err) return res.json("error").status(401);
    else return res.json(auctions).status(200);
  })
    .sort({ $natural: -1 })
    .limit(1);
});

// @route GET api/scanner/lastServerScanned
// @desc ROUTE QUI ME PERMET DE RECUP LE DERNIER SERVEUR SCANN DEPUIS LE FRONT
// @access Public
router.post("/get/lastServerScanned", (req, res) => {
  ServerCurrentlyScanned.find({}, (err, servers) => {
    if (err) return res.json("error").status(401);
    else return res.json(servers).status(200);
  })
    .sort({ $natural: -1 })
    .limit(1);
});

module.exports = router;
