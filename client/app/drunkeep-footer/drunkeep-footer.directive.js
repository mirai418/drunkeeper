'use strict';

angular.module('drunkeeperApp')
  .directive('drunkeepFooter', function ($location) {
    return {
      templateUrl: 'app/drunkeep-footer/drunkeep-footer.html',
      restrict: 'EA',
      link: function (scope) {

        scope.show = function (path) {
          return $location.$$path !== ('/' + path);
        };

      }
    };
  });