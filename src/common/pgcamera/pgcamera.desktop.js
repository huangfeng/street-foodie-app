// # pgCamera desktop mock - to make the App run on desktop
// Will always return a Kitten image as photo
(function() {
  'use strict';

  angular.module('pgCamera', [])

  .factory('pgCameraCamera', function($q, $window) {
    return {
      takePhoto: function() {
        var dfrd = $q.defer();

        var images = [
          'http://i.imgur.com/hEnGj.jpg',
          'http://i.imgur.com/mMnax.jpg',
          'http://i.imgur.com/Kgt4Wpr.jpg',
          'http://i.imgur.com/QpyMRwY.jpg',
          'http://i.imgur.com/F2Yhd.jpg'
        ];

        var imagesText = images.join('\n');

        dfrd.resolve($window.prompt(imagesText, images[0]));

        return dfrd.promise;
      },

      selectPhoto: function() {
        var dfrd = $q.defer();

        dfrd.resolve('http://i.imgur.com/hEnGj.jpg');

        return dfrd.promise;
      }
    };
  });
})();
