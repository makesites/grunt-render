
module.exports = {

	js : function (url, attrs = {}){
		// fallback(s)
		var type =  attrs.type || "text/javascript";
		return '<script type="'+ type +'" src="'+ url +'"></script>';
	},

	css : function (url, attrs = {}){
		return '<link href="'+ url +'" media="screen" type="text/css" rel="stylesheet">';
	},

	less : function (url, attrs = {}){
		return '<link href="'+ url +'" media="screen" rel="stylesheet/less">';
	},

}
