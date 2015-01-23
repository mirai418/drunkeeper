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

  $scope.mirai = [];

  $http.get('/api/users/mirai').success(function (response) {
    console.log(response);
    $scope.mirai.push(response);

    socket.syncUpdates('mirai', $scope.mirai);
  });

  $scope.$on('$destroy', function () {
    socket.unsyncUpdates('mirai');
  });

});
