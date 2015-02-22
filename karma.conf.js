module.exports = function ( karma ) {
  'use strict';

  karma.set({
    basePath: '.',
    files: [
      'vendor/angular/angular.js',
      'vendor/angular/angular-route.js',
      'vendor/angular/angular-animate.js',
      'vendor/angular/angular-mocks.js',
      'vendor/angular/angular-sanitize.js',
      'src/**/*.tpl.html',
      'tmp/config.js',
      'src/**/*.js',
      'src/**/*.coffee',
    ],
    exclude: [
      'src/assets/**/*.js',
      'src/**/*e2e*.js'
    ],
    frameworks: [ 'jasmine' ],
    plugins: [ 'karma-jasmine', 'karma-coverage', 'karma-phantomjs-launcher', 'karma-ng-html2js-preprocessor', 'karma-coffee-preprocessor' ],
    reporters: ['dots', 'coverage'],
    port: 9111,
    urlRoot: '/',
    autoWatch: true,
    browsers: [
      'PhantomJS'
    ],
    preprocessors: {
      // https://github.com/karma-runner/karma-ng-html2js-preprocessor
      'src/**/*.tpl.html': ['ng-html2js'],
      'src/**/*.coffee': ['coffee'],
      'src/common/greyhound/greyhound.js': 'coverage',
      'src/common/notify/notify.js': 'coverage',
      'src/common/starrating/starrating.js': 'coverage',
      'src/app/food/foodDB.js': 'coverage'
    },

    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    },

    coffeePreprocessor: {
      // options passed to the coffee compiler
      options: {
        bare: true,
        sourceMap: false
      },
      // transforming the filenames
      transformPath: function(path) {
        return path.replace(/\.coffee$/, '.js');
      }
    },

    ngHtml2JsPreprocessor: {
      moduleName: 'templates',
      cacheIdFromPath: function(filepath) {
        return filepath.replace(/src\/(app|common)\//, '', 'g');
      }
    }
  });
};

