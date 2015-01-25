'use strict';

describe('Controller: RunkeeperCtrl', function () {

  // load the controller's module
  beforeEach(module('drunkeeperApp'));

  var RunkeeperCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RunkeeperCtrl = $controller('RunkeeperCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
