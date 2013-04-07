var _ = require("underscore"),
	path = require("path"),
	markup = require("./markup"),
	util = require("./util");

module.exports = function( options ){
		
	var output = "";
	// put all in the default group if not specified
	var group = options.name || "default"; // replace default by template name? 
	// create group if new
	this.files['js'][group] || ( this.files['js'][group] = { order : (this.order++), files : [] });
	
	// make array from strings
	var files = util.toArray( options.files );
	
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
			output += markup.js( url );
			continue;
		}
		
		var name = util.getFilename( files[i] );
		var domain = util.getDomain( files[i] );
		var host = this.options.hostname;
		//
		// minification
		if( this.options.minify.crossdomain ){
			// just add the script in the group
			this.files['js'][group].files.push( file.src );
		} else {
			if( (domain && domain != host) || name.search(/.min|-min./gi) > -1 ){
				// don't minify
				var script = ( (this.url && !domain) ? this.url : "") + file.src;
				if( !this.options.require.use ){ 
					output += markup.js( script );
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
		
	}
	
	// deal with the group output
	if( this.files['js'][group].files.length ) { 
		
		var script = ( (this.url) ? this.url : "") + this.options.assetsPath + "js/"+ group + ".min.js"
		//if( !this.options.require.use &&  this.options.minify.use ){
		if( !this.options.require.use ){ 
			output += markup.js( script );
		} else {
			// add to require object
			this.rconf.deps( script );
		}
	}
			
	return output;
}
