var template  = require('./index.js');
var gulp = require('gulp');
var path = require('path');

var buildhtmls = function (src, dst) {
	template.helper('formatDate', function (timestamp) {
		return new Date(timestamp).toString();
	})
	var options = {
		data : {
			name : 'gulp-art-template Test Page'
		}
	}
	gulp.src(src,{base:'test/src'}).pipe(template(options)).pipe(gulp.dest(dst));
}

gulp.task('default', function () {
	buildhtmls('test/src/*.html', 'test/dist');
});
