var _ = require("underscore"),
	path = require("path"),
	util = require("./util");
	
module.exports = function( options ){
	
	var output = "";
	
	// make array from strings
	var files = util.toArray( options.files );
    
	for( var i in files ){
		//
		var domain = util.getDomain( files[i] );
		// filter out empty lines...
		if( _.isEmpty( files[i] ) ) continue;
		output += '<link href="'+ ( (this.url && !domain) ? this.url : "") + files[i] +'" rel="stylesheet" type="text/css"></script>';
	}
	
	return output;
};
