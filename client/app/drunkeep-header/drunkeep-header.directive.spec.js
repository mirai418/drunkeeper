'use strict';

describe('Directive: drunkeepHeader', function () {

  // load the directive's module and view
  beforeEach(module('drunkeeperApp'));
  beforeEach(module('app/drunkeep-header/drunkeep-header.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<drunkeep-header></drunkeep-header>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the drunkeepHeader directive');
  }));
});