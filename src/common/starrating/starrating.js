// # Star rating
// Allows change the numerical `rating` property of a model using some sort
// of icons.
//
// Example for your view:
// ```
// <starrating ng-model="food" max="5" readonly=""></starrating>
// ```
//
// Configuration is done via attributes:
// * ng-model: the model to hold the rating (2 way binding), it **must** have
// a property named `rating` of type int, eg.
// `$scope.thing = {name: 'Something', rating: 0}`
// * max: maximum rating (0 to max)
// * readonly: if the attribute *is present*, the click on the icons will have
//   no effect, won't change the rating
//
// A LESS example which you can use with [Font Awesome](http://fontawesome.io/):
// ```
//   // Based on http://css-tricks.com/star-ratings/
//   .starrating {
//     unicode-bidi: bidi-override;
//     direction: rtl;
//     text-align: left;
//   }
//   .starrating > i:hover:before,
//   .starrating > i:hover ~ i:before,
//   .starrating > i.starrating-yes:before,
//   .starrating > i.starrating-yes ~ i:before,
//    {
//      color: red;
//   }
//
//   // \f005 is a star
//   // \f004 is a heart
//   .starrating > i:before {
//     content: "\f005";
//   }
// ```
(function() {
  'use strict';

  // AngularJS module
  angular.module('starrating', [])

  // ## starratingConfig
  // Module configuration: CSS class names for icons when they are
  // * equal to,
  // * greater then,
  // * less then
  // the rating of the ng-model.
  .constant('starratingConfig', {
    classes: {
      'eqClass': 'starrating-eq',
      'gtClass': 'starrating-gt',
      'ltClass': 'starrating-lt'
    }
  })

  // ## starrating
  // The actual widget. Template lives in `starrating.tpl.jade`
  .directive('starrating', function() {
    return {
      templateUrl: 'starrating/starrating.tpl.html',
      restrict: 'E',
      scope: {
        model: '=ngModel',
        max: '@',
        readonly: '@'
      },
      controller: function($scope) {

        // Validate configuration for max
        if(!($scope.max = parseInt($scope.max, 10))) {
          throw new Error('<starrating> max attribute requires an integer');
        }

        // Create a rating number and widget (icon) for all possible ratings
        var i = 1;
        $scope.ratingValues = [];

        while(i <= $scope.max) {
          $scope.ratingValues.push(i);
          i++;
        }

        // The star icon click handler, sets the rating to the value
        // corresponding to the icon.
        // Make sure you have something like this in your directive template:
        // ```
        // ng-click="starClick(value)"
        // ```
        $scope.starClick = function(value) {
          /* istanbul ignore else */
          if(typeof $scope.readonly === 'undefined') {
            $scope.model.rating = value;
          }
        };
      }
    };
  })

  // ## starclass filter
  // Adds lt/eq/gt classes to star items via ngClass and this filter. Takes the
  // starratingConfig as parameter. The filter is introduced so we don't have
  // to do this calculation in the ngClass directive, insteaad, it takes the
  // value and returns the appropriate class for it.
  //
  // The directive template needs something like
  // ```
  // ng-class="value|starclass:model"
  // ```
  .filter('starclass', function(starratingConfig) {
    return function(value, model) {
      if(value === model.rating) {
        return starratingConfig.classes.eqClass;
      } else if(value < model.rating) {
        return starratingConfig.classes.ltClass;
        /* istanbul ignore else */
      } else if(value > model.rating) {
        return starratingConfig.classes.gtClass;
      }
    };
  })

  ;
})();
