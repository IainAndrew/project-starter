module.exports = function(grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'dist'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    config: appConfig,

    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= config.dist %>/{,*/}*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['<%= config.app %>/index.html'],
        devDependencies: true
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= config.app %>/index.html',
      options: {
        dest: '<%= config.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= config.dist %>/{,*/}*.html'],
      css: ['<%= config.dist %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= config.dist %>','<%= config.dist %>/images']
      }
    },

    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/sass',
          src: ['*.scss'],
          dest: '<%= config.app %>/styles',
          ext: '.css'
        }],
        options: {
          loadPath: [
            'bower_components/bourbon/app/assets/stylesheets',
            'bower_components/neat/app/assets/stylesheets'
          ]
        }
      }
    },

    copy: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>',
          dest: '<%= config.dist %>',
          src: [
            '*.{ico,png,txt}',
            '*.html',
            'images/*',
            'styles/*'
          ], 
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= config.dist %>',
          src: ['*.html'],
          dest: '<%= config.dist %>'
        }]
      }
    },

    // Build the site using grunt-includes
    includes: {
      build: {
        cwd: '<%= config.app %>',
        src: ['*.html'],
        dest: '<%= config.dist %>',
        options: {
          flatten: true,
          includePath: '<%= config.app %>/partials'
        }
      }
    }

  });

  // Default task
  grunt.registerTask('default', [
    'clean:dist',
    'wiredep',
    'sass',
    'useminPrepare',
    'copy:dist',
    'includes',
    'cssmin',
    'concat',
    'uglify',
    'usemin',
    'htmlmin'
  ]);
};