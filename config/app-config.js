// # App Configuration
// Global app configuration with defaults and environment overrides that works
// in node.js and AngularJS environment.
//
// Environments are determined from
// [`process.env.STRFDY_ENV`](http://devdocs.io/node/process)
//
// Defaults are kept in [defaults.js](defaults.js), while overrides are kept in
// env-NAME_OF_ENV.js
//
// See [Configuration in README](README.html#configuration) for more.
(function() {
  'use strict';

  var _ = require('lodash');

  // Read `env` from process.env.STRFDY_ENV, defaults to 'build'
  var env = process.env.STRFDY_ENV || 'build';

  // ## AppConfig
  // The configuration merger and generator
  var AppConfig = function(env) {
    var cfgDefault;
    var cfgENV;

    // The default settings for all environments
    cfgDefault = require('./defaults');
    // Try to load the environment specific js, eg. `env-dev.js`
    try {
      cfgENV = require('./env-'+env);
    }
    catch(e) {
      throw 'Error: '+e+' '+
      'No config file for the environment '+env+' exists. '+
          'Start by creating a file `config/env-'+env+'.js` ';
    }

    // Defaults will create all the keys in cfgENV, so merge can copy
    // everything back
    var final = _.defaults(cfgENV, cfgDefault);
    final = _.merge(cfgDefault, final);
    return final;
  };

  module.exports = new AppConfig(env);
})();
