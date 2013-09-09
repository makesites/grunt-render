var _ = require("underscore"),
	path = require('path');

module.exports = {

	toArray: function ( files ){
		// #7 - checking if the files are already in an array
		return ( files instanceof Array ) ? files : files.replace(/ |\t/gi, "").split("\n");
	},

	getFilename: function( path ){
		return path.replace(/^.*[\\\/]/, '');
	},

	getDomain: function( path ){
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
	},

	parseFile: function( string ){
		var script = {};
		// remove any spaces and split at the pipes
		var parts = string.replace(" ", "").split("|");
		// convention:
		// - first is the source file
		// - second is the name
		// - second is the individual dependencies (not implemented)
		var fields = ["src", "name", "deps"];
		// loop through the "results"
		for(var i in parts){
			script[ fields[i] ] = parts[i];
		}
		//
		return script;
	}

}