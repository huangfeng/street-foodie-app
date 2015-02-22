(function() {
  'use strict';

  var foodDB,
      $rootScope,
      scope,
      $controller,
      $q,
      $window,
      appConfig,
      $timeout,
      fakeData,
      pgCameraCamera
      ;

  describe('Food controllers', function() {

    beforeEach(function() {
      module('ngRoute', 'app', 'app.food', 'appConfig', 'templates', 'pgCamera.mock');
    });

    beforeEach(inject(function($injector) {
      foodDB = $injector.get('foodDB');
      $rootScope = $injector.get('$rootScope');
      $controller = $injector.get('$controller');
      $q = $injector.get('$q');
      $window = $injector.get('$window');
      $timeout = $injector.get('$timeout');
      appConfig = $injector.get('appConfig');
      pgCameraCamera = $injector.get('pgCameraCamera');

      scope = $rootScope.$new();

      $controller('appCtrl', {$scope: scope});
    }));

    beforeEach(function() {
      if($window && $window.localStorage) {
        $window.localStorage.clear();

        fakeData = {
          data: [
            {
              uuid: 'D3A212C8-3B4C-11E4-8641-05EDE2E253B6',
              food: 'Hot Dawg'
            }
          ]
        };

        $window.localStorage[appConfig.storage.ns+appConfig.foodDB.dbName] = JSON.stringify(fakeData);
      }
    });

    it('foodShowCtrl gets food record', function(done) {

      // fake $routeParams
      var fakeParams = {
        uuid: 'D3A212C8-3B4C-11E4-8641-05EDE2E253B6'
      };

      $controller('foodShowCtrl', {$scope: scope, $routeParams: fakeParams});

      spyOn($window, 'confirm').and.returnValue(true);

      $window.setTimeout(function() {
        expect(scope.food.food).toBe(fakeData.data[0].food);

        scope.deleteFood();

        expect($window.localStorage[appConfig.storage.ns+appConfig.foodDB.dbName]).toBe('{"data":[]}');

        done();
      }, 0);
    });

    it('foodNewCtrl uses pgCamera module', function(done) {

      spyOn(pgCameraCamera, 'takePhoto').and.callThrough();

      // fake the form
      scope.mFood = {$dirty: false};
      $controller('foodNewCtrl', {$scope: scope});

      scope.imageFromCamera();
      $rootScope.$digest();

      expect(pgCameraCamera.takePhoto).toHaveBeenCalled();
      expect(scope.food.picture).toBeDefined();
      done();

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
