'use strict';

angular.module('drunkeeperApp')
  .controller('RunkeeperCtrl', function ($scope, $http) {
    $scope.message = 'Hello';

    $scope.login = function () {
      $http.get('/auth/runkeeper').success(function (response) {
        console.log('--> responded');
        console.log(response);
      });
    };

  });
