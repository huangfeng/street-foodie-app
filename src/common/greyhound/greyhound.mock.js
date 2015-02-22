// Mock module for Greyhound
// to fake any database state
(function() {
  'use strict';

  var Q;
  var __mock = {
    first: false
  };

  var Greyhound = function() {};

  Greyhound.prototype.getDb = function() {

    var db = function() {
      return {
        first: function() {
          return __mock.first;
        },
      };
    };

    var dfrd = Q.defer();
    dfrd.resolve(db);
    return dfrd.promise;
  };

  angular.module('greyhound.mock', [])
  .factory('greyhound', function(_Q_) {
    Q = _Q_;

    __mock = {
      first: false
    };

    return Greyhound;
  })
  .factory('greyhound.mock', function() {
    return {
      __getMock: function() {
        return __mock;
      },
      __setMock: function(m) {
        __mock = m;
      }
    };
  })

  ;
})();
