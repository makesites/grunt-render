var fs = require("fs"),
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

			// - if not recursive check if the file already exists
			var exists = fs.existsSync(lib);

			if( !this.data.recurring && exists ){
				continue;
			}
			// - if timeout, check the last modified timestamp
			if( this.data.timeout && exists ){
				var now = (new Date()).getTime();
				var modified = fs.statSync(lib).mtime.getTime();
				// stop now if it's too early
				console.log("less: now - modified", (now - modified) );
				if( now - modified < this.data.timeout ){
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
