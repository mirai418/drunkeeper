'use strict';

angular.module('drunkeeperApp')
  .controller('UserCtrl', function ($scope, $http, User, Auth, socket) {

    $scope.loading = {};

    $scope.user = Auth.getCurrentUser();
    Auth.isLoggedInAsync(function () {
      socket.socket.on('user' + String($scope.user.runkeeperId) + ':save', function (res) {
        $scope.user = res;
      });
      $http.post('/api/users/calcScore').success(function () {
      });
    });

    $scope.drink = function () {
      if ($scope.loading.plus) {
        return;
      }
      $scope.loading.plus = true;
      $http.post('/api/users/drink').success(function () {
        $scope.loading.plus = false;
        $scope.user.score = $scope.user.score + 1;
      });
    };

    $scope.undrink = function () {
      if ($scope.loading.minus) {
        return;
      }
      $scope.loading.minus = true;
      $http.post('/api/users/undrink').success(function () {
        $scope.loading.minus = false;
        $scope.user.score = $scope.user.score - 1;
      });
    };

    $scope.getScore = function () {
      return Math.floor($scope.user.score);
    };

    $scope.getScore = function () {
      if ($scope.user) {
        return Math.floor($scope.user.score);
      } else {
        return '';
      }
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('user' + String($scope.user.runkeeperId));
    });

  });
