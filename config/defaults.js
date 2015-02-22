// # Default.js
// Defult configuration for all environments

(function() {
  'use strict';

  var path = require('path');

  // ## The constructor
  var Defaults = function() {

    // ### App version
    this.version = require('../package.json').version;

    // ### Filesystem paths
    // Paths will *not* have a trailing slash
    this.path = {};
    this.path.root = path.resolve(path.dirname(__filename)+'/..');
    this.path.features = this.path.root+'/features';
    this.path.featuresSupport = this.path.features+'/support';
    this.path.stepDefinitions = this.path.features+'/step_definitions';
    this.path.fixtures = this.path.featuresSupport+'/fixtures';
    this.path.fixturesFiles = this.path.fixtures+'/files';
    this.path.phonegap = this.path.root+'/phonegap';
    this.path.phonegapwww = this.path.phonegap+'/www';

    // ### Build related
    this.port = {dev: 6789};

    // ### Storage related
    //
    // See [Greyhound module](greyhound.html)
    this.storage = {};
    this.storage.ns = 'strfdy_';
    this.storage.localforage = {};
    this.storage.localforage.driver = null;
    this.storage.primaryId = 'uuid';

    // ### Photo related
    this.photo = {};
    this.photo.appFolder = 'StreetFoodieApp';

    // ### Food
    this.food = {
      // Number of food items to list in list view
      listLimit: 30,
      url: {
        new: '/food/new',
        list: '/food/list',
        show: '/food/show/:uuid',
        edit: '/food/edit/:uuid'
      },
      foodForm: {
        priceRx: '^[0-9\\\,\\\.]*$'
      }
    };

    // ### FoodDB
    this.foodDB = {
      dbName: 'food',
      prototype: {
        food: '',
        vendor: '',
        notes: '',
        rating: null,
        price: null,
        createdAt: null, // timestamp
        picture: '',
        uuid: '',
        version: 1 // schema version
      }
    };

    // Home
    this.home = {
      url: {
        home: '/home'
      }
    };

    /// About
    this.about = {
      url: {
        about: '/about'
      }
    };

    this.market = {
      url: {
        list: '/market/list'
      }
    };

    this.vendor = {
      url: {
        list: '/vendor/list'
      }
    };

  };

  module.exports = new Defaults();

})();
