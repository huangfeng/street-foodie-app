// # Food database
// Food specific persistence and query module, based on `greyhound`, with
// food related extensions like `new()`, `getByUUID()`.
//
// Module name: `app.foodDB`, factory: `foodDB`
//
// The factory for this module is a bit tricky, since we want to extend a
// method in Greyhound: when calling `FoodDB.new()`, it should call
// `Greyhound.new()`, grab the result, extend it and return to the app.
// I couldn't find a more elegant way, than to...
// * Create a type (FoodDB), which has Greyhound's prototype
// * Create a propertiesObject, which holds the new methods that I want to
//   add / override (FoodDBExtra)
// * Use Object.create to initialize an object which has FoodDB as prototype
//   (which has Greyhound as prototype in turn), and gets FoodDBExtra as
//   propertiesObject

(function() {
  'use strict';

  // ## FoodDB factory
  var foodDBFactory = function(foodConfig, Greyhound, uuid, appConfig) {

    // Merge this module's configuration with the default appConfig values.
    var storageConfig = angular.extend({}, appConfig.storage, foodConfig);

    // Create a propertiesObject so we can override / extend Greyhound
    var FoodDBExtra = {};

    // The modified `new` method adds a UUID and date to the new records -
    // that's the reason for all these tricks in the factory!
    FoodDBExtra.new = {
      value: function(defs) {
        var theNew = FoodDB.prototype.new.call(this, defs);
        theNew.uuid = uuid.generate();
        theNew.createdAt = new Date().getTime();
        return theNew;
      },
      enumerable: true
    };

    // The `getByUUID` method retrieves a record by UUID
    FoodDBExtra.getByUUID = {
      writable: true,
      value: function(uuid) {
        return this.getOneBy('uuid', uuid);
      }
    };

    // Create a "temporary" type, which will inherit from Greyhound. It also
    // sets local config, so Greyhound has access to config.prototype, ie.
    // when calling new(), it doesn't return an empty object, but fills it with
    // several properties - like food, vendor - in advance. See
    // configuration/prototype!
    var FoodDB = function(config) {
      this.config = config;
    };

    // Assign all Greyhound methods to this temporary constructor
    FoodDB.prototype = new Greyhound(storageConfig);

    // The `Object.create(proto [, propertiesObject ])` method creates a new
    // object with the specified prototype object and properties.
    // ([docs](http://devdocs.io/javascript/global_objects/object/create))
    return Object.create(new FoodDB(storageConfig), FoodDBExtra);
  };


  // Define the AngularJS module
  angular.module('app.foodDB', ['greyhound', 'uuid', 'appConfig'])

  // Configuration for the module. At the moment it just passes on the config
  // from `appConfig.foodDB`
  .factory('foodDBConfig', ['appConfig', function(appCfg) {
    return appCfg.foodDB;
  }])

  // AngularJS factory to return FoodDB
  .factory('foodDB', ['foodDBConfig', 'greyhound', 'uuid', 'appConfig', foodDBFactory]);
})();
