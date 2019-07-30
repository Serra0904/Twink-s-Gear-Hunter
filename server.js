const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const axios = require("axios");
const users = require("./routes/api/users");
const app = express();
const keys = require("./config/keys");

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
      "grant_type=client_credentials&scope=all&client_id=87942a232baa4b41842d6191424aec43&client_secret=dXHfQu81sA9Fl8aYn2w8EV2RkaQ9sMyv"
    )
    .then(function(res) {
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
}, 21600000);

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
  { realm: "Aggra", zone: "po" },
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
  { realm: "Greymane", zone: "ru" },
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
  { realm: "Tyrande", zone: "es" }
];

let urls = [];

const getUrls = async () => {
  /**
   * * Get urls est une fonction asynchrone qui boucle autour du tableau des serveurs Wow, et qui va taper dans l'API pour récuperer
   * * l'url qui contient le flux JSON de l'hotel des ventes *
   * ! Certains serveurs plante, l'exception est normalement gérée et le script continu
   * @param ne prend aucun paramètre
   */

  let ArrayUrls = realm.map(async scan => {
    await axios
      .get(
        `https://eu.api.blizzard.com/wow/auction/data/${
          scan.realm
        }?locale=fr_FR&access_token=USDpydF7Bg9326Ssj6zxFgTIQfwnSMkbJ5`
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
            if (item.bonusLists !== undefined) {
              if (item.bonusLists[0].bonusListId === 3901) {
                console.log(
                  "************************* ITEM 28 ILVL FOUND***************************"
                );
                console.log(item);
                console.log(
                  "******************************************************************"
                );
              }
            }
            console.log("...");
          }
        });
        if (index >= arr.length) {
          // * toutes les urls on étés fetch
          console.log("done");

          // !Appel récursif
          return "done";
        }
        // !Appel récursif
        return request();
      })
      .catch(error => {
        console.log(error);
      });
  };

  return request();
};

getUrls();

setInterval(() => {
  getUrls();
}, 3600000);

// Routes
app.use("/api/users", users);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server up and running on port ${port} !`));
