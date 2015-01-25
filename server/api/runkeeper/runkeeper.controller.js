'use strict';

var _ = require('lodash');
var Runkeeper = require('./runkeeper.model');


// Test
exports.test = function(req, res) {
  console.log('--> test');
  Runkeeper.find(function (err, runkeepers) {
    if(err) { return handleError(res, err); }
    return res.json(200, runkeepers);
  });
};


// Get list of runkeepers
exports.index = function(req, res) {
  Runkeeper.find(function (err, runkeepers) {
    if(err) { return handleError(res, err); }
    return res.json(200, runkeepers);
  });
};

// Get a single runkeeper
exports.show = function(req, res) {
  Runkeeper.findById(req.params.id, function (err, runkeeper) {
    if(err) { return handleError(res, err); }
    if(!runkeeper) { return res.send(404); }
    return res.json(runkeeper);
  });
};

// Creates a new runkeeper in the DB.
exports.create = function(req, res) {
  Runkeeper.create(req.body, function(err, runkeeper) {
    if(err) { return handleError(res, err); }
    return res.json(201, runkeeper);
  });
};

// Updates an existing runkeeper in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Runkeeper.findById(req.params.id, function (err, runkeeper) {
    if (err) { return handleError(res, err); }
    if(!runkeeper) { return res.send(404); }
    var updated = _.merge(runkeeper, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, runkeeper);
    });
  });
};

// Deletes a runkeeper from the DB.
exports.destroy = function(req, res) {
  Runkeeper.findById(req.params.id, function (err, runkeeper) {
    if(err) { return handleError(res, err); }
    if(!runkeeper) { return res.send(404); }
    runkeeper.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}