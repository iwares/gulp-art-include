'use strict';

const template = require('art-template');
const path = require('path');
const fs = require('fs');
const concat = require('concat-stream');
const through = require('through2');
const balanced = require('balanced-match');
const gutil = require('gulp-util');

var exports = function (options) {

	if (typeof options !== 'object')
		options = {};

	const renderAndInclude = function (pathname, content, data) {
		const reStart = /@@include\(/;
		const reArgs = /[^)"\']*["\']([^"\']*)["\'](,\s*({[\s\S]*})){0,1}\s*/;

		content = template.compile(content)(data);

		var basepath = path.dirname(pathname);
		var result = '';

		var matchStart = undefined;
		while (matchStart = reStart.exec(content)) {
			var safeStart = matchStart.index + matchStart[0].length - 1;

			var matchArg = balanced('(', ')', content.slice(safeStart));

			if (matchArg && matchArg.start === 0) {
				var args = reArgs.exec(matchArg.body);
				if (!args)
					throw new Error('Bad @@include expression: @@include(' + matchArg.body + ')');

				var includePath = path.resolve(basepath, args[1]);
				var includeContent = fs.readFileSync(includePath, 'utf-8');
				var includeData = args[3] && JSON.parse(args[3]);

				includeContent = renderAndInclude(includePath, includeContent, includeData);

				var before = content.slice(0, matchStart.index);
				result += before + includeContent;
				content = content.slice(safeStart + matchArg.end + 1);
			} else {
				result += content.slice(0, safeStart);
				content = content.slice(safeStart);
			}
		}

		return result += content;
	};

	const render = function (file, content, data) {
		if (typeof data !== 'object')
			data = {};
		file.contents = new Buffer(renderAndInclude(file.path, content, data));
		return file;
	}

	return through.obj(function (file, enc, callback) {
		if (file.isNull()) {
			callback(null, file);
		} else if (file.isStream()) {
			file.contents.pipe(concat(function(content) {
				try {
					var ret = render(file, String(content), options.data);
					callback(null, ret);
				} catch (e) {
					callback(new gutil.PluginError('gulp-art-template', e.message));
				}
			}));
		} else if (file.isBuffer()) {
			try {
				var ret = render(file, String(file.contents), options.data);
				callback(null, ret);
			} catch (e) {
				callback(new gutil.PluginError('gulp-art-template', e.message));
			}
		}
	});

};

exports.helper = template.helper.bind(template);
exports.config = template.config.bind(template);

module.exports = exports;
