
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
			
			config.uglify[group] = {
				src: scripts,
				dest: lib
			  };
  			
			/*
		
  */
		}
		
			grunt.initConfig( config );
			
			grunt.tasks("uglify", config, function(){
				console.log("DONE!!!");
			});
			
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
