module.exports = function (grunt) {
	grunt.registerTask('default', ['htmlhint', 'compileAssets', 'linkAssets', 'watch']);
};
