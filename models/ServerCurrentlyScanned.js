const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 *  *Je vais enregistrer en base les serveurs qui sont en train d'être scanné, parce que c'est cool
 */

// Create Schema
const ServerCurrentlyScanned = new Schema({
  servers: {
    type: Array,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = ServerScanned = mongoose.model(
  "serverCurrentlyScanned",
  ServerCurrentlyScanned
);
