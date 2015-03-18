module.exports = function (grunt) {
	grunt.registerTask('prod', [
        'htmlhint',
		'compileAssets',
		'concat',
		'uglify',
		'cssmin',
		'sails-linker:prodJs',
		'sails-linker:prodStyles'
	]);
};
