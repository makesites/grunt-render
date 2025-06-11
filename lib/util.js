var _ = require("underscore"),
	fs = require('fs'),
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
	},

	// deep extend
	OLDextend: function() {
		var objects = Array.prototype.slice.apply( arguments );
		var destination = objects.shift();
		for (var i in objects){
			var source = objects[i];
			for (var property in source) {
				if (source[property] && source[property].constructor &&
				 source[property].constructor === Object) {
					destination[property] = destination[property] || {};
					arguments.callee(destination[property], source[property]);
				} else {
					destination[property] = source[property];
				}
			}
		}
		return destination;
	},

	// deep extend
	extend: function(target, ...sources) {
		sources.forEach(source => {
			Object.keys(source).forEach(key => {
				const s_val = source[key]
				const t_val = target[key]
				target[key] = (t_val && s_val && typeof t_val === 'object' && typeof s_val === 'object')
					? this.extend(t_val, s_val)
					: s_val
			})
		});
		return target;
	},


	// compares a file against a list of dependencies to check if there are updates
	hasUpdates: function(master, deps){
		var update = false;
		var last = fs.statSync(master).mtime.getTime();
		// assume deps are in an array
		for( var i in deps ){
			var file = deps[i];
			// skip files that are not on the server
			if( !this.isLocal( file ) ) continue;
			var modified = fs.statSync(file).mtime.getTime();
			if( modified > last ) update = true;
		}
		return update;
	},

	// checks if a file is local
	isLocal: function( file ){
		return !( file.substr(0, 2 ) == "//" || file.substr(0, 4 ) == "http" );
	}

}
