// # Food related HTML tags
// DSL for food related views
(function() {
  'use strict';

  // Extend the `app.food` module
  angular.module('app.food')

  // Tag for `<food-record>` which displays a `<button>` taking the user to
  // the new food page. Usage example:
  // ```
  // <food-record>
  // ```
  .directive('foodRecordButton', ['appConfig', '$location', function(appConfig, $location) {
    return {
      scope: {},
      template: '<button type="button" ng-click="buttonClick()" class="food-record-button default">Record food experience</button>',
      restrict: 'E',
      link: function(scope) {
        // handle the button click
        scope.buttonClick = function() {
          // the URL is coming from food_tags.js[appConfig](appConfig.html)
          $location.path(appConfig.URLs.food.new);
        };
      }
    };
  }])

  // Tag for `<food-list>` which displays a `<button>` taking the user to
  // the list food page. Usage example:
  // ```
  // <food-list>
  // ```
  .directive('foodListButton', ['appConfig', '$location', function(appConfig, $location) {
    return {
      scope: {},
      template: '<button type="button" ng-click="buttonClick()" class="food-list-button default">List my adventures</button>',
      restrict: 'E',
      link: function(scope) {
        // handle the button click
        scope.buttonClick = function() {
          // the URL is coming from food_tags.js[appConfig](appConfig.html)
          $location.path(appConfig.URLs.food.list);
        };
      }
    };
  }])

  // Food data sheet tag, showing where/who/when
  // Usage:
  // ```
  // <food-data food="food">
  // ```
  .directive('foodData', [function() {
    return {
      template: [
        '  <ul class="food-data">',
        '    <li ng-if="food.price" class="food-data-row"><span class="food-data-label">&pound;</span><span class="food-data-data">{{food.price}}</span></li>',
        '    <li ng-if="food.vendor" class="food-data-row"><span class="food-data-label">who</span><span class="food-data-data">{{food.vendor}}</span></li>',
        '    <li ng-if="food.where" class="food-data-row"><span class="food-data-label">where</span><span class="food-data-data">{{food.where}}</span></li>',
        '    <li ng-if="food.createdAt" class="food-data-row"><span class="food-data-label">when</span><span class="food-data-data">{{food.createdAt|date:"shortDate"}}</span></li>',
        '  </ul>'
      ].join(' '),
      scope: {
        food: '='
      },
      restrict: 'E',
    };
  }])

  // Food notes line
  // Usage:
  // ```
  // <food-notes food="food">
  // ```
  .directive('foodNotes', [function() {
    return {
      template: [
        '<div ng-if="food.notes">',
        '  <i class="food-notes-icon"></i>',
        '  <span class="food-notes-notes">{{food.notes}}</span>',
        '</div>'
      ].join(' '),
      scope: {
        food: '='
      },
      restrict: 'E',
    };
  }])

  ;

})();
