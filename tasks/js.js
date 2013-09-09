var fs = require("fs"),
	_ = require("underscore");

module.exports = function (grunt) {

	grunt.registerMultiTask('js', "Minify js files", function () {
		var dir = this.data.dir + this.data.dest;
		var config = {
			  uglify: {}
		};

		for(var i in this.data.src){
			var group = i;
			var scripts = this.data.src[i].files;
			// add root dir in the paths
			for(i in scripts){
				scripts[i] = this.data.dir + scripts[i];
			}
			var lib = dir + group+'.min.js';
			// exit now if empty array
			if( !scripts.length ) continue;

			// execute this once or with a delay... (set: options.minify.recurring : 3600)
			if( this.data.recurring ){
				// check if there's an existing file
				var now = (new Date()).getTime()
				timestamp = ( fs.existsSync(lib) ) ? fs.statSync(lib).mtime.getTime() : false;
				// stop now if it's too early
				if( timestamp && now - timestamp < this.data.recurring ) continue;

			} else {
				// if the file exists - the task has already been done...
				if( fs.existsSync(lib) ) continue;
			}

			// in all other cases add the task
			config.uglify[group] = {
				src: scripts,
				dest: lib
			};

		}

		if( !_.isEmpty( config.uglify ) ){
			grunt.initConfig( config );

			grunt.tasks("uglify", config, function(){
				//console.log("compressed js");
			});
		}
		//var relativeTo = this.data.cdn;
		//var files = grunt.file.expandFiles(this.file.src);
		//var dest = this.file.dest;

		//files.map(grunt.file.read).forEach(function (content, i) {
			//var filename = files[i];
			//var type = path.extname(filename).replace(/^\./, '');

			// write the contents to destination
			//var filePath = dest ? path.join(dest, path.basename(filename)) : filename;
			//grunt.file.write(filePath, content);
		//});

	});


};
