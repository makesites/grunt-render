
module.exports = {
	main : "js/main.js",
	minify : {
		crossdomain : false
	}, 
	less : {
		use : false,
		lib : "//cdnjs.cloudflare.com/ajax/libs/less.js/1.3.1/less.min.js"
	},
	require : {
		use : false,
		lib : "//cdnjs.cloudflare.com/ajax/libs/require.js/2.1.4/require.min.js"
	}
};
