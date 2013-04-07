
## Grunt Render

Grunt tasks initiated on the server side while rendering views


## Features

* Automatically generates markup
* Optionally outputs js as a require.js config object
* Compares existing (minified) files with modified date and md5 signature


## Install

```
npm install grunt-render
```

## Usage 


### Javascript 

You can call 
```
var grunt_render = require('grunt-render')

grunt_render.js({ 
	name : "helpers", 
	files : ["/assets/js/helpers/underscore.js", "/assets/js/helpers/handlebars.js"]
});
```

Alternatively: 

* Using handlebars:  https://gist.github.com/tracend/5330007
```
{{#grunt "js" "helpers"}} 
/assets/js/helpers/underscore.js
/assets/js/helpers/handlebars.js
{{/grunt}} 
```


## Options

* cdn : domain of the cdn 

* views 

* public

* minify : a boolean if the assets will be minified in production


## Methods

* js() : add one or more javascript files

* css() : add one or more stylesheet files

* less() : add one or more less files

* main() : render the final output




