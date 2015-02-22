var Compile = function() {
  'use strict';

  /**
   * Remove keys that are only required for build / test
   */
  this.path = {};
  this.port = {};
};
module.exports = new Compile();
