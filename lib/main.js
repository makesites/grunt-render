
var _ = require("underscore"),
	path = require('path'),
	require_config = require("require-config"),
	markup = require("./markup"),
	Parser = require("./parser"),
	u = require("./util");

var defaults = require("./options");
// enviroment state
var DEV = (process.env.NODE_ENV == "production") ? false : true;

var Main = function( options ){
	// fallbacks
	options = options || {};
	// initiate require lib based on the options
	// check require configuration
	// merge options with defaults - save for later
	this.options = Object.assign({}, defaults, options);

	// an empty object for all client-side js
	this.client = {};
	// initial setup...
	if( this.options.require ){
		// add config options?
		var r = {};
		if( this.options.require.config ) r.config = this.options.require.config;
		this.client['require'] = require_config( r );
		//
		if( this.options.assetsPath ) this.client['require'].set({ baseUrl : this.options.assetsPath + "js/" });
		// special condition for build using r.js
		this.options.require.build = (this.options.require.use && this.options.require.min  && this.options.minify.use);
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

// render require.js config
Main.prototype.require = function(){
	// add callback
	this.client['require'].set({ callback : "function(){ window.init(); }" });
	var config = JSON.stringify( this.client['require'].render() );
	// TEMP FIX: callback without quotes
	config = config.replace('"function(){ window.init(); }"', 'function(){ window.init(); }');
	// output
	return config;
};

// get last config (in static form)
Main.prototype.requireConfig = function(){
	return this._last_config || {};
};

// unused middleware that was going to be triggered on every request...
Main.prototype.render = function(req, res, next){
	next();
};

// final output on the page
Main.prototype.main = function( opt ){
	opt = opt || {};
	var base = process.mainModule.paths[0].split('node_modules')[0].slice(0, -1); // process.cwd(); // #7
	// minification options
	var options = {
		//pkg: '<json:package.json>',
		base: base,
		gruntfile : path.normalize( __dirname+'/../gruntfile.js'),
		js: {
			min : {
				options: {
					mangle: this.options.minify.mangle || false
				},
				dir : this.options.publicDir,
				src : this.files['js'],
				dest: this.options.assetsPath + "js/",
				recurring : this.options.minify.recurring || false,
				timeout : this.options.minify.timeout || 0
			}
		},
		css: {
			min : {
				dir : this.options.publicDir,
				src : this.files['css'],
				dest: this.options.assetsPath + "css/",
				recurring : this.options.minify.recurring || false,
				timeout : this.options.minify.timeout || 0
			}
		},
		lessc: {
			min : {
				dir : this.options.publicDir,
				src : this.files['less'],
				dest: this.options.assetsPath + "css/",
				recurring : this.options.minify.recurring || false,
				timeout : this.options.minify.timeout || 0
			}
		},
		requirejs: {
			compile: {
				options: {}
			}
		}
	};
	//cdn: this.options.cdn || false

	// add require.js options only if necessary
	if( this.options.require.build ){
		var rjs_options = this.client['require'].build();
		// tweak options
		rjs_options.baseUrl = this.options.publicDir + rjs_options.baseUrl;
		rjs_options.name = this.options.require.main.replace(".js", ""),
		rjs_options.out = rjs_options.baseUrl + this.options.require.min;
		// these options help during the build process
		rjs_options.findNestedDependencies = true;
		rjs_options.waitSeconds = 20;
		rjs_options.optimize = "uglify2";
		rjs_options.uglify2 = {
			mangle: this.options.minify.mangle,
			output: { beautify : !(this.options.minify.mangle) }
		};
		rjs_options.preserveLicenseComments = false;
		rjs_options.skipModuleInsertion = true;
		if( this.options.require.include ) rjs_options.include = this.options.require.include;
		//
		options.requirejs.compile.options = rjs_options;
	}

	// local context for grunt include
	var grunt = Object.assign({}, require("grunt") );

	// initialize grunt configuration
	grunt.initConfig( options );

	// include tasks for every category...
	grunt.loadTasks( path.normalize( __dirname+'/../tasks') );
	// create tasks
	var tasks = [];
	if( !_.isEmpty( this.files['js'] ) ) tasks.push("js");
	if( !_.isEmpty( this.files['less'] ) ) tasks.push("lessc");
	if( !_.isEmpty( this.files['css'] ) ) tasks.push("css");
	// minify require.js modules only if necessary
	if( this.options.require.build ) {
		tasks.push("requirejs");
		// do this only once per run
		this.options.require.build = false;
		// use the compiled file
		this.options.require.main = this.options.require.min;
		// later versions of r.js use 'out' instead of 'min'?
		this.options.require.out = this.options.require.min;
	}

	if( !_.isEmpty( tasks ) ){
		//console.log( JSON.stringify( options ) );
		// execute tasks...
		grunt.tasks(tasks, options, function(){
			//console.log("Grunt.js Tasks Completed!");
		});
	}
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
		//output +=  '<script type="text/javascript" data-main="'+ this.options.assetsPath + this.client['require'].options.client +'" src="'+ this.options.require.lib +'">';
		var config = 'var require = '+ this.require() +';';
		if( this.options.require.output ){
			output +=  '<script type="text/javascript">'+ config +'</script>';
		} else {
			this._last_config = config;
			// also save in session if provided
			if( opt.session ) opt.session._require_config = config;
		}
		if( this.options.require.main ){
			output +=  '<script type="text/javascript" data-main="'+ this.options.assetsPath + "js/" + this.options.require.main +'" src="'+ this.options.require.lib +'"></script>';
		} else {
			output +=  markup.js( this.options.require.lib );
		}
	} else {
		var url = ( (this.url) ? this.url : "") + this.options.assetsPath + this.options.main;
		// custom attributes from config
		var attrs = this.options.js || {};

		output +=  markup.js( url, attrs );
	}

	// reset
	this.setup();
	//
	return output;

};


var init = function( options ){
	return new Main( options );
};


exports = module.exports = init;

// exposing main class to support multi-site setups
exports.Build = Main;
