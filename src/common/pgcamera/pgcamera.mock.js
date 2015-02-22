(function() {
  'use strict';

  angular.module('pgCamera.mock', [])

  .factory('pgCameraConfig', function() {
    return {
      takePhoto: {
        sourceType: 111,
        destinationType: 222,
        saveToPhotoAlbum: false,
        correctOrientation: true,
        targetWidth: 640,
        targetHeight: 640,
        quality: 75
      }
  };
  })

  .factory('pgCameraCamera', function(pgCameraConfig, $q) {
    return {
      takePhoto: function() {
        var dfrd = $q.defer();
        dfrd.resolve('mock_success_image.jpg');
        return dfrd.promise;
      }
    };
  });
})();
