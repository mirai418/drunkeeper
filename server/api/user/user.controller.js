'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');

var validationError = function (res, err) {
  return res.json(422, err);
};


/**
 * Get's mirai's data.
 */
exports.mirai = function (req, res) {
  User.findOne({
    runkeeperId: 31503880
  }, '-salt -hashedPassword -email -provider -role', function (err, user) {
    if(err) return res.send(500, err);
    if (!user) return res.json(401);
    res.json(user);
    user.calcScore([], function () {
      user.save(function (err) {
      });
    });
  });
};


/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function (req, res) {
  User.find({}, '-salt -hashedPassword', function (err, users) {
    if(err) return res.send(500, err);
    res.json(200, users);
  });
};


/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save(function (err, user) {
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
    res.json({ token: token });
  });
};


/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(401);
    res.json(user.profile);
  });
};


/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function (req, res) {
  User.findByIdAndRemove(req.params.id, function (err, user) {
    if(err) return res.send(500, err);
    return res.send(204);
  });
};


/**
 * Change a users password
 */
exports.changePassword = function (req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function (err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};


/**
 * Get my info
 */
exports.me = function (req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword -accessToken', function (err, user) {
    if (err) return next(err);
    if (!user) return res.json(401);
    res.json(user);
  });
};


/**
 * Add a drink
 */
exports.drink = function (req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function (err, user) {
    if (err) return next(err);
    if (!user) return res.json(401);
    user.drinks.push({});
    user.calcScore([user.drinks[user.drinks.length - 1]], function () {
      // user.score = user.score + 1;
      user.save(function (err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    })
  });
};


/**
 * Remove a drink
 */
exports.undrink = function (req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function (err, user) {
    if (err) return next(err);
    if (!user) return res.json(401);
    user.drinks.pop();
    user.score = user.score - 1;
    user.save(function (err) {
      if (err) return validationError(res, err);
      res.send(200);
    });
  });
};


/**
 * compute a score based on an existing score
 */
exports.calcScore = function (req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function (err, user) {
    if (err) return next(err);
    if (!user) return res.json(401);
    user.calcScore([], function () {
      user.save(function (err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    });
  });
};


/**
 * Recalculates everything from scratch. takes longer so don't do it too much.
 */
exports.recalcScore = function (req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function (err, user) {
    if (err) return next(err);
    if (!user) return res.json(401);
    user.recalcScore(function () {
      user.save(function (err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    })
  });
};


/**
 * Authentication callback
 */
exports.authCallback = function (req, res, next) {
  res.redirect('/');
};
