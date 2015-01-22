'use strict';

angular.module('drunkeeperApp')
  .controller('LoginCtrl', function ($scope, Auth, $location) {
    $scope.user = {};
    $scope.errors = {};

    $scope.login = function(form) {

      $scope.error = false;

      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Logged in, redirect to home
          $location.path('/user');
        })
        .catch( function() {
          $scope.error = true;
        });
      } else {
        $scope.error = true;
      }
    };

    $scope.$watch(function () {
      return $scope.user.email;
    }, function (newValue) {
      if (!newValue) {
        $scope.error = false;
      }
    });

    $scope.$watch(function () {
      return $scope.user.password;
    }, function (newValue) {
      if (!newValue) {
        $scope.error = false;
      }
    });

  });

