// # About module
//
// Information page about the App
//
// Module name is `app.about`. View(s) are in home*.tpl.jade
(function() {
  'use strict';
  angular.module('app.about', ['appConfig'])

  // ## Routes
  .config(
    function(appConfig, $routeProvider) {
      $routeProvider
      .when(appConfig.about.url.about,
        {
          templateUrl: 'about/about.tpl.html',
          controller: 'aboutCtrl'
        });
    })

  // The Home controller
  .controller('aboutCtrl', function($scope, appConfig) {
    $scope.app.title = 'About';
    $scope.app.titleback = true;

    $scope.version = appConfig.version;
  });
})();
