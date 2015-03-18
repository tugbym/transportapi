module.exports = function (grunt) {
	grunt.registerTask('default', ['htmlhint:build', 'compileAssets', 'linkAssets', 'watch']);
};
