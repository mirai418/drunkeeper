'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');
var User = require('../../api/user/user.model');

var router = express.Router();

// GET /auth/runkeeper
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in RunKeeper authentication will involve
//   redirecting the user to runkeeper.com.  After authorization, RunKeeper
//   will redirect the user back to this application at /auth/runkeeper/callback
router.get('/runkeeper',
  passport.authenticate('runkeeper'),
  function (req, res) {
    // The request will be redirected to RunKeeper for authentication, so this
    // function will not be called.
  });

// GET /auth/runkeeper/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/runkeeper/callback', function(req, res, next) {
  passport.authenticate('runkeeper', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/runkeeper')
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      var token = auth.signToken(req.user._id, req.user.role);
      res.cookie('token', JSON.stringify(token));
      res.redirect('/user');
    });
  })(req, res, next);

});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

module.exports = router;