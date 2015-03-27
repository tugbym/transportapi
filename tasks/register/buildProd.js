module.exports = function (grunt) {
	grunt.registerTask('buildProd', [
        'htmlhint',
        'jshint',
		'compileAssets',
		'concat',
		'uglify',
		'cssmin',
		'linkAssetsBuildProd',
		'clean:build',
		'copy:build'
	]);
};
