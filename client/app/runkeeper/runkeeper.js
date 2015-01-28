'use strict';

angular.module('drunkeeperApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/runkeeper', {
        templateUrl: 'app/runkeeper/runkeeper.html',
        controller: 'RunkeeperCtrl'
      })
      .when('/runkeeper/success/:token', {
        templateUrl: 'app/runkeeper/runkeeper.html',
        controller: 'RunkeeperCallbackCtrl'
      });
  });
