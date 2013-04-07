var _ = require("underscore"),
	path = require("path"),
	util = require("./util");

module.exports = function( options ){
		
	var output = "";
	// put all in the default group if not specified
	var group = options.name || "default"; // replace default by template name? 
	// create group if new
	this.files['js'][group] || ( this.files['js'][group] = { order : (this.order++), files : [] });
	
	// make array from strings
	var files = util.toArray( options.files );
	
	/*
	// if name is an object it's not valid (?)
	if("type", typeof name != "string"){
		name 
	}
	*/
	
	//if(this.options.require.crossdomain)
	
	// create files only if their signature is different 
	
	// output file(s)

	// direct output
	for( var i in files ){
		// 
		
		// filter out empty lines...
		if( _.isEmpty( files[i] ) ) continue;
		//
		var file = util.parseFile( files[i] );
		
		// nothing to do it we're not minifying or requiring...
		if( !this.options.require.use &&  !this.options.minify.use ){
			var url = ( (this.url) ? this.url : "") + file.src;
			output += template( url );
			continue;
		}
		
		var name = util.getFilename( files[i] );
		var domain = util.getDomain( files[i] );
		var host = this.options.hostname;
		//
		//console.log("================= get DOMAIN ");
		//console.log("crossdomain", this.options.minify.crossdomain);
		//console.log("group", group);
		// minification
		if( this.options.minify.crossdomain ){
			// just add the script in the group
			this.files['js'][group].files.push( file.src );
		} else {
			if( (domain && domain != host) || name.search(/.min|-min./gi) > -1 ){
				// don't minify
				var script = ( (this.url && !domain) ? this.url : "") + file.src;
				if( !this.options.require.use ){ 
					output += template( script );
				} else {
					// add to require object
					if( file.name ){
						var obj = {};
						obj[ file.name ] = script;
						this.rconf.deps( obj );
					} else {
						this.rconf.deps( script );
					}
				}
			} else {
				// add to minify array
				this.files['js'][group].files.push( files[i] );
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
		// deal with the group
		if( this.files['js'][group].files.length ) { 
			
			var script = this.options.assetsPath + "js/"+ group + ".min.js"
			if( !this.options.require.use ){ 
				output += template( script );
			} else {
				// add to require object
				this.rconf.deps( script );
			}
		}
	}
	
	// Output
	if( !this.options.require.use &&  this.options.minify.use ){
		// add group if scripts added to minify
		if( this.files['js'][group].files.length ){ 
			var script = this.options.assetsPath + "js/"+ group + ".min.js";
			var url = ( (this.url) ? this.url : "") + script;
			output += template( url );
		}
		// 
	}
			
	return output;
}

// Helpers
function template(url){
	return '<script type="text/javascript" src="'+ url +'"></script>';
};


