
var less = require("grunt-contrib-less"),
	//r_config = require("require-config"),
	_ = require("underscore");

var defaults = {
	
	require : {
		src : "//cdnjs.cloudflare.com/ajax/libs/require.js/2.1.4/require.min.js"
	}
}

Main = function(app, options ){
	// save params
	this.app = app;
	// initiate require lib based on the options
	if( options.require ){
		// check require configuration
	}
	// merge options with defaults - save for later
	this.options = _.extend( defaults, options);
	
	return this;
};

Main.prototype.css = function( files, options ){
	
	var output = "";
	
	// make array from strings
	files = toArray( files );
    
	for( var i in files ){
		// filter out empty lines...
		if( _.isEmpty( files[i] ) ) continue;
		output += '<link href="'+ files[i] +'" rel="stylesheet" type="text/css"></script>';
	}
	
	return output;
};

Main.prototype.js = function( files, options ){
	var output = "";
	
	// make array from strings
	files = toArray( files );
	
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

Main.prototype.less = function(files, options){
	var output = "";
	
	// make array from strings
	files = toArray( files );
	
	// condition the addition of the less script
	// <script src="http://cdnjs.cloudflare.com/ajax/libs/less.js/1.3.1/less.min.js" type="text/javascript"></script>
	
	var output = "";
	// direct output
	for( var i in files ){
		// filter out empty lines...
		if( _.isEmpty( files[i] ) ) continue;
		output += '<link href="'+ files[i] +'" media="screen" rel="stylesheet/less">';
	}
	
	return output;
};

Main.prototype.render = function(){
	
};

// Helpers
function toArray( files ){
	return files.replace(/ |\t/gi, "").split("\n");
}

var init = function(app, options){
	return new Main( app, options );
};

module.exports = init;
