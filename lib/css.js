var _ = require("underscore"),
	path = require("path"),
	markup = require("./markup"),
	u = require("./util");

module.exports = function( options ){

	var output = "";

	// put all in the default group if not specified
	var group = options.name || "styles"; // aternatively, replace 'styles' by template name?
	// create group if new
	this.files['css'][group] = this.files['less'][group] || [];
	// make array from strings
	var files = u.toArray( options.files );

	// direct output
	for( var i in files ){
		var domain = u.getDomain( files[i] );
		// consider crossdomain option here...
		// filter out empty lines...
		if( _.isEmpty( files[i] ) ) continue;
		var url = ( (this.url && !domain) ? this.url : "") + files[i];
		// nothing to do if we're not minifying ...
		// cross domain files are not supported currently
		if( !this.options.minify.use || !u.isLocal( url ) ){
			output += markup.css( url );
		} else {
			this.files['css'][group].push( url );
		}
	}


	// deal with the group output
	if( this.files['css'][group].length ) {
		var style = ( (this.url) ? this.url : "") + this.options.assetsPath + "css/"+ group + ".min.css"
		output += markup.css( style );
	}

	return output;
};
