'use strict';

angular.module('drunkeeperApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/brah', {
        templateUrl: 'app/brah/brah.html',
        controller: 'BrahCtrl',
        authenticate: true
      });
  });
