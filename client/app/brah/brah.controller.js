'use strict';

angular.module('drunkeeperApp')
  .controller('BrahCtrl', function ($scope, $http) {

    $scope.recalcScore = function () {
      console.log('recalcScore');
      $http.post('/api/users/recalcScore').success(function () {
      });
    };

  });
