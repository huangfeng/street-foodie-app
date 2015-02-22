(function() {
  'use strict';

  var socialSharing;
  var $window;

  describe('socialSharing module', function() {

    beforeEach(function() {
      module('socialSharing');
    });

    beforeEach(inject(function($injector) {
      socialSharing = $injector.get('socialSharing');
      $window = $injector.get('$window');

      $window.plugins = {
        socialsharing: {
          share: function(){},
          shareViaTwitter: function(){},
          shareViaFacebookWithPasteMessageHint: function(){}
        }
      };
    }));

    it('Shares using phone share feature', function() {
      spyOn($window.plugins.socialsharing, 'share');

      socialSharing.share('a', 'b', 'c', 'd');

      expect($window.plugins.socialsharing.share).toHaveBeenCalledWith('a', 'b', 'c', 'd');
    });

    it('Shares to Twitter', function() {
      spyOn($window.plugins.socialsharing, 'shareViaTwitter');

      socialSharing.shareTwitter('a', 'b', 'c');

      expect($window.plugins.socialsharing.shareViaTwitter).toHaveBeenCalledWith('a', 'b', 'c', null, null);
    });

    it('Shares to Facebook', function() {
      spyOn($window.plugins.socialsharing, 'shareViaFacebookWithPasteMessageHint');

      socialSharing.shareFacebook('a', 'b', 'c', 'd');

      expect($window.plugins.socialsharing.shareViaFacebookWithPasteMessageHint).toHaveBeenCalledWith('a', 'b', 'c', 'd', null, null);
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
