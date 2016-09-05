/*
 * Copyright (c) 2016, kuiwu
 * Licensed under the MIT License.
 */
'use strict';

let gulp = require('gulp'),
	path = require('path'),
	config = require('./config'),
	_ = require('lodash'),
	$ = require('gulp-load-plugins')({
		pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del', 'imagemin-pngquant','imagemin-jpegtran']
	});
gulp.task('clean:dist', ()=> {
	$.del([path.join(config.paths.dist, '/')]);
});


/**
 * @description Html,Js,Css压缩合并
 */
gulp.task('html', ['inject'], ()=> {
	let htmlFilter = $.filter('*.html', {
		restore: true
	});
	let jsFilter = $.filter('**/*.js', {
		restore: true
	});
	let cssFilter = $.filter('**/*.css', {
		restore: true
	});

	return gulp.src(path.join(config.paths.tmp, '/serve/*.html'))
		//error 
		.pipe($.plumber(config.errorHandler()))
		//js
		.pipe($.useref())
		.pipe(jsFilter)
		.pipe($.stripDebug())
		.pipe($.uglify())
		.pipe(jsFilter.restore)
		//css
		.pipe(cssFilter)
		.pipe($.autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe($.csso())
		.pipe(cssFilter.restore)
		//html处理
		.pipe(htmlFilter)
		.pipe($.minifyHtml({
			empty: true,
			spare: true,
			quotes: true,
			conditionals: true
		}))
		.pipe(htmlFilter.restore)
        .pipe(gulp.dest(path.join(config.paths.dist, '/')))
        .pipe($.size({
			title: path.join(config.paths.dist, '/'),
			showFiles: true
		}));

});



/**
 * @description 图片压缩
 */
gulp.task('images', ()=> {
	return gulp.src([
			path.join(config.paths.src, 'app/assets/*.{png,jpg}'),
		])
		.pipe($.imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
				use: [$.imageminPngquant()]
		}))
		.pipe(gulp.dest(path.join(config.paths.dist, '/assets')));
});

gulp.task('fonts', ()=> {

	return gulp.src(config.vendor.base.source, {
			base: config.paths.bower_path
		})
		.pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
		.pipe($.flatten())
		.pipe(gulp.dest(path.join(config.paths.dist, '/fonts/')));
});

/**
 * @description [复制文件] 前端依赖库以及静态文件
 */
gulp.task('other:vendor', ()=> {
	return gulp.src([
			path.join(config.paths.src, '/vendor/**/*')
		])
		.pipe($.filter(file=> {
			return file.stat.isFile();
		}))
		.pipe(gulp.dest(path.join(config.paths.dist, '/vendor')));
});
gulp.task('other:assets', ()=> {
	return gulp.src([
			path.join(config.paths.src, '/app/assets/**/*')
		])
		.pipe($.filter(file=> {
			return file.stat.isFile();
		}))
		.pipe(gulp.dest(path.join(config.paths.dist, '/assets')));
});


gulp.task('build', $.sequence(['clean:dist', 'html']));
