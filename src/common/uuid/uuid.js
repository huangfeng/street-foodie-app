/* jshint ignore:start */
/**
 * UUID.js - The RFC-compliant UUID generator for JavaScript.
 * This is an Angular service wrapper for UUID.js core
 * UUID.js: https://github.com/LiosK/UUID.js
 * Wrapper by https://github.com/thekarel | @karolysz
 * jshint ignore:start
 */

(function() {
  'use strict';

  /**
   * UUID.core.js: The minimal subset of the RFC-compliant UUID generator UUID.js.
   *
   * @fileOverview
   * @author  LiosK
   * @version core-1.0
   * @license The MIT License: Copyright (c) 2012 LiosK.
   */

  /** @constructor */
  var UUIDjs = function(){};

  /**
   * The simplest function to get an UUID string.
   * @returns {string} A version 4 UUID string.
   */
  UUIDjs.prototype.generate = function() {
    var rand = this._gri, hex = this._ha;
    return  hex(rand(32), 8)          // time_low
          + "-"
          + hex(rand(16), 4)          // time_mid
          + "-"
          + hex(0x4000 | rand(12), 4) // time_hi_and_version
          + "-"
          + hex(0x8000 | rand(14), 4) // clock_seq_hi_and_reserved clock_seq_low
          + "-"
          + hex(rand(48), 12);        // node
  };

  /**
   * Returns an unsigned x-bit random integer.
   * @param {int} x A positive integer ranging from 0 to 53, inclusive.
   * @returns {int} An unsigned x-bit random integer (0 <= f(x) < 2^x).
   */
  UUIDjs.prototype._gri = function(x) { // _getRandomInt
    if (x <   0) return NaN;
    if (x <= 30) return (0 | Math.random() * (1 <<      x));
    if (x <= 53) return (0 | Math.random() * (1 <<     30))
                      + (0 | Math.random() * (1 << x - 30)) * (1 << 30);
    return NaN;
  };

  /**
   * Converts an integer to a zero-filled hexadecimal string.
   * @param {int} num
   * @param {int} length
   * @returns {string}
   */
  UUIDjs.prototype._ha = function(num, length) {  // _hexAligner
    var str = num.toString(16), i = length - str.length, z = "0";
    for (; i > 0; i >>>= 1, z += z) { if (i & 1) { str = z + str; } }
    return str;
  };

  /**
   * Register UUID.js as a service
   */
  angular.module('uuid', []).service('uuid', UUIDjs);
})();
