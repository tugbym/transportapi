module.exports = function (grunt) {
	grunt.registerTask('default', ['htmlhint', 'jshint', 'compileAssets', 'linkAssets', 'watch']);
};
