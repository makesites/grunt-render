var fs = require("fs"),
	_ = require("underscore");

module.exports = function (grunt) {

	grunt.registerMultiTask('less_render', "Minify less files", function () {
		var dir = this.data.dir + this.data.dest;
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
			// if the file exists - the task has already been done...
			if( fs.existsSync(lib) ) continue;

			// in all other cases add the task
			config.less.compile.files[lib] = styles;

		}

		if( !_.isEmpty( config.less.compile.files ) ){
			grunt.initConfig( config );

			grunt.tasks("less", config, function(){
				//console.log("compressed less");
			});
		}

	});


};
