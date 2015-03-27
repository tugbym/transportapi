module.exports = function(grunt) {
    grunt.config.set('jshint', {
        options: {
            curly: true,
            eqeqeq: true,
            eqnull: true,
            browser: true,
        },
        all: ['./assets/js/*.js', 
              './api/**/*.js', 
              './config/**/*.js']
    });
    grunt.loadNpmTasks('grunt-contrib-jshint');
};