'use strict';

angular.module('drunkeeperApp')
  .directive('drunkeepHeader', function ($location, Auth) {
    return {
      templateUrl: 'app/drunkeep-header/drunkeep-header.html',
      restrict: 'EA',
      link: function (scope) {

        console.log(Auth);

        scope.isLoggedIn = Auth.isLoggedInAsync(function (response){
          scope.isLoggedIn = response;
          if (scope.isLoggedIn) {
            scope.user = Auth.getCurrentUser();
          }
        });

        scope.isHome = function () {
          return $location.$$path === '/';
        };

        scope.logout = function () {
          Auth.logout();
          console.log('logged out');
          $location.path('/');
        };

      }
    };
  });