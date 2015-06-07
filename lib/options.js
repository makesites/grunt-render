
module.exports = {
	main : "js/main.js",
	cdn : false,
	minify : {
		use : true,
		recurring : true, // set to false to only execute once
		crossdomain : false, // defines if scripts in other domains get compiled with the group (or kept intact)
		timeout : 300000, // timeout between each minification (default: 5 min = 300000 millisec)
		mangle: false
	},
	less : {
		use : false,
		lib : "//cdnjs.cloudflare.com/ajax/libs/less.js/2.1.0/less.min.js"
	},
	require : {
		use : true,
		lib : "//cdnjs.cloudflare.com/ajax/libs/require.js/2.1.15/require.min.js",
		main : "main.js",
		min : "app.js", // name of minified file when r.js compiles modules to a single file
		output : true, // boolean: if set to false it will not output the require config on the page - get it manually by calling .require()
		prefix : "", // prefix groups alias
		config: false, // pass an external require config object
		include: false // force the include of modules duting minification
	}
	//verbose: true // set in development mode?
};
