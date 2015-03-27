module.exports = function (grunt) {
	grunt.registerTask('build', [
        'htmlhint',
        'jshint',
		'compileAssets',
		'linkAssetsBuild',
		'clean:build',
		'copy:build'
	]);
};
