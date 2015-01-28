'use strict';

angular.module('drunkeeperApp')
  .controller('RunkeeperCtrl', function ($scope) {

  })

  .controller('RunkeeperCallbackCtrl', function ($scope, $routeParams, $cookieStore, $location, User) {

    if (angular.isUndefined($routeParams.token) || $routeParams.token === "") {
      $location.path("/");
    } else {
      $cookieStore.put('token', $routeParams.token);
      User.get();
      $location.path("/user");
    }

  });