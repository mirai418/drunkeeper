'use strict';

describe('Directive: drunkeepFooter', function () {

  // load the directive's module and view
  beforeEach(module('drunkeeperApp'));
  beforeEach(module('app/drunkeep-footer/drunkeep-footer.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<drunkeep-footer></drunkeep-footer>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the drunkeepFooter directive');
  }));
});