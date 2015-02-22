// # notify
// Angular module to display notifications in a custom template, using a
// simple array stack and CSS animation via ngAnimate
//
// Animation should be written in your CSS, it is not included, only the
// ngAnimate classes will be added to the directive elements.
//
// Example:
// ```
// angular.controller('tadaaa', ['$scope', 'notify', function controller($scope, notify) {
//   notify.push('Hello World!', 'info');
// }]);
// ```
//
// The massage text has to be a *string* (can be HTML obviously).
//
// Message types are:
// * info
// * success
// * warning
// * danger
//
// It's optional and defaults to *info*.
//
// *On Android*, the module will use the _toast_ functionality provided by
// http://plugins.telerik.com/plugin/toast - TL;DR documentation:
//
// Install:
//
// ```
// phonegap plugin add https://github.com/Telerik-Verified-Plugins/Toast
// ```
//
// Usage:
//
// ```
// window.plugins.toast.show(
//   message,
//   duration, // ‘short’, ‘long’
//   position, // ‘top’, ‘center’, ‘bottom’
//   [successCallback], // optional succes function
//   [errorCallback] // optional error function
// );
// ```
//
// Or as shorthand methods:
//
// ```
// window.plugins.toast.showShortTop(message);
// window.plugins.toast.showShortCenter(message);
// window.plugins.toast.showShortBottom(message);
// window.plugins.toast.showLongTop(message);
// window.plugins.toast.showLongCenter(message);
// window.plugins.toast.showLongBottom(message);
// ```

(function() {
  'use strict';

  // The message stack is an object, so we can delete messages by key (arrays
  // behave like idiots if you delete a key).
  // It is defined on the module level, so both the  directive and the service
  // has access to it.
  var messages = {};

  // The AnguarJS module
  angular.module('notify', ['ngAnimate'])

  // ## notify directive
  // Angular directive to display and dismiss messages. Uses
  // `notify/notify.tpl.html` as template (`notify.tpl.jade`)
  //
  // Example HTML in your view:
  // ```
  // <head>
  //   <notify />
  // </head>
  // ```
  .directive('notify', ['notifyConfig', function() {
    return {
      templateUrl: 'notify/notify.tpl.html',
      restrict: 'E',
      link: function(scope) {
        scope.messages = messages;

        // Removes the message from the stack if the user clicks on the
        // message tag. Make sure you have something like this in your view:
        // ```
        // <div ng-repeat="..." ... ng-click="messageClick(key)>
        // ```
        scope.messageClick = function(index) {
          delete messages[index];
        };
      }
    };
  }])

  // ## Configuration
  // Message types, CSS class names
  .constant('notifyConfig', {
    type: {
      info: {
        cssClass: 'alert-info'
      },
      success: {
        cssClass: 'alert-success'
      },
      warning: {
        cssClass: 'alert-warning'
      },
      danger: {
        cssClass: 'alert-danger'
      }
    },
    defaultType: 'info',
    timeout: 2000
  })

  // ## Notification service
  // This is the service to inject into your controller (see example above)
  //
  // The `cfg` parameter is the configuration, ie. `notifyConfig`
  .service('notify', ['notifyConfig', '$timeout', '$window', function(cfg, $timeout, $window) {

    // The message list key
    var mKey = 0;

    // ### notify.push
    // Registers a new message. Takes an obligatory message string and an
    // optional type (see notifyConfig)
    this.push = function(text, type) {
      if (!text || typeof text !== 'string') {
        throw(new Error('message.text must be a non empty string'));
      }

      // Check if we have access to `window.plugins.toast`
      // If not, use the desktop module,
      // if yes, use the PhoneGap plugin
      try {
        var toast = $window.plugins.toast; /* jshint ignore:line */
        return _pushPhonegap(text);
      } catch(e) {
        return _pushDesktop(text, type);
      }
    };

    // Display the message on desktop
    var _pushDesktop = function(text, type) {
      // Set default type to info
      type = type || cfg.defaultType;

      // Set CSS class name
      var cssClass = cfg.type[type].cssClass;

      // Push the message to the stack
      messages[mKey] = {text: text, cssClass: cssClass};

      // Add timeout so message is deleted after `config.timeout`, without
      // user interaction even on desktop (while developing)
      // Needs to be wrapped in a closure since mKey is incremented.
      (function(toDel) {
        $timeout(function() {
          delete messages[toDel];
        }, cfg.timeout);
      })(mKey);

      mKey++;
    };

    // Display the message on PhoneGap
    var _pushPhonegap = function(text) {
      $window.plugins.toast.showLongBottom(text);
    };

    // ### notify.flush
    // Deletes all messages
    this.flush = function() {
      messages = {};
    };
  }])

  ;

})();
