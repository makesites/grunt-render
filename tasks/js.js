var fs = require("fs"),
	u = require("../lib/util"),
	_ = require("underscore");

module.exports = function (grunt) {

	grunt.task.registerMultiTask('js', "Minify js files", function () {
		var dir = this.data.dir + this.data.dest;
		//var done = this.async();
		var config = {
			uglify: {
				options: this.data.options || {}
			}
		};
		var compile = false;

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

			// Conditions:
			var now = (new Date()).getTime();
			var exists = fs.existsSync(lib);

			// - if not recursive check if the file already exists
			if( !this.data.recurring && exists ){
				continue;
			}
			// - if timeout, check the last modified timestamp
			if( this.data.timeout && exists ){
				var modified = parseInt( fs.statSync(lib).mtime.getTime().toString().substring(0, 13) );
				// stop now if it's too early
				if( now - modified < this.data.timeout ){
					continue;
				}
			}
			// - proceed only if there's a newer file
			if( exists ){
				var updates  = u.hasUpdates(lib, scripts);
				if( !updates ){
					// modifying date of lib so it's not touched again until timeout...
					var timestamp = now / 1000;
					fs.utimesSync(lib, timestamp, timestamp);
					continue;
				}
			}
			// in all other cases add the task
			config.uglify[group] = {
				src: scripts,
				dest: lib
			};
			// set flag
			if( !compile ) compile = true;

		}

		if( compile ){
			// update config
			grunt.config.set( "uglify", config.uglify );

			grunt.tasks("uglify", config, function(){
				//console.log("compressed js");
				//done();
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
