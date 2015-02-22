(function() {
  'use strict';

  describe('appCtrl', function() {

    beforeEach(function() {
      module('app');
    });

    beforeEach(inject(function($injector) {
      this.$controller = $injector.get('$controller');
      this.$rootScope = $injector.get('$rootScope');
      this.scope = this.$rootScope.$new();
      this.$window = $injector.get('$window');
    }));

    it('listens to picmodal.*', function() {
      spyOn(this.$window.document, 'addEventListener');
      spyOn(this.$window.document, 'removeEventListener');

      this.$controller('appCtrl', {$scope: this.scope});

      this.$rootScope.$emit('picmodal.open');

      expect(this.$window.document.addEventListener.calls.mostRecent().args[0]).toEqual('backbutton');
      expect(this.$window.document.addEventListener.calls.mostRecent().args[2]).toEqual(false);

      this.$rootScope.$emit('picmodal.close');
      expect(this.$window.document.removeEventListener.calls.mostRecent().args[0]).toEqual('backbutton');
      expect(this.$window.document.removeEventListener.calls.mostRecent().args[2]).toEqual(false);
    });

  });
})();
/*
Cheat sheet from http://jasmine.github.io/2.0/introduction.html

expect(true).toBe(true);
expect(false).not.toBe(true);
expect(12).toEqual(12);
expect(11).not.toEqual(12);
expect(message).toMatch(/bar/);
expect(message).not.toMatch(/quux/);
expect(a.foo).toBeDefined();
expect(a.bar).not.toBeDefined();
expect(a.foo).not.toBeUndefined();
expect(a.bar).toBeUndefined();
expect(null).toBeNull();
expect(foo).not.toBeNull();
expect(foo).toBeTruthy();
expect(a).not.toBeTruthy();
expect(a).toBeFalsy();
expect(foo).not.toBeFalsy();
expect(a).toContain("bar"); // find element in array
expect(a).not.toContain("quux");
expect(e).toBeLessThan(pi);
expect(pi).not.toBeLessThan(e);
expect(pi).toBeGreaterThan(e);
expect(e).not.toBeGreaterThan(pi);
expect(function...).not.toThrow();
expect(function...).toThrow();
expect(function...).toThrowError("quux");
spyOn(foo, 'setBar');
expect(foo.setBar).toHaveBeenCalled();
expect(foo.setBar).toHaveBeenCalledWith(456, 'another param');
spyOn(foo, 'getBar').and.callThrough();
spyOn(foo, "getBar").and.returnValue(745);
spyOn(foo, "getBar").and.callFake(function() {});
spyOn(foo, "setBar").and.throwError("quux");
expect(foo.setBar.calls.count()).toEqual(0);
expect(foo.setBar.calls.argsFor(0)).toEqual([123]);
expect(foo.setBar.calls.allArgs()).toEqual([[123],[456, "baz"]]);
expect(foo.setBar.calls.mostRecent()).toEqual({object: foo, args: [456, "baz"]});

it, xit, iit
 */
