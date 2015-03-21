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

	// always disable regular output?
	grunt.log.header = function(){};
	var writeln = grunt.log.writeln();
	grunt.log.writeln = function(){
		// override success method...
		writeln.success = function(){ };
		return writeln;
	}

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-requirejs');

};
