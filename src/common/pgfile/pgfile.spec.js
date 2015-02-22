(function() {
  'use strict';

  var pgFile;
  var $window;

  describe('pgFile module', function() {

    beforeEach(function() {
      module('pgFile');
    });

    beforeEach(inject(function($injector) {
      pgFile = $injector.get('pgFile');
      $window = $injector.get('$window');
      this.$rootScope = $injector.get('$rootScope');

      $window.resolveLocalFileSystemURI = function(uri, succ) {
        var file = {
          fullPath: uri,
          moveTo: function(dir, name, succ) {
            succ();
          }
        };
        succ(file);
      };

      $window.LocalFileSystem = {
        PERSISTENT: 1
      };

      $window.requestFileSystem = function(type, size, succ) {
        var fs = {
          root: {
            getDirectory: function(dir, succ) {
              succ({});
            }
          }
        };
        succ(fs);
      };
    }));

    it('moves a file', function(done) {
      pgFile.move('./pgfile.js', 'TestFolder')
      .then(function(path) {
        expect(path).toBeDefined();
        done();
      }, function(e) {
        console.log('e', e, 'pgfile.spec.js:22');
      });

      this.$rootScope.$digest();
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
