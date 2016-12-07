module.exports = function(grunt) {
  // Project configuration
  grunt.initConfig({
	//Load project package.json
    pkg: grunt.file.readJSON('package.json'),
	//Setup the watch script
    watch: {
      scripts: {
        files: 'js/**/*.js',
        tasks: ['concat', 'uglify'],
        options: {
			//Check for changes every 250ms
          debounceDelay: 250
        }
      }
    },
    concat: {
      js: {
        src:  [
				//Other files have a dependency on Phaser.js
                'js/phaser.js',
				//Load other files
                'js/*/*.js',
				//Resolves to only main.js as it needs all other files to have loaded 
                'js/*.js'
              ],
		//Write concatenated file to this location
        dest: 'build/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
		//Setup minified file header
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
		//Source and destination for minified JavaScript file
        src: 'build/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    }
  });

  // Load the plugin that provides the "concat", "uglify" and "watch" tasks
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task
  grunt.registerTask('default', ['concat', 'uglify']);
};
