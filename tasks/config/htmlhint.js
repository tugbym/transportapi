module.exports = function(grunt) {
    grunt.config.set('htmlhint', {
        options: {
            'tag-pair': true,
            'tagname-lowercase': true,
            'attr-lowercase': true,
            'attr-value-double-quotes': false,
            'doctype-first': true,
            'spec-char-escape': true,
            'id-unique': true,
            'style-disabled': true
        },
        src: ['./assets/**/*.html']
    });
    grunt.loadNpmTasks('grunt-htmlhint');
};