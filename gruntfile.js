module.exports = function (grunt) {
	/*
	grunt.initConfig({
		pkg: '<json:package.json>',
		cdn: {
			dist: {
				src: ['./static/*.html', './static/*.css', './static/*.soy'],
				dest: './dist/static/',
				cdn: 'http://cdn.cloudfront.net/container/'
			}
		}
	});
	*/

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-cssmin');

};
