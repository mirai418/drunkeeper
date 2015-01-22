'use strict';

angular.module('drunkeeperApp')
  .controller('UserCtrl', function ($scope, User, Auth) {

    console.log(Auth.getCurrentUser());

    $scope.user = Auth.getCurrentUser();

    $scope.errors = {};

    $scope.changePassword = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
        .then( function() {
          $scope.message = 'Password successfully changed.';
        })
        .catch( function() {
          form.password.$setValidity('mongoose', false);
          $scope.errors.other = 'Incorrect password';
          $scope.message = '';
        });
      }
    };

  });
