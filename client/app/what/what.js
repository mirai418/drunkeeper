'use strict';

angular.module('drunkeeperApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/what', {
        templateUrl: 'app/what/what.html',
        controller: 'WhatCtrl'
      });
  });
