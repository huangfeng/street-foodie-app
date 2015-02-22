(function() {
  'use strict';

  var camera;
  var rootScope;
  var win;

  var camCalled;

  describe('pgCamera module', function() {

    beforeEach(module('pgCamera', function($provide) {
      $provide.value('$window', {
        Camera: {
          PictureSourceType: {
            CAMERA: 1
          },
          DestinationType: {
            FILE_URI: 1
          }
        },
        navigator: {
          camera: {
            getPicture: function() {
              camCalled = true;
            }
          }
        }
      });
    }));

    beforeEach(function() {
      module('pgCamera');
    });

    beforeEach(inject(function(_pgCameraCamera_, _$rootScope_, _$window_) {
      camera = _pgCameraCamera_;
      rootScope = _$rootScope_;
      rootScope = _$rootScope_;
      win = _$window_;
      camCalled = false;
    }));

    it('uses PhoneGap Camera plugin', function() {
      camera.takePhoto();
      expect(camCalled).toBe(true);

      rootScope.$digest();
    });

    it('uses default options', function() {

      spyOn(win.navigator.camera, 'getPicture').and.callThrough();

      camera.takePhoto();

      var args = win.navigator.camera.getPicture.calls.mostRecent().args;

      expect(typeof args[0]).toBe('function');
      expect(typeof args[1]).toBe('function');

      expect(args[2].sourceType).toBeDefined();
      expect(args[2].destinationType).toBeDefined();
      expect(args[2].saveToPhotoAlbum).toBeDefined();
      expect(args[2].correctOrientation).toBeDefined();
      expect(args[2].targetWidth).toBeDefined();
      expect(args[2].targetHeight).toBeDefined();
      expect(args[2].quality).toBeDefined();
    });

  });
})();
