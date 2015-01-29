/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

// var User = require('../api/user/user.model');

// User.find({}).remove(function() {
  // User.create({
  //   provider: 'local',
  //   role: 'user',
  //   email: 'mirai418@me.com',
  //   password: 'asdfasdf'
  // }, {
  //   provider: 'local',
  //   role: 'admin',
  //   email: 'admin@admin.com',
  //   password: 'admin'
  // }, function() {
  //     console.log('finished populating users');
  //   }
  // );
// });

var User = require('../api/user/user.model');

// User.find({}).remove(function () {

// });

User.findOrCreate({
  runkeeperId: 31503880
}, function(err, user) {
  // user.drinks = [];

  // user.runs = [];

  // user.getNewRuns(function () {
  //   user.drinks.push({
  //     date: new Date(2015, 0, 12)
  //   });
  //   user.drinks.push({
  //     date: new Date(2015, 0, 12)
  //   });
  //   user.drinks.push({
  //     date: new Date(2015, 0, 15)
  //   });
  //   user.drinks.push({
  //     date: new Date(2015, 0, 15)
  //   });
  //   user.drinks.push({
  //     date: new Date(2015, 0, 15)
  //   });
  //   user.drinks.push({
  //     date: new Date(2015, 0, 15)
  //   });
  //   user.drinks.push({
  //     date: new Date(2015, 0, 15)
  //   });
  //   user.drinks.push({
  //     date: new Date(2015, 0, 16)
  //   });
  //   user.drinks.push({
  //     date: new Date(2015, 0, 16)
  //   });
  //   user.drinks.push({
  //     date: new Date(2015, 0, 16)
  //   });
  //   user.drinks.push({
  //     date: new Date(2015, 0, 16)
  //   });
  //   user.drinks.push({
  //     date: new Date(2015, 0, 16)
  //   });
  //   user.drinks.push({
  //     date: new Date(2015, 0, 16)
  //   });
  //   user.drinks.push({
  //     date: new Date(2015, 0, 18)
  //   });
  //   user.drinks.push({
  //     date: new Date(2015, 0, 18)
  //   });
  //   user.drinks.push({
  //     date: new Date(2015, 0, 18)
  //   });
  //   user.drinks.push({
  //     date: new Date(2015, 0, 18)
  //   });
  //   user.drinks.push({
  //     date: new Date(2015, 0, 18)
  //   });
  //   user.drinks.push({
  //     date: new Date(2015, 0, 18)
  //   });
  //   user.drinks.push({
  //     date: new Date(2015, 0, 18)
  //   });
  //   user.drinks.push({
  //     date: new Date(2015, 0, 18)
  //   });
  //   user.drinks.push({
  //     date: new Date(2015, 0, 18)
  //   });
  //   user.drinks.push({
  //     date: new Date(2015, 0, 20)
  //   });
  //   user.drinks.push({
  //     date: new Date(2015, 0, 20)
  //   });
  //   user.drinks.push({
  //     date: new Date(2015, 0, 20)
  //   });
  //   user.drinks.push({
  //     date: new Date(2015, 0, 20)
  //   });
  //   user.drinks.push({
  //     date: new Date(2015, 0, 20)
  //   });
  //   user.drinks.push({
  //     date: new Date(2015, 0, 20)
  //   });
  //   user.drinks.push({
  //     date: new Date(2015, 0, 20)
  //   });
  //   user.drinks.push({
  //     date: new Date(2015, 0, 23)
  //   });
  //   user.drinks.push({
  //     date: new Date(2015, 0, 23)
  //   });
  //   user.drinks.push({
  //     date: new Date(2015, 0, 23)
  //   });
  //   user.drinks.push({
  //     date: new Date(2015, 0, 26)
  //   });
  //   user.score = 6.05;
  //   user.lastUpdated = new Date(2015, 0, 28);
  //   user.save();
    console.log(user);
  // });

});
