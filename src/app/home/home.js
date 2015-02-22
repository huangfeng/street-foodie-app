// # Home module
//
// Provides all functionality related to the star screen of the app
//
// Module name is `app.home`. View(s) are in home*.tpl.jade
(function() {
  'use strict';
  angular.module('app.home', ['appConfig'])

  // ## Routes
  //
  // * Home: **/home/**
  .config(
    function(appConfig, $routeProvider) {
      $routeProvider
      .when(appConfig.home.url.home,
        {
          templateUrl: 'home/home.tpl.html',
          controller: 'homeCtrl'
        });
    })

  // The Home controller
  .controller('homeCtrl', function($scope, foodDB, $http) {
    $scope.app.title = 'Street Foodie';
    $scope.app.titleback = false;
    $scope.app.menu.more.inmenu = false;


    // Is the food db empty?
    // Will enable/disable the "list food" button
    $scope.hasFood = false;

    // Gets the database and loads the 1st food item
    foodDB.getDb()
    .then(function(db) {
      return db().first();
    })
    .then(function(first) {
      if(first !== false) {
        $scope.hasFood = true;
        $scope.$digest();
      }
    });

    // Pre fetch market and vendor data
    $http.get('assets/data/markets.json', {cache: true});
    $http.get('assets/data/vendors.json', {cache: true});

  });
})();
