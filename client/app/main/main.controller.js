'use strict';

/**
* This controller should be the landing page to the site, as well as just the
* general page to see how Mirai's doing in his drun-keeping.
*
* It will query for Mirai's current drun-keep number and just display it on the
* page.
*/

angular.module('drunkeeperApp')
.controller('MainCtrl', function ($scope, $http, socket) {

  $http.get('/api/users/mirai').success(function (response) {
    $scope.mirai = response;
    // $scope.mirai.push(response);
    // console.log(response);
    socket.socket.on('mirai:save', function (res) {
      $scope.mirai = res;
    });
  });

  $scope.$on('$destroy', function () {
    socket.unsyncUpdates('mirai:save');
  });

  $scope.getScore = function () {
    if ($scope.mirai) {
      return Math.floor($scope.mirai.score);
    } else {
      return '';
    }
  };

});
