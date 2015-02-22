module.exports = function ( grunt ) {
  'use strict';

  var appConfig = require('./config/app-config.js');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  // https://github.com/ericf/grunt-broccoli-build
  grunt.loadNpmTasks('grunt-broccoli-build');
  // https://www.npmjs.org/package/grunt-mustache-render
  grunt.loadNpmTasks('grunt-mustache-render');
  // https://www.npmjs.org/package/grunt-karma
  grunt.loadNpmTasks('grunt-karma');
  // https://github.com/gruntjs/grunt-contrib-clean
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  // https://github.com/btford/grunt-conventional-changelog
  grunt.loadNpmTasks('grunt-conventional-changelog');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-version');

  var packageJSON = grunt.file.readJSON('package.json');

  var taskConfig = {

    jshint: {
      src: {
        files: {
          src: ['src/**/*.js']
        },
        options: {
          jshintrc: '.jshintrc',
          ignores: [
            // ignore wrapped 3rd party lib
            'src/common/taffy/taffy.js',
            'src/common/taffy/vendor/taffy.js',
            'src/common/localforage/localforage.js',
            'src/common/localforage/vendor/localforage.js'
          ]
        },
      }
    },

    mustache_render: {
      options: {},
      appConfig: {
        options: {},
        files : [
          {
            data: {
              config: JSON.stringify(appConfig, null, 2)
            },
            template: 'config/config.tpl',
            dest: 'tmp/config.js'
          }
        ]
      },
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    },

    // Build the deployable app using `broccoli build`
    // Will output the all required files to
    // `PHONEGAPDIR/www/`
    broccoli_build: {
      phonegap: {
        dest: appConfig.path.phonegapwww
      }
    },

    // Clean the `phonegap/www` directory
    // So the app builds to an empty dir
    clean: {
      phonegapwww: [appConfig.path.phonegapwww]
    },

    // Watch
    watch: {
      // Watch all source files and rebuild the phonegap directory
      build: {
        files: [
          'src/app/**/*.js',
          'src/app/**/*.tpl.html',
          'src/less/*.less',
          'src/index.html',
          'src/common/**/*.js',
          '!src/**/*spec*.js'
        ],
        tasks: ['build']
      }
    },

    changelog: {
      options: {
        commitLink: function(hash) {
          return '['+hash.slice(0,7)+'](https://bitbucket.org/thekarel/street-foody-app/commits/'+hash+')';
        }
      }
    },

    replace: {
      // increment the version number in AndroidManifest.xml
      // eg. android:versionCode="1202" becomes android:versionCode="1203"
      // NEEDS TO RUN BEFORE `ANDROIDVERSION`
      androidversioncode: {
        options: {
          patterns: [
            {
              match: /android:versionCode="([\d]+)"/,
              replacement: function(matchAll, matchNum) {
                var newNum = parseInt(matchNum, 10);
                if(isNaN(newNum)) {
                  throw new Error('versionCode is NaN');
                }

                return matchAll.replace(matchNum, newNum + 1);
              }
            }
          ]
        },
        files: [
          {expand: true, flatten: true, src: ['src/phonegap/AndroidManifest.xml'], dest: 'src/phonegap/'}
        ]
      },

      // androidversion & androidmanifest
      // Update version number in PhoneGap `config.xml` and `AndroidManifest.xml`
      // to something like `0.12.1-26-dev` ie. version + build number + branch
      // Example command: `grunt androidversion --buildnum=75 --branch=master`
      androidversion: {
        options: {
          patterns: [
            {
              match: 'androidversion', // look for @@androidversion in the xml file
              replacement: packageJSON.version + '-' + grunt.option('buildnum') + '-' + grunt.option('branch')
            }
          ]
        },
        files: [
          {expand: true, flatten: true, src: ['src/phonegap/config.xml'], dest: 'phonegap/'}
        ]
      },
      androidmanifest: {
        options: {
          patterns: [
            {
              match: 'androidversion',
              replacement: packageJSON.version + '-' + grunt.option('buildnum') + '-' + grunt.option('branch')
            }
          ]
        },
        files: [
          {expand: true, flatten: true, src: ['src/phonegap/AndroidManifest.xml'], dest: 'phonegap/platforms/android/'}
        ]
      },

      appversion: {
        options: {
          patterns: [
            {
              match: /"version": ".*",/,
              replacement: '"version": "'+packageJSON.version + '-' + grunt.option('buildnum') + '-' + grunt.option('branch') +'",'
            }
          ]
        },
        files: [
          {expand: true, flatten: true, src: ['phonegap/www/src/config.js'], dest: 'phonegap/www/src/'}
        ]
      }
    },

    version: {
      package: {
        src: ['package.json']
      },
    }
  };

  // Register plugin tasks
  grunt.initConfig(taskConfig);

  // Own tasks
  grunt.registerTask('copy-phonegap-assets', 'Copies assets to PhoneGap www', function() {
    grunt.file.copy(appConfig.path.phonegap+'/icon.png', appConfig.path.phonegapwww+'/icon.png');
  });

  // pre-git commit task
  grunt.registerTask( 'commit', 'Prepares repo for commit', ['jshint'] );

  // prepare unit tests
  grunt.registerTask( 'unit', 'Prepares and runs unit tests for TDD', ['mustache_render:appConfig', 'karma:unit'] );

  // prepare for phonegap build
  grunt.registerTask( 'build', 'Builds PhoneGap www', ['clean:phonegapwww', 'broccoli_build:phonegap', 'copy-phonegap-assets'] );

  // preparea a PG build and then launch watch, so you can use phonegap app -- see readme
  grunt.registerTask( 'stare', 'Builds PhoneGap www on source files change', ['build', 'watch:build'] );

  // bump version and gen changelog
  grunt.registerTask('relmin', 'bump minor version and gen changelog', ['version::minor', 'replace:androidversioncode', 'changelog']);
  grunt.registerTask('relpatch', 'bump minor version and gen changelog', ['version::patch', 'replace:androidversioncode', 'changelog']);

  // default
  grunt.registerTask( 'default', ['commit'] );
};
