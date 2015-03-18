module.exports = function (grunt) {
	grunt.registerTask('build', [
        'htmlhint',
		'compileAssets',
		'linkAssetsBuild',
		'clean:build',
		'copy:build'
	]);
};
