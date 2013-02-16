
var grunt = require("grunt"),
	less = require("grunt-contrib-less"),
	require_config = require("require-config"),
	_ = require("underscore");

var defaults = require("./config");

var Main = function(app, options ){
	// fallbacks
	options || ( options = {} );
	// save params
	this.app = app;
	// main containers
	this.scripts = {};
	this.styles = {};
	// initiate require lib based on the options
	// check require configuration
	// the following can be replaced with a recursive extend?
	if( options.less ){
		options.less = _.extend( defaults.less, options.less);
	}
	if( options.require ){
		options.require = _.extend( defaults.require, options.require);
		// add config options? 
		this.rconf = require_config();
		
	}
	
	// merge options with defaults - save for later
	this.options = _.extend( defaults, options);
	
	// initial setup...
	if( options.require ){
	
		if( this.options.assetsPath ) this.rconf.set({ baseUrl : this.options.assetsPath });
		//if( this.options.require.callback ) this.rconf.set({ baseUrl : this.options.assetsPath });
	}
		
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
	// put all in the default group if not specified
	var group = options.name || "default";
	// create group if new
	this.scripts[group] || ( this.scripts[group] = [] );
	
	// make array from strings
	var files = toArray( options.files );
	
	/*
	// if name is an object it's not valid (?)
	if("type", typeof name != "string"){
		name 
	}
	*/
	
	//if(this.options.require.crossdomain)
	
	// switch case based on the environment 
	// if( DEV ) 
	// create files only if their signature is different 
	// output file(s)

	// direct output
	for( var i in files ){
		// filter out empty lines...
		if( _.isEmpty( files[i] ) ) continue;
		//
		var name = getFilename( files[i] );
		var domain = getDomain( files[i] );
		var host = this.options.hostname;
		//
		console.log("================= get DOMAIN ");
		console.log("crossdomain", this.options.minify.crossdomain);
		console.log("group", group);
		// minification
		if( this.options.minify.crossdomain ){
			// just add the script in the group
			this.scripts[group].push( files[i] );
		} else {
			if( (domain && domain != host) || name.search(/.min|-min./gi) > -1 ){
				// don't minify
			} else {
				// minify
				this.scripts[group].push( files[i] );
			}
		}
		//var minify = toMinify( files[i] );
		
		// 
		//if( _.isUndefined(this.app.locals["require-config"]) ){
		if( !this.options.require.use ){
			
			output += '<script type="text/javascript" src="'+ files[i] +'"></script>';
			
		} else {
			if( this.options.production ){
				// require group file
				var script = this.options.assetsPath + "js/"+ group + ".min.js"
			} else {
				var script = files[i];
			}
			
			// calculate paths & shim here...
			
			// save to the require config object
			this.rconf.deps( script );
		}
	}
	
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
	
	//console.log( this );
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
		output +=  '<script type="text/javascript" data-main="'+ this.options.assetsPath + this.rconf.options.client +'" src="'+ this.options.require.lib +'"></script>';
	} else {
		output +=  '<script type="text/javascript" src="'+ this.options.assetsPath + this.options.main +'"></script>';		
	}
	
	
	// minify files regardless
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

	console.log( this.rconf );
	
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

function getFilename( path ){
	return path.replace(/^.*[\\\/]/, '');
}

function getDomain( path ){
	var domain;
	// check if this is a full url
	if( path.search("http") > -1 ){
		// try to catch an exception? 
		domain = path.match(/:\/\/(.[^/]+)/)[1];
		
	} else if (path.search("//") == 0 ){
		// full URL with no protocol
		domain = path.match(/\/\/(.[^/]+)/)[1];
		//console.log("domain", domain );
	} else {
		// assume this is a relative path
		domain = false;
	}
	return domain;
}

var init = function(app, options){
	return new Main( app, options );
};

module.exports = init;
