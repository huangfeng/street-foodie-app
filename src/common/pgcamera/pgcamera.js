// # pgCamera - PhoneGap Camera helper service
// See `pgCameraCamera` for
// **Requires PhoneGap (Cordova) Camera plugin**
(function() {
  'use strict';

  angular.module('pgCamera', [])

  // ## Camera plugin profiles
  // These options can be passed to the PhoneGap Camera plugin
  // 'takePhoto' is for taking a picture with the phone, other might follow
  //
  // Usage example:
  //
  // ```
  // pgCameraCamera.takePhoto(pgCameraConfig.takePhoto)
  // ```
  //
  // This will result in a 640x640 image which is saved into the phone's
  // gallery.
  .factory('pgCameraConfig', function($window) {
    return {
      takePhoto: {
        sourceType: $window.Camera.PictureSourceType.CAMERA,
        destinationType: $window.Camera.DestinationType.FILE_URI,
        saveToPhotoAlbum: true,
        correctOrientation: true,
        targetWidth: 640,
        targetHeight: 640,
        quality: 75
      },
      selectPhoto: {
        sourceType: $window.Camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: $window.Camera.DestinationType.FILE_URI,
        correctOrientation: true,
        targetWidth: 640,
        targetHeight: 640,
        quality: 75
      }
  };
  })

  // ## Methods to get an image from Camera plugin
  // Only taking a photo is implemented so far
  // Usage:
  // ...
  .factory('pgCameraCamera', function(pgCameraConfig, $window, $q) {
    return {
      takePhoto: function(config) {
        config = config || {};
        // makes the final photo to be moved, false would make a copy
        config.move = true;

        var dfrd = $q.defer();

        $window.navigator.camera.getPicture(function(img) {
          _movePhoto(img, dfrd, $window, config); // camera success callback
        }, function(err) {
          dfrd.reject(err);
        }, pgCameraConfig.takePhoto);

        return dfrd.promise;
      },

      selectPhoto: function(config) {
        config = config || {};
        // makes the final photo to be copied
        config.move = false;

        var dfrd = $q.defer();

        $window.navigator.camera.getPicture(function(img) {
          _movePhoto(img, dfrd, $window, config); // camera success callback
        }, function(err) {
          dfrd.reject(err);
        }, pgCameraConfig.selectPhoto);

        return dfrd.promise;
      }
    };
  });

  // Adapted from http://stackoverflow.com/a/10362355/129698
  function _movePhoto(source, promise, $window, config) {
    config = config || {};
    config.folder = config.folder || 'pgCamera';

    // resolveLocalFileSystemURL
    $window.resolveLocalFileSystemURI(source, resOnSuccess, resOnError);

    //Callback function when the file system uri has been resolved
    function resOnSuccess(entry){

      var ext = '.jpg';
      if(/\.png/.test(entry)) {
        ext = '.png';
      }

      var d = new Date();
      var n = d.getTime();

      var newFileName = n + ext;
      var myFolderApp = config.folder;

      $window.requestFileSystem($window.PERSISTENT, 0, function(fileSys) {
        //The folder `config.folder` is created if doesn't exist
        fileSys.root.getDirectory(myFolderApp, {create:true, exclusive: false},
          function(directory) {
            if(config.move === true) {
              entry.moveTo(directory, newFileName, successMove, resOnError);
            }
            if(config.move === false) {
              entry.copyTo(directory, newFileName, successMove, resOnError);
            }
          }, resOnError);
        }, resOnError);
    }

    function resOnError(error) {
      console.log('resolveLocalFileSystem error:');
      console.log(error.code);
      promise.reject(error);
    }

    //Callback function when the file has been moved successfully - inserting the complete path
    function successMove(entry) {
      // Full path is available under `entry.fullPath` or `nativeURL`
      promise.resolve(entry.nativeURL);
    }
  }
})();
