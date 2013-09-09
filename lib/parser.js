var Js = require("./script"),
	Css = require("./css"),
	Less = require("./less");

var Parser = function( type, parent ){
	var self = this;
	this.parent = parent;

	switch( type ){
		case "js":
			this.compiler = Js;
		break;
		case "css":
			this.compiler = Css;
		break;
		case "less":
			this.compiler = Less;
		break;

	}

	return function( options ){
		var output;
		// call compiler with the right context
		output = self.compiler.call( self.parent, options);
		//
		return output;
	};
};


module.exports = Parser;

