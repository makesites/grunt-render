
module.exports = {
	
	js : function (url){
		return '<script type="text/javascript" src="'+ url +'"></script>';
	}, 

	css : function (url){
		return '<link href="'+ url +'" media="screen" type="text/css" rel="stylesheet">';
	}, 
	
	less : function (url){
		return '<link href="'+ url +'" media="screen" rel="stylesheet/less">';
	}, 
	
}
