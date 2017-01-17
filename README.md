[![NPM version][npm-img]][npm-url]
[![Build status][travis-img]][travis-url]
[![License][license-img]][license-url]

# gulp-art-include

A gulp plugin for [artTemplate](https://github.com/aui/artTemplate).

## Install

```bash
$ npm install gulp-art-include
```

## Basic Usage

Template file:

```HTML
<!-- demo.html -->
<div>{{foo}}</div>
```

Gulpfile:

```JavaScript
var template  = require('gulp-art-include');
var gulp = require('gulp');

gulp.task('default', function () {
	gulp.src("demo.html")
		.pipe(template({
			data : {
				"foo" : "bar"
			}
		}))
		.pipe(gulp.dest('dist'));
});
```

Output:

```HTML
<!-- demo.html -->
<div>bar</div>
```

## @@include Expression

Template files:

```HTML
<!-- main.html -->
<h1>Hello Fruits</h1>
@@include('fruits.html', {
	"message" : "Which fruit do you like?",
	"fruits" : [
		"Apple",
		"Banana",
		"Cherry"
	]
})
```

```HTML
<!-- fruits.html -->
<p>{{message}}</p>
<ul>
	{{each fruits as fruit}}
	<li>{{fruit}}</li>
	{{/each}}
</ul>
```

Gulpfile:

```JavaScript
var template  = require('gulp-art-include');
var gulp = require('gulp');

gulp.task('default', function () {
	gulp.src("main.html")
		.pipe(template())
		.pipe(gulp.dest('dist'));
});
```

Output:

```HTML
<!-- main.html -->
<h1>Hello Fruits</h1>
<!-- fruits.html -->
<p>Which fruit do you like?</p>
<ul>
	<li>Apple</li>
	<li>Banana</li>
	<li>Cherry</li>
</ul>
```

## @@escape Expression

Template files:

```HTML
<!-- main.html -->
@@include('template.html', {
	"message" : "Hello!",
})
```

```HTML
<!-- template.html -->
<script id="unescaped" type="text/html">
	<h1>{{message}}</h1>
</script>

@@escape([
<script id="escaped" type="text/html">
	<h1>{{message}}</h1>
</script>
])
```

Gulpfile:

```JavaScript
var template  = require('gulp-art-include');
var gulp = require('gulp');

gulp.task('default', function () {
	gulp.src("main.html")
		.pipe(template())
		.pipe(gulp.dest('dist'));
});
```

Output:

```HTML
<!-- main.html -->
<!-- template.html -->
<script type="text/html">
	<h1>Hello!</h1>
</script>

<script type="text/html">
	<h1>{{message}}</h1>
</script>
```

## License

MIT

[npm-img]: https://img.shields.io/npm/v/gulp-art-include.svg?style=flat-square
[npm-url]: https://npmjs.org/package/gulp-art-include
[travis-img]: https://img.shields.io/travis/iwares/gulp-art-include.svg?style=flat-square
[travis-url]: https://travis-ci.org/iwares/gulp-art-include
[license-img]: http://img.shields.io/badge/license-MIT-green.svg?style=flat-square
[license-url]: http://opensource.org/licenses/MIT
