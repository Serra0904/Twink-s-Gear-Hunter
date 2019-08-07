const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 *  *Je vais enregistrer en base les serveurs qui sont en train d'être scanné, parce que c'est cool
 */

// Create Schema
const ServerCurrentluScanned = new Schema({
  servers: {
    type: Array,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model(
  "serverCurrentluScanned",
  ServerCurrentluScanned
);
