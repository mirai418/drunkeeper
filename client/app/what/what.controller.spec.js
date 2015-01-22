'use strict';

describe('Controller: WhatCtrl', function () {

  // load the controller's module
  beforeEach(module('drunkeeperApp'));

  var WhatCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WhatCtrl = $controller('WhatCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
