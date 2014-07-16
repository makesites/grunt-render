
module.exports = {
	main : "js/main.js",
	cdn : false,
	minify : {
		use : true,
		recurring : true, // set to false to only execute once
		crossdomain : false, // defines if scripts in other domains get compiled with the group (or kept intact)
		timeout : 300000 // timeout between each minification (default: 5 min = 300000 millisec)
	},
	less : {
		use : false,
		lib : "//cdnjs.cloudflare.com/ajax/libs/less.js/1.4.1/less.min.js"
	},
	require : {
		use : true,
		lib : "//cdnjs.cloudflare.com/ajax/libs/require.js/2.1.8/require.min.js",
		main : "main.js",
		output : true // boolean: if set to false it will not output the require config on the page - get it manually by calling .require()
	}
};
