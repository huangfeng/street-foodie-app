// # Greyhound
//
// A Storage layer that uses [TaffyDB](http://www.taffydb.com/) for queries
// and [LocalForage](https://github.com/mozilla/localForage) for persistence.
// Databases are kept under namespaces (LocalStorage keys) in a
// simple JSON format (array of objects under the `data` property of an
// object). It basically is an object storage.
//
// When the JSON is loaded from LocalForage, it is passed to TaffyDB,
// enabling complex queries, sorting, etc.
//
// The data format is shown in [`getDb()`](#section-13)
//
// Greyhound methods are mapped to LocalForage methods roughly like this (
// Greyhound first), showing that a database is just 1 item on LocalForage
// level:
// * `getDb`: `getItem`
// * `saveDb`: `setItem`
// * `removeDb`: `removeItem`
//
// The `greyhound` module's `greyhound` factory returns a **constructor** only,
// so it can be extended by other modules (like [FoodDB](foodDB.html))
(function() {
  'use strict';

  var _database;
  var _storage;
  var Q;

  // ## Greyhound constructor
  // Sets up instance variables.
  // `cfg` is the configuration object. Example:
  // ```
  // {
  //   'ns': 'strfdy_',
  //   'dbName': 'food',
  //   'localforage': {
  //     'driver': 'localStorageWrapper'
  // }
  // ```
  // It usually comes from `appConfig` module (which lives under /config,
  // not under /src) but has to be passed in when `new`ing the instance.
  var Greyhound = function(cfg) {

    // Set the object's config property
    this.config = cfg;

    // The database module, which must be TaffyDB
    this.database = _database;

    // Holds the whole db in memory so it's quick to access after first load
    this.memoryDb = null;

    // The storage module, which must be LocalForage
    this.storage = _storage;

    // The 'database' to use, ie. the LocalStorage namespace or WebSQL DB.
    // Will be set in [`getDb()`](#section-8) and is the key that we use in
    // LocalForage's `getItem`, `setItem`, `removeItem`.
    //
    // The above example will result in a LocalStorage key named `strfdy_food`
    this.dbName = '';

    // Set LocalForage driver to the one coming from appConfig.
    // In development environment, it is best to set it to LocalStorage (see
    // config example above,
    // [docs](https://github.com/mozilla/localForage/blob/master/README.md#driver-selection-ie-forcing-localstorage))
    /* istanbul ignore else  */
    if (typeof this.config.localforage !== 'undefined' && this.config.localforage.driver) {
      this.storage.setDriver(this.config.localforage.driver);
    }
  };

  // ## getDb
  // Sets the `dbName` property and gets the database
  // * @param  {string} dbName the database name (optional)
  // * @return {Promise} promise that will resolve with the DB or be rejected
  //   in case of an error
  //
  // The dbName must be set in config.dbName or passed in as dbName (config
  // is coming from GreyhoundFactory). The dbName is basically a namespace for
  // LocalStorage in LocalForage
  //
  // Example:
  //
  // ```
  // greyhound.getDb('food')
  // .then(function() {
  //   return greyhound.save({food: 'korean sushi', rating: 5});
  // })
  // .then(function() {
  //   alert('I am Happy');
  // })
  // ```
  Greyhound.prototype.getDb = function(dbName) {
    // Creates a defered object that we will resolve if all the "back-end"
    // stuff is done
    var myDefer = Q.defer();

    if(this.memoryDb !== null) {
      myDefer.resolve(this.memoryDb);
      return myDefer.promise;
    }

    // Throw if the dbName can't be figured out
    if (!this.config.dbName && !dbName) {
      throw(new Error('The dbName must be set in this.config.dbName or passed in as dbName'));
    }

    // Use the parameter of fall back to the configuration
    dbName = dbName || this.config.dbName;
    dbName = dbName+'';

    // eg.: strfdy_food
    this.dbName = this.config.ns + dbName;

    var that = this;

    // Retrieves the database using
    // [`LocalForage.getItem()`](http://mozilla.github.io/localForage/?javascript#getitem)
    //
    // The database is stored as an object - `rawDb` - with 1 obligatory
    // property: `data`. The rest of the object can be used to store metadata
    // in the future.
    // ```
    // {
    //   data: [item1, item2, ...]
    // }
    // ```
    this.storage.getItem(this.dbName)
    .then(function(db) {
      that.rawDb = db || {data: null};
      try {
        that.db = that.database(that.rawDb.data);
        that.memoryDb = that.db;
        myDefer.resolve(that.db);
      }
      catch(e) {
        myDefer.reject('Can\'t create TaffyDB for '+dbName+': '+e);
      }
    }, function(e) {
      myDefer.reject('Can\'t get LocalForage for '+dbName+': '+e);
    });

    return myDefer.promise;
  };

  // ## saveDb
  // Saves the database object to LocalForage. Returns a promise that will
  // resolve on success and reject on failure
  Greyhound.prototype.saveDb = function() {
    // Pull up the array of items from TaffyDB and put it in `rawDb.data`
    this.rawDb.data = this.db().get();
    // Write this array to LocalForage, return the promise, and throw if it
    // fails.
    return this.storage.setItem(this.dbName, this.rawDb)
    .then(undefined, function(e) {
      throw new Error('Error while saving: ' + e);
    });
  };

  // ## removeDb
  // Remove the datbase named in `this.dbName` and return a promise which will
  // resolve on success, reject and throw on error. This will wipe all data
  // from storage under that key.
  Greyhound.prototype.removeDb = function() {
    return this.storage.removeItem(this.dbName)
    .then(null, function(e) {
      throw new Error('Error removing DB: '+e);
    });
  };

  // ## save
  // Save one item to the database and returns `saveDb` promise. The `obj`
  // parameter can be any valid JS object or array.
  //
  // Example:
  //
  // ```
  // greyhound.getDb('food')
  // .then(function() {
  //   return greyhound.save({food: 'korean sushi', rating: 5});
  // })
  // .then(function() {
  //   alert('I am Happy');
  // })
  // ```
  Greyhound.prototype.save = function(obj) {
    this.db.merge(obj, this.config.primaryId);
    return this.saveDb();
  };

  // ## new
  // Creates a new object in memory, based on the prototype in `this.config`
  // *and* from the `defaults` parameter, which is an object.
  //
  // Example (assuming `config.prototype` is empty):
  // ```
  // var item = greyhound.new({
  //   food: 'chicken wrap',
  //   weather: 'rainy'
  // });
  //
  // expect(item.food).toBe('chicken wrap');
  // expect(item.weather).toBe('rainy');
  // ```
  Greyhound.prototype.new = function(defaults) {
    var prototype = this.config.prototype || {};
    defaults = defaults || {};
    return angular.copy(angular.extend(prototype, defaults));
  };

  // ## getOneBy
  // Retrieves one record from tha database (TaffyDB) using a select on 1
  // `key` matching the `value`. Returns the item.
  //
  // Example:
  // `var item = greyhound.getOneBy('id', 'D83598F0');`
  Greyhound.prototype.getOneBy = function(key, value) {
    var q = {};
    q[key] = value;
    return this.db(q).first();
  };

  // ## getAll
  // Gets all records, or a filtered and limited slice.
  // `params` is an object, with keys for:
  // * filter: {} (with key/value pairs)
  // * limit: 0
  // * start: 0
  // * order: '' (eg. {order: 'col1 asec, col2 desc'})
  //
  // Returns an array with the results.
  //
  // Example:
  // `greyhound.getAll({limit: 10, start: 2, filter: {name: 'Monkey'}});`
  Greyhound.prototype.getAll = function(params) {

    params = params || {};
    params.filter = params.filter||{};
    params.limit = params.limit || 0;
    params.start = params.start || 0;
    params.order = params.order || '';

    return this.db()
      .filter(params.filter)
      .order(params.order)
      .start(params.start)
      .limit(params.limit)
      .get();
  };

  // ## GreyhoundFactory
  // Sets up some local variables for Greyhound (ie. the database and storage)
  // and returns the Greyhound contructor (not `new()`d)
  function GreyhoundFactory(database, storage, _Q_) {
    _database = database;
    _storage = storage;
    Q = _Q_;

    return Greyhound;
  }

  // Create Angular module and factory
  angular.module('greyhound', ['taffy', 'localforage', 'Q'])
  .factory('greyhound', ['taffy', 'localforage', 'Q', GreyhoundFactory]);
})();
