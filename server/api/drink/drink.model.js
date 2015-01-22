'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DrinkSchema = new Schema({
  name: String,
  count: Number,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Drink', DrinkSchema);