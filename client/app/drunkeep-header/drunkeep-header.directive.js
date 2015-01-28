'use strict';

angular.module('drunkeeperApp')
  .directive('drunkeepHeader', function ($location, Auth) {
    return {
      templateUrl: 'app/drunkeep-header/drunkeep-header.html',
      restrict: 'EA',
      link: function (scope) {

        scope.isLoggedIn = Auth.isLoggedInAsync(function (response){
          scope.isLoggedIn = response;
          if (scope.isLoggedIn) {
            scope.user = Auth.getCurrentUser();
          }
        });

        scope.isPath = function (path) {
          return $location.$$path === path;
        };

        scope.logout = function () {
          Auth.logout();
          $location.path('/');
        };

        scope.$watch(function () {
          return Auth.getCurrentUser();
        }, function () {
          scope.isLoggedIn = Auth.isLoggedInAsync(function (response){
            scope.isLoggedIn = response;
            if (scope.isLoggedIn) {
              scope.user = Auth.getCurrentUser();
            }
          });
        });

      }
    };
  });