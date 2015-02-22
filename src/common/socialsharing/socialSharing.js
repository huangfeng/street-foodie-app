// # Service for SocialSharing-PhoneGap-Plugin
// https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
(function() {
  'use strict';

  angular.module('socialSharing', [])

  .factory('socialSharing', function($window) {
    return {
      // ## Share using the phone's share fearture
      // Can use message, subject, image and URL
      share: function(msg, subj, img, url) {
        msg = msg || null;
        subj = subj || null;
        img = img || null;
        url = url || null;

        $window.plugins.socialsharing.share(msg, subj, img, url);
      },

      // ## Share directly to Twitter
      // Doesn't use subject.
      // Requires the Twitter app to be installed on the phone.
      // `scb` and `ecb` will be called as succcess and error callbacks,
      // `ecb` in case Twitter app is not present.
      // See
      // https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin#sharing-directly-to
      shareTwitter: function(msg, img, url, scb, ecb) {
        msg = msg || null;
        img = img || null;
        url = url || null;
        scb = (typeof scb === 'function') ? scb : null;
        ecb = (typeof ecb === 'function') ? ecb : null;

        $window.plugins.socialsharing.shareViaTwitter(msg, img, url, scb, ecb);
      },

      // ## Share directly to Facebook
      // Will display a toast to let user know they can paste `msg` from the
      // clipboard.
      // Requires the Facebook app to be installed on the phone.
      // `scb` and `ecb` will be called as succcess and error callbacks,
      // `ecb` in case Facebook app is not present.
      // See
      // https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin#sharing-directly-to
      shareFacebook: function(msg, img, url, toastmsg, scb, ecb) {
        msg = msg || null;
        img = img || null;
        url = url || null;
        toastmsg = toastmsg || 'You can now paste your message from the clipboard!';
        scb = (typeof scb === 'function') ? scb : null;
        ecb = (typeof ecb === 'function') ? ecb : null;

        $window.plugins.socialsharing.shareViaFacebookWithPasteMessageHint(msg, img, url, toastmsg, scb, ecb);
      }
    };
  });
})();
