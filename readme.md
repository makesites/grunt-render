## Grunt Render

Grunt tasks initiated on the server side while rendering views


## Features

* Automatically generates markup
* Optionally outputs js as a require.js config object
* Compares existing files with modified date and md5 signature (soon)


## Install

```
npm install grunt-render
```

## Usage 

Grunt render uses the same api as the regular grunt tasks, only it executes them on the server side as needed. 
### Javascript 

You can call the methods directly any time: 

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

* main : the location of the initializing script

* cdn : domain of the cdn 

* less : options related to the less minification

* require : options related to require.js

* minify : options related with the miinfication process


## Methods

* js() : add one or more javascript files

* css() : add one or more stylesheet files

* less() : add one or more less files

* main() : render the final output


## Credits

Created by Makis Tracend ( [@tracend](http://github.com/tracend) )

Distributed through [Makesites.org](http://makesites.org/)

Released under the [MIT license](http://makesites.org/licenses/MIT)
