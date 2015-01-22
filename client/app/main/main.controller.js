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

    console.log('main ctrl');

    $scope = $scope;
    $http = $http;
    socket = socket;

    // $scope.drink = {

    // }

    // $http.get('/api/drinks').success(function(awesomeDrinks) {
    //   console.log(awesomeDrinks);

    //   $scope.mainDrink  = awesomeDrinks[0];

    //   $scope.awesomeDrinks = awesomeDrinks;
    //   socket.syncUpdates('drink', $scope.awesomeDrinks);
    // });

    // $http.get('/api/users').success(function(allUsers) {
    //   console.log(allUsers);
    // });

    // $scope.addDrink = function() {
    //   if($scope.newDrink === '') {
    //     return;
    //   }
    //   $http.post('/api/drinks', { name: $scope.newDrink });
    //   $scope.newDrink = '';
    // };

    // $scope.editDrink = function() {
    //   var drink = $scope.awesomeDrinks[0];
    //   $http.put('/api/drinks/' + drink._id, { weh: drink.count + 1 });
    // };

    // $scope.deleteDrink = function(drink) {
    //   $http.delete('/api/drinks/' + drink._id);
    // };

    // $scope.$on('$destroy', function () {
    //   socket.unsyncUpdates('drink');
    // });

  });
