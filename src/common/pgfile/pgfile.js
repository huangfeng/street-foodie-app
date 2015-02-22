// # PhoneGap filesystem helper
// Module to ease file handling via the `org.apache.cordova.file` plugin
//
// PhoneGap docs:
// https://github.com/apache/cordova-plugin-file/blob/master/doc/index.md
//
// **Requires:**
//
// ```
// phonegap plugin add org.apache.cordova.file
// ```
(function() {
  'use strict';

  var me;
  var $window;
  var $q;

  var PGFile = function() {
    me = this;
  };

  PGFile.prototype.move = function(src, dstdir, dstname) {
    var dfrd = $q.defer();

    var fileEntry;

    me.resolveURI(src)
    .then(function(_fileEntry) {
      fileEntry = _fileEntry;
      return me.getFilesystem();
    })
    .then(function(fileSystem) {
      // flat folder structure only?
      return me.getDirectory(fileSystem, dstdir);
    })
    .then(function(dstdir) {
      return me.moveFile(fileEntry, dstdir, dstname);
    })
    .then(function(path) {
      dfrd.resolve(path);
    }, function(e) {
      dfrd.reject(e);
    });

    return dfrd.promise;
  };

  // resolveLocalFileSystemURI wrapper
  PGFile.prototype.resolveURI = function(src) {
    var dfrd = $q.defer();

    $window.resolveLocalFileSystemURI(src, function(uri) {
      dfrd.resolve(uri);
    }, function(e) {
      dfrd.reject(e);
    });

    return dfrd.promise;
  };

  // requestFileSystem wrapper
  PGFile.prototype.getFilesystem = function() {
    var dfrd = $q.defer();

    $window.requestFileSystem($window.LocalFileSystem.PERSISTENT, 0, function(fs) {
      dfrd.resolve(fs);
    }, function(e) {
      dfrd.reject(e);
    });

    return dfrd.promise;
  };

  // fs.root.getDirectory
  PGFile.prototype.getDirectory = function(fs, dir) {
    var dfrd = $q.defer();

    fs.root.getDirectory(dir, function(d) {
      dfrd.resolve(d);
    }, function(e) {
      dfrd.reject(e);
    });

    return dfrd.promise;
  };

  // fileEntry.moveTo
  PGFile.prototype.moveFile = function(sourceFile, destDir, destName) {
    var dfrd = $q.defer();

    sourceFile.moveTo(destDir, destName, function() {
      dfrd.resolve(destDir+destName);
    }, function(e) {
      dfrd.reject(e);
    });

    return dfrd.promise;
  };

  /** Angular module **/
  angular.module('pgFile', [])
  .factory('pgFile', function(_$window_, _$q_) {
    $window = _$window_;
    $q = _$q_;

    return new PGFile();
  });
})();
