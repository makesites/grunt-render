
var grunt = require("grunt"),
	less = require("grunt-contrib-less"),
	//r_config = require("require-config"),
	_ = require("underscore");

var defaults = require("./config");

Main = function(app, options ){
	// save params
	this.app = app;
	// initiate require lib based on the options
	// check require configuration
	// the following can be replaced with a recursive extend?
	if( options.less ){
		options.less = _.extend( defaults.less, options.less);
	}
	if( options.require ){
		options.require = _.extend( defaults.require, options.require);
	}
	
	// merge options with defaults - save for later
	this.options = _.extend( defaults, options);
	
	return this;
};

Main.prototype.css = function( options ){
	
	var output = "";
	
	// make array from strings
	var files = toArray( options.files );
    
	for( var i in files ){
		// filter out empty lines...
		if( _.isEmpty( files[i] ) ) continue;
		output += '<link href="'+ files[i] +'" rel="stylesheet" type="text/css"></script>';
	}
	
	return output;
};

Main.prototype.js = function( options ){
	var output = "";
	
	// make array from strings
	var files = toArray( options.files );
	
	/*
	// if name is an object it's not valid (?)
	if("type", typeof name != "string"){
		name 
	}
	*/
			
	// switch case based on the environment 
	// if( DEV ) 
	// create files only if their signature is different 
	// output file(s)
	//if( _.isUndefined(this.app.locals["require-config"]) ){
	// direct output
	for( var i in files ){
		// filter out empty lines...
		if( _.isEmpty( files[i] ) ) continue;
		output += '<script type="text/javascript" src="'+ files[i] +'"></script>';
	}
	
	//} else {
	// save to the require config object
			//r_config.add()
	//}
	return output;
};

Main.prototype.less = function(options){
	var output = "";
	
	// make array from strings
	var files = toArray( options.files );
	
	// condition the addition of the less script
	
	var output = "";
	// direct output
	for( var i in files ){
		// filter out empty lines...
		if( _.isEmpty( files[i] ) ) continue;
		output += '<link href="'+ files[i] +'" media="screen" rel="stylesheet/less">';
		// set the flag for later
		this.options.less.use = true;
	}
	
	return output;
};

Main.prototype.render = function(){
	
	console.log("==================== WTF"); 
	console.log( this );
	var options = {};
	var output = "";
	
	// minify the files regardless if they are used
	
	// use cdn only in production
	
	// include less script if applicable
	if( this.options.less.use ){
		output +=  '<script type="text/javascript" src="'+ this.options.less.lib +'"></script>';
	}
	// final output
	
	if( this.options.require.use ){
		output +=  '<script type="text/javascript" data-main="'+ this.options.assetsPath + this.options.main +'" src="'+ this.options.require.lib +'"></script>';
	} else {
		output +=  '<script type="text/javascript" src="'+ this.options.assetsPath + this.options.main +'"></script>';		
	}
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

	// find better to include tasks...
	grunt.loadTasks('./node_modules/grunt-render/tasks');
	//grunt.loadNpmTasks('grunt-contrib-uglify');
	//grunt.loadNpmTasks('./node_modules/grunt-render/node_modules/grunt-contrib-less');
	
	return output;
	
};

// Helpers
function toArray( files ){
	return files.replace(/ |\t/gi, "").split("\n");
}

var init = function(app, options){
	return new Main( app, options );
};

module.exports = init;
