'use strict()';

var config= {
    port: 3000
};

module.exports = function(grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),



        watch: {
            livereload: {
                files: [
                'js/**/*.js',
                'css/*.css',
                'index.html'
                ],
                options: {
                    livereload: true
                }
            }
        }
    });
};
