'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');
var User = require('../../api/user/user.model');

var router = express.Router();

// router.post('/', function(req, res, next) {
//   passport.authenticate('local', function (err, user, info) {
//     var error = err || info;
//     if (error) return res.json(401, error);
//     if (!user) return res.json(404, {message: 'Something went wrong, please try again.'});

//     var token = auth.signToken(user._id, user.role);
//     res.json({token: token});
//   })(req, res, next)
// });

// GET /auth/runkeeper
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in RunKeeper authentication will involve
//   redirecting the user to runkeeper.com.  After authorization, RunKeeper
//   will redirect the user back to this application at /auth/runkeeper/callback
router.get('/runkeeper',
  passport.authenticate('runkeeper'),
  function(req, res){

    // passport = req._passport.instance;
    // console.log(passport._strategy('runkeeper'));

    // res.json(passport);

    // The request will be redirected to RunKeeper for authentication, so this
    // function will not be called.
  });

// GET /auth/runkeeper/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
// router.get('/runkeeper/callback',
  // passport.authenticate('runkeeper', { failureRedirect: '/login' }), function(req, res) {
  //   console.log('callback');
  //   console.log(res);
  //   console.log('callback done');
  //   res.redirect('/runkeeper/success');
    // var token = auth.signToken(user._id, user.role);
    // res.json({token: token});
router.get('/runkeeper/callback', function(req, res, next) {
  passport.authenticate('runkeeper', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/login')
    }
    console.log('passed callback');
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      console.log('passed login');
      var token = auth.signToken(user._id, user.role);
      res.redirect('/runkeeper/success/' + token);
      // return res.json({token: token});
    });
  })(req, res, next);

  // passport.authenticate('runkeeper', { failureRedirect: '/login' }), function(err, user, info) {
  //   if (err) {
  //     return next(err);
  //   }
  //   if (!user) {
  //     return res.redirect('http://localhost:8000');
  //   }
  //   console.log('test test');
  //   console.log(user._json);
  //   User.findOne({email: user._json.email}, function(err,usr) {
  //     res.writeHead(302, {
  //       'Location': 'http://localhost:8000/#/index?token=' + usr.token + '&user=' + usr.email
  //     });
  //     res.end();
  //   });
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

module.exports = router;