var Build = function() {
  'use strict';

  /**
   * Storage related
   * @see  Greyhound
   */
  this.storage = {};
  this.storage.localforage = {};
  this.storage.localforage.driver = 'localStorageWrapper';
};
module.exports = new Build();
