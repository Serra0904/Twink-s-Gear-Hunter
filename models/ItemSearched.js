const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ItemsSchema = new Schema({
  items: {
    type: Array,
    required: true
  }
});

module.exports = User = mongoose.model(
  "itemSearched",
  ItemsSchema,
  "itemSearched"
);
