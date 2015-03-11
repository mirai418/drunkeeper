'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/mirai', controller.mirai);
router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.post('/drink', auth.isAuthenticated(), controller.drink);
router.post('/undrink', auth.isAuthenticated(), controller.undrink);
router.post('/calcScore', auth.isAuthenticated(), controller.calcScore);
router.post('/recalcScore', auth.isAuthenticated(), controller.recalcScore);


router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);

module.exports = router;
