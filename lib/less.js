var _ = require("underscore"),
	path = require("path"),
	util = require("./util");

module.exports = function(options){
	var output = "";
	
	// put all in the default group if not specified
	var group = options.name || "main"; // aternatively, replace 'main' by template name? 
	// create group if new
	this.styles_less[group] = this.styles_less[group] || [];
	// make array from strings
	var files = util.toArray( options.files );
	
	var output = "";
	// direct output
	for( var i in files ){
		var domain = util.getDomain( files[i] );
		// filter out empty lines...
		if( _.isEmpty( files[i] ) ) continue;
		var url = ( (this.url && !domain) ? this.url : "") + files[i];
		// nothing to do it we're not minifying or requiring...
		if( !this.options.less.use ){ 
			output += '<link href="'+ url +'" media="screen" rel="stylesheet/less">';
		} else {
			this.styles_less[group].push( url );
		}
	}
	
	// Output
	if( this.options.less.use ){
		// add group if scripts added to minify
		if( this.styles_less[group].length ){ 
			var style = this.options.assetsPath + "css/"+ group + ".css";
			output += '<link href="'+ ( (this.url) ? this.url : "") + style +'" media="screen" type="text/css" rel="stylesheet">';
		}
		// 
	}
	
	return output;
};

