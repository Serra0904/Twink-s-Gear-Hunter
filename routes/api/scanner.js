const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");
const axios = require("axios");
const sendmail = require("sendmail")({ silent: true });

// * Je charge le modèle des enchères
const Auction = require("../../models/Auctions");
const User = require("../../models/User.js");
const ServerCurrentlyScanned = require("../../models/ServerCurrentlyScanned.js");

// *tableau qui va contenir toutes les urls avec les data en json
let urls = [];
// *Tableau qui va contenir toutes les enchères en cours
let auctions = [];

// * Tableau qui va contenir les id des items recherchés par l'utilisateur
let idItems = [1121, 12994, 2911, 12987, 12977, 4446];

// * Tableau qui va contenir les id des ilvl recherchés par l'utilisateur
let ilevels = [3901, 4268, 3904, 3942, 3941, 4269, 4270, 3902, 3903, 3904];

/**
 * @params Prend en paramètre l'id de l'item recherché, id, et l'ilvl, ilvl
 * *La fonction doit permettre de gérer dynamiquement les tests ilvl
 * ! FONCTION EN TEST, NE PAS PUSH EN PRODUCTION !
 */

const findItem = (id, ilvl, item) => {
  if (id === item.item) {
    console.log(item.bonusLists);
    if (item.bonusLists !== undefined) {
      console.log("1");
      console.log(ilvl);
      console.log(item.bonusLists[0].bonusLists);
      if (ilvl.includes(item.bonusLists[0].bonusLists)) {
        auctions.push(item);
        sendmail(
          {
            from: "serranicolas0904@gmail.com",
            to: "twinkunivers@gmail.com",
            subject: "NOTIFICATION NOUVEL ITEM RARE",
            html: `<h1>UN NOUVEL ITEM RARE A ÉTÉ TROUVÉ PAR GEAR HUNTER</h1> <a href='https://gearhunter.herokuapp.com/dashboard/items'>Voir tout</a> <br> <h1>&{item}</h1> `
          },
          function(err, reply) {
            console.dir(reply);
            if (!err) console.log("ok");
            else console.log("error");
          }
        );
        console.log(
          "************************* ITEM 28 ILVL FOUND ***************************"
        );
        console.log(item);
        console.log(
          "******************************************************************"
        );
      } else {
        console.log("wrong ilevel..");
      }
    }
  }
};

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
  { realm: "Zuluhed", zone: "ge" },
  { realm: "Nemesis", zone: "it" },
  { realm: "Pozzo dell'Eternità", zone: "it" },
  { realm: "Ashenvale", zone: "ru" },
  { realm: "Azuregos", zone: "ru" },
  { realm: "Blackscar", zone: "ru" },
  { realm: "Booty Bay", zone: "ru" },
  { realm: "Borean Tundra", zone: "ru" },
  { realm: "Deathguard", zone: "ru" },
  { realm: "Deathweaver", zone: "ru" },
  { realm: "Deepholm", zone: "ru" },
  { realm: "Eversong", zone: "ru" },
  { realm: "Fordragon", zone: "ru" },
  { realm: "Galakrond", zone: "ru" },
  { realm: "Goldrinn", zone: "ru" },
  { realm: "Gordunni", zone: "ru" },
  { realm: "Grom", zone: "ru" },
  { realm: "Howling Fjord", zone: "ru" },
  { realm: "Lich King", zone: "ru" },
  { realm: "Razuvious", zone: "ru" },
  { realm: "Soulflayer", zone: "ru" },
  { realm: "Thermaplugg", zone: "ru" },
  { realm: "C'Thun", zone: "es" },
  { realm: "Colinas Pardas", zone: "es" },
  { realm: "Dun Modr", zone: "es" },
  { realm: "Exodar", zone: "es" },
  { realm: "Los Errantes", zone: "es" },
  { realm: "Minahonda", zone: "es" },
  { realm: "Sanguino", zone: "es" },
  { realm: "Shen'dralar", zone: "es" },
  { realm: "Tyrande", zone: "es" },
  { realm: "Uldum", zone: "es" },
  { realm: "Zul'jin", zone: "es" },
  { realm: "Tyrande", zone: "es" },
  { realm: "Aerie Peak", zone: "uk" },
  { realm: "Agamaggan", zone: "uk" },
  { realm: "Aggramar", zone: "uk" },
  { realm: "Ahn'Qiraj", zone: "uk" },
  { realm: "Al'Akir", zone: "uk" },
  { realm: "Alonsus", zone: "uk" },
  { realm: "Anachronos", zone: "uk" },
  { realm: "Arathor", zone: "uk" },
  { realm: "Argent Dawn", zone: "uk" },
  { realm: "Aszune", zone: "uk" },
  { realm: "Auchindoun", zone: "uk" },
  { realm: "Azjol-Nerub", zone: "uk" },
  { realm: "Azuremyst", zone: "uk" },
  { realm: "Balnazzar", zone: "uk" },
  { realm: "Blade's Edge", zone: "uk" },
  { realm: "Bladefist", zone: "uk" },
  { realm: "Bloodfeather", zone: "uk" },
  { realm: "Bloodhoof", zone: "uk" },
  { realm: "Bloodscalp", zone: "uk" },
  { realm: "Boulderfist", zone: "uk" },
  { realm: "Bronze Dragonflight", zone: "uk" },
  { realm: "Bronzebeard", zone: "uk" },
  { realm: "Burning Blade", zone: "uk" },
  { realm: "Burning Legion", zone: "uk" },
  { realm: "Burning Steppes", zone: "uk" },
  { realm: "Chamber of Aspects", zone: "uk" },
  { realm: "Chromaggus", zone: "uk" },
  { realm: "Crushridge", zone: "uk" },
  { realm: "Daggerspine", zone: "uk" },
  { realm: "Darkmoon Faire", zone: "uk" },
  { realm: "Darksorrow", zone: "uk" },
  { realm: "Darkspear", zone: "uk" },
  { realm: "Deathwing", zone: "uk" },
  { realm: "Defias Brotherhood", zone: "uk" },
  { realm: "Dentarg", zone: "uk" },
  { realm: "Doomhammer", zone: "uk" },
  { realm: "Draenor", zone: "uk" },
  { realm: "Dragonblight", zone: "uk" },
  { realm: "Dragonmaw", zone: "uk" },
  { realm: "Drak'thul", zone: "uk" },
  { realm: "Dunemaul", zone: "uk" },
  { realm: "Earthen Ring", zone: "uk" },
  { realm: "Emerald Dream", zone: "uk" },
  { realm: "Emeriss", zone: "uk" },
  { realm: "Eonar", zone: "uk" },
  { realm: "Executus", zone: "uk" },
  { realm: "Frostmane", zone: "uk" },
  { realm: "Frostwhisper", zone: "uk" },
  { realm: "Genjuros", zone: "uk" },
  { realm: "Ghostlands", zone: "uk" },
  { realm: "Grim Batol", zone: "uk" },
  { realm: "Hakkar", zone: "uk" },
  { realm: "Haomarush", zone: "uk" },
  { realm: "Hellfire", zone: "uk" },
  { realm: "Hellscream", zone: "uk" },
  { realm: "Jaedenar", zone: "uk" },
  { realm: "Karazhan", zone: "uk" },
  { realm: "Kazzak", zone: "uk" },
  { realm: "Khadgar", zone: "uk" },
  { realm: "Kilrogg", zone: "uk" },
  { realm: "Kor'gall", zone: "uk" },
  { realm: "Kul Tiras", zone: "uk" },
  { realm: "Laughing Skull", zone: "uk" },
  { realm: "Lightbringer", zone: "uk" },
  { realm: "Lightning's Blade", zone: "uk" },
  { realm: "Magtheridon", zone: "uk" },
  { realm: "Mazrigos", zone: "uk" },
  { realm: "Moonglade", zone: "uk" },
  { realm: "Nagrand", zone: "uk" },
  { realm: "Neptulon", zone: "uk" },
  { realm: "Tyrande", zone: "uk" },
  { realm: "Nordrassil", zone: "uk" },
  { realm: "Outland", zone: "uk" },
  { realm: "Quel'Thalas	", zone: "uk" },
  { realm: "Ragnaros", zone: "uk" },
  { realm: "Ravencrest", zone: "uk" },
  { realm: "Ravenholdt", zone: "uk" },
  { realm: "Runetotem", zone: "uk" },
  { realm: "Saurfang", zone: "uk" },
  { realm: "Scarshield Legion", zone: "uk" },
  { realm: "Shadowsong", zone: "uk" },
  { realm: "Shattered Halls", zone: "uk" },
  { realm: "Shattered Hand", zone: "uk" },
  { realm: "Silvermoon", zone: "uk" },
  { realm: "Skullcrusher", zone: "uk" },
  { realm: "Spinebreaker", zone: "uk" },
  { realm: "Sporeggar", zone: "uk" },
  { realm: "Steamwheedle Cartel", zone: "uk" },
  { realm: "Stormrage", zone: "uk" },
  { realm: "Stormreaver", zone: "uk" },
  { realm: "Stormscale", zone: "uk" },
  { realm: "Sunstrider", zone: "uk" },
  { realm: "Sylvanas", zone: "uk" },
  { realm: "Talnivarr", zone: "uk" },
  { realm: "Tarren Mill", zone: "uk" },
  { realm: "Terenas", zone: "uk" },
  { realm: "Terokkar", zone: "uk" },
  { realm: "The Maelstrom", zone: "uk" },
  { realm: "The Sha'tar", zone: "uk" },
  { realm: "The Venture Co", zone: "uk" },
  { realm: "Thunderhorn", zone: "uk" },
  { realm: "Trollbane", zone: "uk" },
  { realm: "Turalyon", zone: "uk" },
  { realm: "Twilight's Hammer", zone: "uk" },
  { realm: "Twisting Nether", zone: "uk" },
  { realm: "Vashj", zone: "uk" },
  { realm: "Vek'nilash", zone: "uk" },
  { realm: "Wildhammer", zone: "uk" },
  { realm: "Xavius", zone: "uk" },
  { realm: "Zenedar", zone: "uk" }
];

const getUrls = async () => {
  /**
   * * Get urls est une fonction asynchrone qui boucle autour du tableau des serveurs Wow, et qui va taper dans l'API pour récuperer
   * * l'url qui contient le flux JSON de l'hotel des ventes *
   * ! Certains serveurs plante, l'exception est normalement gérée et le script continu
   * @param ne prend aucun paramètre
   */

  // *Je réinitialise le tableau des enchères
  auctions = [];
  // *Je réinitialise le tableau des urls
  urls = [];

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

          res.data.auctions.map(item => {
            // * Liste des objets à rechercher (va être dynamique)

            idItems.map(id => {
              findItem(id, ilevels, item);
            });

            /*  if (
              item.item === 1121 ||
              item.item === 12994 ||
              item.item === 2911 ||
              item.item === 12987 ||
              item.item === 12977 ||
              item.item === 4446
            ) {
              if (item.bonusLists !== undefined) {
                if (item.bonusLists[0].bonusListId === 3901) {
                  auctions.push(item);
                  sendmail(
                    {
                      from: "serranicolas0904@gmail.com",
                      to: "twinkunivers@gmail.com",
                      subject: "NOTIFICATION NOUVEL ITEM RARE",
                      html: `<h1>UN NOUVEL ITEM RARE A ÉTÉ TROUVÉ PAR GEAR HUNTER</h1> <a href='https://gearhunter.herokuapp.com/dashboard/items'>Voir tout</a> <br> <h1>&{item}</h1> `
                    },
                    function(err, reply) {
                      console.dir(reply);
                      if (!err) console.log("ok");
                      else console.log("error");
                    }
                  );
                  console.log(
                    "************************* ITEM 28 ILVL FOUND ***************************"
                  );
                  console.log(item);
                  console.log(
                    "******************************************************************"
                  );
                }
              }
              console.log("wrong ilevel..");
            }
            */
          });

          if (index >= arr.length) {
            // * toutes les urls on étés fetch
            console.log("done");
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
                      from: "serranicolas0904@gmail.com",
                      to: "twinkunivers@gmail.com",
                      subject: "NOTIFICATION NOUVEL ITEM RARE",
                      html:
                        "<h1>UN NOUVEL ITEM RARE A ÉTÉ TROUVÉ PAR GEAR HUNTER</h1> <a href='https://gearhunter.herokuapp.com/dashboard/items'>Voir tout</a> "
                    },
                    function(err, reply) {
                      console.dir(reply);
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
}, 2400000);

let compteur = 0;
setInterval(() => {
  if (compteur === 40) {
    console.log(compteur);
    compteur = 0;
  } else {
    compteur = compteur + 10;
    console.log(compteur, " minutes");
  }
  console.log("10 minutes");
}, 600000);

// @route GET api/scanner/scann
// @desc Register user
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

// * ROUTE QUI ME PERMET DE RECUP LE DERNIER SERVEUR SCANN DEPUIS LE FRONT
router.post("/get/lastServerScanned", (req, res) => {
  ServerCurrentlyScanned.find({}, (err, servers) => {
    if (err) return res.json("error").status(401);
    else return res.json(servers).status(200);
  })
    .sort({ $natural: -1 })
    .limit(1);
});

module.exports = router;
