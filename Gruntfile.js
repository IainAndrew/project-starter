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

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= config.app %>/scripts/{,*/}*.js'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      sass: {
        files: ['<%= config.app %>/sass/{,*/}*.scss'],
        tasks: ['sass'],
        options: {
          livereload: true
        },
      },
      includes: {
        files: ['<%= config.app %>/{,*/}*.html'],
        tasks: ['includes:files']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= config.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= config.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        hostname: '0.0.0.0',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= config.dist %>'
        }
      }
    },

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
        src: ['<%= config.app %>/partials/scripts.html'],
        devDependencies: true,
        exclude: [ '/bower_components/modernizr/modernizr.js' ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: ['<%= config.app %>/index.html', '<%= config.app %>/partials/scripts.html'],
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

    // Image optimisation
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= config.dist %>/images'
        }]
      }
    },

    // Build the site using grunt-includes
    includes: {
      files: {
        cwd: '<%= config.app %>',
        src: ['*.html'],
        dest: '.tmp',
        flatten: true,
        options: {
          silent: true,
          includePath: '<%= config.app %>/partials'
        }
      },
      dist: {
        cwd: '<%= config.app %>',
        src: ['*.html'],
        dest: '<%= config.dist %>',
        options: {
          flatten: true,
          includePath: '<%= config.app %>/partials'
        }
      },
    }

  });

  grunt.registerTask('serve', [
    'clean:server',
    'sass',
    'includes:files',
    'connect:livereload',
    'watch'
  ]);

  // Default task
  grunt.registerTask('build', [
    'clean:dist',
    'wiredep',
    'sass',
    'useminPrepare',
    'copy:dist',
    'imagemin',
    'includes:dist',
    'cssmin',
    'concat',
    'uglify',
    'usemin',
    'htmlmin'
  ]);
};