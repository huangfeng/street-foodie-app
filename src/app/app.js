// # Street Foody App
// This is the main entry point for the app
(function() {
  'use strict';

  // Pull in all required modules
  angular.module('app', [
    'ngSanitize',
    'ngRoute',
    'app.home',
    'app.food',
    'app.foodDB',
    'app.market',
    'app.about',
    'app.vendor',
    'appConfig',
    // templates compiled by html2js
    'templates',
    // Ratchethelpers
    'ratchet'
  ])

  // Set the fallback URL to /#/home
  .config(function(appConfig, $routeProvider, $sceDelegateProvider) {
    $routeProvider
    .otherwise({redirectTo: appConfig.home.url.home});

    $sceDelegateProvider.resourceUrlWhitelist(['self', 'https://www.google.com/maps/**']);

  })

  // General controller that runs when the app loads
  .controller('appCtrl', function($rootScope, appConfig, $location, notify, $window, $timeout) {

    $rootScope.go = function(hash) {
      $location.path('/'+hash);
    };

    // some will default to what #home would set,
    // so there is no jerky change
    $rootScope.app = {
      // page title
      title: 'Street Foodie',

      // displays back to home arrow in top nav
      titleback: false,

      // Where to go from titleback - reset on location change, see below
      titlebackCb: null,

      titlebackClick: function() {
        if(typeof $rootScope.app.titlebackCb === 'function'){
          $rootScope.app.titlebackCb.call();
        } else {
          $rootScope.go('home');
        }
      },

      // Open links in system browser, ie. not in the app
      openExternal: function(url) {
        $window.open(url, '_system');
        return false;
      },

      menu: {
        icons: {
          active: false // toolbar icons visible?
        },
        more: {
          click: function() {
            $rootScope.app.menu.more.active = !$rootScope.app.menu.more.active;
          },
          inmenu: false, // show more menu dots icon in menu
          active: false // more menu open?
        },
        foodIcons: {
          active: false, // food show icons: edit, share, ...
          shareFn: null,
          editUrl: null,
          deleteFn: null
        }
      },

      vendor: {
        mapFixRequired: false
      }
    };

    // Reset some values on page change
    $rootScope.$on('$locationChangeStart', function() {
      // Make sure the back button override is cleared, otherwise it could be
      // "stuck"
      $rootScope.app.titlebackCb = null;
      // Show the menu icons in action bar
      $rootScope.app.menu.icons.active = true;
      $rootScope.app.menu.more.inmenu = true;
      $rootScope.app.menu.more.active = false;
      $rootScope.app.menu.foodIcons = {
        active: false,
        shareFn: null,
        editUrl: null,
        deleteFn: null
      };
    });

    // picmodal.*
    $rootScope.$on('picmodal.open', function() {
      $window.document.addEventListener('backbutton', picmodalClose, false);
      $rootScope.$broadcast('app.focus');
    });

    $rootScope.$on('picmodal.close', function() {
      $window.document.removeEventListener('backbutton', picmodalClose, false);
      $rootScope.$broadcast('app.focus');
    });

    function picmodalClose(event) {
      event.preventDefault();
      $rootScope.$broadcast('picmodal.close');
    }

    // listModal.*
    $rootScope.$on('listModal.open', function() {
      $rootScope.$broadcast('app.focus');
    });

    $rootScope.$on('listModal.close', function() {
      $rootScope.$broadcast('app.focus');
    });

    // app.focus
    $rootScope.$on('app.focus', function() {
      // Based on http://stackoverflow.com/a/17958847/129698
      $timeout(function() {
        $rootScope.app.menu.more.active = false;
      });
    });

  })

  ;

})();
