(function() {
  'use strict';

  angular.module('socialSharing', [])

  .factory('socialSharing', function($window) {
    return {
      // ## Share message, image and URL to Twitter
      share: function(msg, subj, img, url) {

        var out = [
          'SHARING (msg, subj, img, url): ',
          msg,
          subj,
          img,
          url
        ].join('\n');

        $window.alert(out);
      },

      shareTwitter: function() {
        console.log('shareTwitter:', arguments);
      },

      shareFacebook: function() {
        console.log('shareFacebook:', arguments);
      },

    };
  });
})();
