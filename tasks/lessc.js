var fs = require("fs"),
	u = require("../lib/util"),
	_ = require("underscore");

module.exports = function (grunt) {

	grunt.task.registerMultiTask('lessc', "Minify less files", function () {
		var dir = this.data.dir + this.data.dest;
		//var done = this.async();
		var config = {
			less: {
				compile: {
					options: {
						paths: [],
						compress: true
					},
					files: {}
				}
			}
		};

		for(var i in this.data.src){
			var group = i;
			var styles = this.data.src[i];
			// exit now if empty array
			if( !styles.length ) continue;
			// add root dir in the paths
			for(i in styles){
				styles[i] = this.data.dir + styles[i];
			}
			// create group if needed
			// add root dir in the paths
			config.less.compile.options.paths.push( this.data.dir + "/assets/less" );

			var lib = this.data.dir + this.data.dest + group+'.css';

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
				var files = getLessFiles( styles );
				var updates  = u.hasUpdates(lib, files);
				if( !updates ){
					// modifying date of lib so it's not touched again until timeout...
					var timestamp = now / 1000;
					fs.utimesSync(lib, timestamp, timestamp);
					continue;
				}
			}
			// in all other cases add the task
			config.less.compile.files[lib] = styles;

		}

		if( !_.isEmpty( config.less.compile.files ) ){
			// update config
			grunt.config.set( "less", config.less );

			grunt.tasks("less", config, function(){
				//console.log("compressed less");
				//done();
			});

		}
	});


};


// Helpers

getLessFiles = function( files ){
	var result = [];
	for( var i in files ){
		var file = files[i];
		var path = file.substring(0,file.lastIndexOf("/")+1);
		var contents = fs.readdirSync( path ); // get all files in the dir..
		// add the path to the contents
		for( var j in contents ){
			result.push( path + contents[j] );
		}
	}
	return result;
}