/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /drinks              ->  index
 * POST    /drinks              ->  create
 * GET     /drinks/:id          ->  show
 * PUT     /drinks/:id          ->  update
 * DELETE  /drinks/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Drink = require('./drink.model');

// Get list of drinks
exports.index = function(req, res) {
  Drink.find(function (err, drinks) {
    if(err) { return handleError(res, err); }
    return res.json(200, drinks);
  });
};

// Get a single drink
exports.show = function(req, res) {
  Drink.findById(req.params.id, function (err, drink) {
    if(err) { return handleError(res, err); }
    if(!drink) { return res.send(404); }
    return res.json(drink);
  });
};

// Creates a new drink in the DB.
exports.create = function(req, res) {
  Drink.create(req.body, function(err, drink) {
    if(err) { return handleError(res, err); }
    return res.json(201, drink);
  });
};

// Updates an existing drink in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Drink.findById(req.params.id, function (err, drink) {
    if (err) { return handleError(res, err); }
    if(!drink) { return res.send(404); }
    var updated = _.merge(drink, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, drink);
    });
  });
};

// Deletes a drink from the DB.
exports.destroy = function(req, res) {
  Drink.findById(req.params.id, function (err, drink) {
    if(err) { return handleError(res, err); }
    if(!drink) { return res.send(404); }
    drink.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}