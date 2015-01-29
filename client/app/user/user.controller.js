'use strict';

angular.module('drunkeeperApp')
  .controller('UserCtrl', function ($scope, $http, User, Auth, socket) {

    $scope.user = Auth.getCurrentUser();
    $scope.$watch(function () {
      return $scope.user;
    }, function (newValue) {
      socket.socket.on('user' + String(newValue.runkeeperId) + ':save', function (res) {
        $scope.user = res;
      });
    });

    $http.post('/api/users/compute').success(function() {
    });

    $scope.drink = function () {
      $http.post('/api/users/drink').success(function() {
        $scope.user.score = $scope.user.score + 1;
      });
    };

    $scope.undrink = function () {
      $http.post('/api/users/undrink').success(function() {
        $scope.user.score = $scope.user.score - 1;
      });
    };

    $scope.getScore = function () {
      return Math.floor($scope.user.score);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('user' + String($scope.user.runkeeperId));
    });

  });
