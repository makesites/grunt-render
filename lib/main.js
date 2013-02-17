
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
	
	// initial setup...
	if( options.require ){
		
		// add config options? 
		this.rconf = require_config(this.app);
		//
		if( this.options.assetsPath ) this.rconf.set({ baseUrl : this.options.assetsPath + "js/" });
		//if( this.options.require.callback ) this.rconf.set({ baseUrl : this.options.assetsPath });
		//this.rconf.options.client = this.options.assetsPath + this.rconf.options.client;
		//this.rconf.router();
		
	}
	// main containers
	this.setup();
	
		
	return this;
};

Main.prototype.setup = function(){
	this.scripts = {};
	this.styles = {};
	this.styles_less = {};
	this.order = 0;
	// reset require config
	if( this.options.require ){
		this.rconf.setup();
		if( this.options.assetsPath ) this.rconf.set({ baseUrl : this.options.assetsPath + "js/" });
	}
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
	var group = options.name || "default"; // replace default by template name? 
	// create group if new
	this.scripts[group] || ( this.scripts[group] = { order : (this.order++), files : [] });
	
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
		// nothing to do it we're not minifying or requiring...
		if( !this.options.require.use &&  !this.options.minify.use ){
			output += '<script type="text/javascript" src="'+ files[i] +'"></script>';
			continue;
		}
		
		var name = getFilename( files[i] );
		var domain = getDomain( files[i] );
		var host = this.options.hostname;
		//
		//console.log("================= get DOMAIN ");
		//console.log("crossdomain", this.options.minify.crossdomain);
		//console.log("group", group);
		// minification
		if( this.options.minify.crossdomain ){
			// just add the script in the group
			this.scripts[group].files.push( files[i] );
		} else {
			if( (domain && domain != host) || name.search(/.min|-min./gi) > -1 ){
				// don't minify
				//this.scripts[group].files.push( files[i] );
				if( !this.options.require.use ){ 
					output += '<script type="text/javascript" src="'+ files[i] +'"></script>';
				} else {
					// add to require object
					this.rconf.deps( script );
				}
			} else {
				// add to minify array
				this.scripts[group].files.push( files[i] );
			}
		}
		//var minify = toMinify( files[i] );
		
		// 
		//if( _.isUndefined(this.app.locals["require-config"]) ){
		/*
		if( this.options.production ){
			// require group file
			var script = this.options.assetsPath + "js/"+ group + ".min.js"
		} else {
			var script = files[i];
			// 
		}
		*/
		// calculate paths & shim here...
		if( this.options.require.use ){
			// save to the require config object
			
		}
	}
	
	// Output
	if( !this.options.require.use &&  this.options.minify.use ){
		// add group if scripts added to minify
		if( this.scripts[group].files.length ){ 
			var script = this.options.assetsPath + "js/"+ group + ".min.js"
			output += '<script type="text/javascript" src="'+ script +'"></script>';
		}
		// 
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

Main.prototype.render = function(req, res, next){
	//console.log("========================== RESET ===================");
	//console.log( this.scripts );
	//render( options );
	//res.render();
	//grunt.render();
	next();
};

// final output on the page
Main.prototype.end = function(){
	
	var dest = this.options.assetsPath + "js/";
	// minification options
	var options = {
		//pkg: '<json:package.json>',
		js: {
			min : {
				dir : this.options.publicDir, 
				src : this.scripts,
				dest: dest
			}
		},
		css: {
			min : {
				src : this.styles,
				dest: this.options.assetsDir
			}
		},
		less: {
			min : {
				src : this.styles_less,
				dest: this.options.assetsDir
			}
		}
	};
	//cdn: this.options.cdn || false
	// minify files regardless
	grunt.initConfig( options );

	//console.log( this.rconf );
	
	// find better to include tasks...
	grunt.loadTasks('./node_modules/grunt-render/tasks');
	//grunt.loadNpmTasks('grunt-contrib-uglify');
	//grunt.loadNpmTasks('./node_modules/grunt-render/node_modules/grunt-contrib-less');
	grunt.tasks("js", options, function(){
		//console.log("Done!");
	});
	
	// Output
	var output = "";
	
	// minify the files regardless if they are used
	
	// require 
	
	// use cdn only in production
	
	// include less script if applicable
	if( this.options.less.use ){
		output +=  '<script type="text/javascript" src="'+ this.options.less.lib +'"></script>';
	}
	// final output
	
	if( this.options.require.use ){
		//output +=  '<script type="text/javascript" data-main="'+ this.options.assetsPath + this.rconf.options.client +'" src="'+ this.options.require.lib +'">';
		output +=  '<script type="text/javascript" src="'+ this.options.require.lib +'"></script>';
		output +=  '<script type="text/javascript">require.config('+ JSON.stringify( this.rconf.render() ) +')</script>';
	} else {
		output +=  '<script type="text/javascript" src="'+ this.options.assetsPath + this.options.main +'"></script>';		
	}
	
	
	// reset
	this.setup();
	
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
