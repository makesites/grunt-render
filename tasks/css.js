var fs = require("fs"),
	u = require("../lib/util"),
	_ = require("underscore");

module.exports = function (grunt) {

	grunt.task.registerMultiTask('css', "Minify css files", function () {
		var dir = this.data.dir + this.data.dest;
		//var done = this.async();
		var config = {
			cssmin: {
				options: this.data.options || {},

				target: {
					files: []
				}
			}
		};

		var compile = false;

		for(var i in this.data.src){
			var group = i;
			var styles = this.data.src[i];
			// add root dir in the paths
			for(i in styles){
				// skip files that are not on the server
				if( !u.isLocal( styles[i] ) ) continue;
				styles[i] = this.data.dir + styles[i];
			}
			var lib = dir + group+'.min.css';
			// exit now if empty array
			if( !styles.length ) continue;

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
				var updates  = u.hasUpdates(lib, styles);
				if( !updates ){
					// modifying date of lib so it's not touched again until timeout...
					var timestamp = now / 1000;
					fs.utimesSync(lib, timestamp, timestamp);
					continue;
				}
			}
			// in all other cases add the task
			/*
			config.cssmin[group] = {
				src: styles,
				dest: lib
			};
			*/
			// can we combine without minifying?
			//config.cssmin.combine.files[lib]= styles;

			config.cssmin.target.files.push({
				//expand: true,
				//cwd: 'release/css/',
				src: styles,
				dest: lib,
				//ext: '.min.css'
			});
			// set flag
			if( !compile ) compile = true;
		}

		if( compile ){
			// update config
			grunt.config.set( "cssmin", config.cssmin );

			grunt.tasks("cssmin", config, function(){
				//console.log("compressed css");
				//done();
			});

		}

	});


};
