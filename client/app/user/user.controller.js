'use strict';

angular.module('drunkeeperApp')
  .controller('UserCtrl', function ($scope, $http, User, Auth) {

    $scope.user = Auth.getCurrentUser();

    $scope.drink = function () {
      $http.post('/api/users/drink').success(function() {
        $scope.user.drinks.push({});
      });
    };

    $scope.undrink = function () {
      $http.post('/api/users/undrink').success(function() {
        $scope.user.drinks.pop();
      });
    };

  });
