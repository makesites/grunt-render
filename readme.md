## Grunt Render

This library was created with the belief that a server is smarter than just delivering static assets and thus can deal with the necessary build process for compiling and delivering a production-ready web application.

From a workflow perspective, this method alleviates from duplication in the codebase repository and relieves developers from running extraneous building processes on their local machines.

The build process is dead, long live the build.


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

Initiated by Makis Tracend ( [@tracend](http://github.com/tracend) )

Distributed through [Makesites.org](http://makesites.org/)

Released under the [MIT license](http://makesites.org/licenses/MIT)
