(function() {

  'use strict';

  describe('Starrating directive', function() {
    var $compile; // jshint camelcase: false
    var $scope;
    var template;
    var starratingConfig;

    /** Load all required modules and templates */
    beforeEach(module('templates'));
    beforeEach(module('starrating'));

    beforeEach(inject(function(_$compile_, _$rootScope_, _starratingConfig_) {

      $compile = _$compile_;

      /** Create a new scope for each test */
      $scope = _$rootScope_.$new();

      /** The module's configuration constant */
      starratingConfig = _starratingConfig_;
    }));

    beforeEach(function() {
      /** Template string as we would use in a page */
      template = '<starrating ng-model="thing" max="5"></starrating>';
      /** Add some defaults to the scope */
      $scope.thing = {rating: 3};
    });

    it('creates a 5 star rating widget', function() {
      var element = $compile(template)($scope);
      $scope.$digest();

      var stars = element.find('i');
      expect(stars.length).toEqual(5);
    });

    it('requires max attribute to be set', function() {
      template = template.replace('max="5"', 'max=""');
      $compile(template)($scope);
      expect(function() {$scope.$digest();}).toThrow();
    });

    it('requires max attribute to be integer', function() {
      template = template.replace('max="5"', 'max="a"');
      $compile(template)($scope);
      expect(function() {$scope.$digest();}).toThrow();
    });

    it('requires a model', function() {
      template = template.replace('ng-model="thing"', 'ng-model=""');
      $compile(template)($scope);
      expect(function() {$scope.$digest();}).toThrow();
    });


    it('only 1 star is highlighted for existing rating', function() {
      var numSelected = 0;
      var element = $compile(template)($scope);
      $scope.$digest();
      var stars = element.find('i');

      angular.forEach(stars, function(star) {
        if(angular.element(star).hasClass(starratingConfig.classes.eqClass)) {
          numSelected++;
        }
      });

      /** Only 1 item had the starrating-yes class */
      expect(numSelected).toBe(1);

      /** rating = 3 */
      expect(angular.element(stars[2]).hasClass(starratingConfig.classes.eqClass)).toBe(true);
    });

    it('multiple widgets work just fine', function() {
      $scope.food = {rating: 1};
      $scope.drink = {rating: 8};

      var tpl1 = '<starrating ng-model="food" max="4"></starrating>';
      var ele1 = $compile(tpl1)($scope);
      var tpl2 = '<starrating ng-model="drink" max="10"></starrating>';
      var ele2 = $compile(tpl2)($scope);

      $scope.$digest();

      var stars1 = ele1.find('i');
      expect(angular.element(stars1[0]).hasClass(starratingConfig.classes.eqClass)).toBe(true);

      var stars2 = ele2.find('i');
      expect(angular.element(stars2[7]).hasClass(starratingConfig.classes.eqClass)).toBe(true);

    });

    it('handles click event', function() {
      var element = $compile(template)($scope);
      $scope.$digest();
      var stars = element.find('i');

      /**
       * Click on a star and see the model change
       * @param  {Array} stars
       * @param  {Integer} which    which star to click
       * @param  {Integer} expected What is the expected value of the model
       */
      function clickVerify(stars, which, expected) {
        angular.element(stars[which]).triggerHandler('click');
        expect($scope.thing.rating).toEqual(expected);
      }

      clickVerify(stars, 0, 1);
      clickVerify(stars, 1, 2);
      clickVerify(stars, 2, 3);
      clickVerify(stars, 3, 4);
      clickVerify(stars, 4, 5);
    });

    /** Updates from outside of the directive, ie. not a click on a star */
    it('rating changes are reflected', function(done) {
      var element = $compile(template)($scope);
      $scope.$digest();
      var stars = element.find('i');

      // rating = 3
      expect(angular.element(stars[2]).hasClass(starratingConfig.classes.eqClass)).toBe(true);

      $scope.thing.rating = 1;
      $scope.$digest();
      expect(angular.element(stars[0]).hasClass(starratingConfig.classes.eqClass)).toBe(true);

      done();
    });

  });

})();
