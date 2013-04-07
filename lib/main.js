
var grunt = require("grunt"),
	_ = require("underscore"),
	path = require('path'), 
	require_config = require("require-config"),
	markup = require("./markup"),
	Parser = require("./parser");

var defaults = require("./options");

var Main = function( options ){
	// fallbacks
	options = options || {};
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
	// an empty object for all client-side js
	this.client = {};
	// initial setup...
	if( options.require ){
		
		// add config options? 
		this.client['require'] = require_config();
		//
		if( this.options.assetsPath ) this.client['require'].set({ baseUrl : this.options.assetsPath + "js/" });
		
	}
	
	// initialize containers
	this.setup();
	
	// main parsers
	// condition this based on the config?
	this.css = new Parser("css", this);
 	this.js =  new Parser("js", this);
	this.less =  new Parser("less", this);

	return this;
};

Main.prototype.setup = function(){
	this.files = {
		js : {},
		css : {},
		less : {}
	}; 
	this.order = 0;
	// reset require config
	if( this.options.require ){
		this.client['require'].setup();
		if( this.options.assetsPath ) this.client['require'].set({ baseUrl : this.options.assetsPath + "js/" });
	}
	//this.url = ( this.options.cdn ) ? ( (this.options.ssl) ? "https://" : "http://" )+ this.options.cdn : false;
	this.url = ( this.options.cdn ) ? "//"+ this.options.cdn : false;
};

// unused middleware that was going to be triggered on every request...
Main.prototype.render = function(req, res, next){
	next();
};

// final output on the page
Main.prototype.main = function(){
	
	// minification options
	var options = {
		//pkg: '<json:package.json>',
		gruntfile : path.normalize( __dirname+'/../gruntfile.js'), 
		js: {
			min : {
				dir : this.options.publicDir, 
				src : this.files['js'],
				dest: this.options.assetsPath + "js/",
				recurring : this.options.minify.recurring
			}
		},
		css: {
			min : {
				dir : this.options.publicDir, 
				src : this.files['css'],
				dest: this.options.assetsPath + "css/",
				recurring : this.options.minify.recurring
			}
		},
		less_render: {
			min : {
				dir : this.options.publicDir, 
				src : this.files['less'],
				dest: this.options.assetsPath + "css/"
			}
		}
	};
	//cdn: this.options.cdn || false
	// minify files regardless
	grunt.initConfig( options );

	// find better to include tasks...
	grunt.loadTasks( path.normalize( __dirname+'/../tasks') );
	// 
	grunt.tasks(["js", "less_render"], options, function(){
		console.log("Grunt.js Tasks Completed!");
	});
	
	// Output
	var output = "";
	
	// minify the files regardless if they are used
	
	// require 
	
	// use cdn only in production
	
	// condition the addition of the less script
	if( !_.isEmpty(this.files['less']) && !this.options.less.use ){
		output +=  markup.js( this.options.less.lib );
	}
	
	// final output
	
	if( this.options.require.use ){
		this.client['require'].set({ callback : function(){ window["init"].call(); } });
		//output +=  '<script type="text/javascript" data-main="'+ this.options.assetsPath + this.client['require'].options.client +'" src="'+ this.options.require.lib +'">';
		output +=  '<script type="text/javascript">var require = '+ JSON.stringify( this.client['require'].render() ) +'</script>';
		if( this.options.require.main ){ 
			output +=  '<script type="text/javascript" data-main="'+ this.options.assetsPath + "js/" + this.options.require.main +'" src="'+ this.options.require.lib +'"></script>';
		} else {
			output +=  markup.js( this.options.require.lib );	
		}
	} else {
		var url = ( (this.url) ? this.url : "") + this.options.assetsPath + this.options.main;
		output +=  markup.js( url );		
	}
	
	// reset
	this.setup();
	
	return output;
	
};


var init = function( options ){
	return new Main( options );
};


module.exports = init;
