/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    role: 'user',
    email: 'mirai418@me.com',
    password: 'asdfasdf'
  }, {
    provider: 'local',
    role: 'admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, function() {
      console.log('finished populating users');
    }
  );
});