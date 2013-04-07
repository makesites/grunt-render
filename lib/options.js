
module.exports = {
	main : "js/main.js",
	cdn : false,
	minify : {
		use : true, 
		recurring : false, 
		crossdomain : false
	}, 
	less : {
		use : false,
		lib : "//cdnjs.cloudflare.com/ajax/libs/less.js/1.3.1/less.min.js"
	},
	require : {
		use : true,
		lib : "//cdnjs.cloudflare.com/ajax/libs/require.js/2.1.4/require.min.js",
		main : "main.js"
	}
};
