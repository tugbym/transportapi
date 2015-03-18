module.exports = function (grunt) {
	grunt.registerTask('buildProd', [
        'htmlhint',
		'compileAssets',
		'concat',
		'uglify',
		'cssmin',
		'linkAssetsBuildProd',
		'clean:build',
		'copy:build'
	]);
};
