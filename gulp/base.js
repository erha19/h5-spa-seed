/*
 * Copyright (c) 2016, simplefatty
 * Licensed under the MIT License.
 */

'use strict';

let gulp = require('gulp'),
	path = require('path'),
	fs = require('fs'),
	config = require('./config'),
	_ = require('lodash'),
	$ = require('gulp-load-plugins')({
		pattern: ['gulp-*', 'event-stream', 'main-bower-files', 'uglify-save-license', 'del']
	}),
	browserSync = require('browser-sync'),
	gulpsync = $.sync(gulp),
	reload = browserSync.reload;


/**
 * @description 代码质量管理
 */

gulp.task('jshint',['transform_js'], ()=> {
	return gulp.src(path.join(config.paths.src, 'app/**/*.js'))
		.pipe($.plumber(config.errorHandler()))
		.pipe($.jshint({
			esversion: 6
		}))
		.pipe($.jshint.reporter('default'))
		.pipe(reload({
			stream: true
		}))
		.pipe($.size());
});

/**
 * @description 编译之前将scss注入index.scss
 */

gulp.task('transform_js', ()=> {
	return gulp.src([
				path.join(config.paths.src, '/app/**/*.js'),
				path.join(config.paths.src,'/template/*.js')
		])
		.pipe($.babel({
			presets: ['es2015']
		}))
		.pipe(gulp.dest(path.join(config.paths.tmp,'/serve/script')))
});

/**
 * @description 清理DIST,TEMP文件夹
 */

gulp.task('clean', ()=> {
	$.del([path.join(config.paths.dist, '/'), path.join(config.paths.tmp, '/')]);
});

/**
 * @description SASS预编译模块,依赖compass模块编译
 */

gulp.task('styles:sass', ['inject_sass'], ()=> {
	return gulp.src(path.join(config.paths.src, 'app/index.scss'))
		.pipe($.plumber(config.errorHandler()))
		.pipe($.sass())
		.pipe($.autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe($.px3rem({
			baseDpr: 2,             // base device pixel ratio (default: 2)
			threeVersion: false,    // whether to generate @1x, @2x and @3x version (default: false)
			remVersion: true,       // whether to generate rem version (default: true)
			remUnit: 75,            // rem unit value (default: 75)
			remPrecision: 6         // rem precision (default: 6)
		}))
		.pipe(gulp.dest(path.join(config.paths.tmp, '/serve/style/')))
		//css改变时无刷新改变页面
		.pipe(reload({
			stream: true 
		}));
});

/**
 * @description 编译之前将scss注入index.scss
 */

gulp.task('inject_sass', ()=> {
	let injectFiles = gulp.src([
		path.join(config.paths.src, 'app/**/*.scss'),
		path.join('!' + config.paths.src, 'app/index.scss')
	], {
		read: false
	});

	let injectOptions = {
		transform: function(filePath) {
			filePath = filePath.replace(config.paths.src + '/app/', '');
			return '@import "' + filePath + '";';
		},
		starttag: '// injector',
		endtag: '// endinjector',
		addRootSlash: false
	};
	return gulp.src(path.join(config.paths.src, 'app/index.scss'))
		.pipe($.inject(injectFiles, injectOptions))
		.pipe(gulp.dest(path.join(config.paths.src, 'app/')))
});

/**
 * @description Html中的CSS以及JS注入
 */

gulp.task('inject', ['jshint', 'styles:sass', 'vendor:base','template'], ()=> {
	let injectStyles = gulp.src([
		path.join(config.paths.tmp, '/serve/style/**/*.css')
	], {
		read: false
	});

	let injectScripts = gulp.src([
		path.join(config.paths.tmp, '/serve/script/**/*.js'),
		path.join('!'+config.paths.tmp, '/serve/script/index.js')
	]).pipe($.order([
		'templateCache.js',
		'router.js',
		'resource.js',
        '**/*.js'
    ],{base:config.paths.tmp+'/serve/script'}))

	let injectOptions = {
		ignorePath: [config.paths.src, path.join(config.paths.tmp, '/serve')],
		addRootSlash: false
	};

	return gulp.src(path.join(config.paths.src, '/*.html'))
		.pipe($.plumber(config.errorHandler()))
		.pipe($.inject($.eventStream.merge(
			injectStyles,
			injectScripts
		), injectOptions))
		.pipe(gulp.dest(path.join(config.paths.tmp, '/serve')));

});
/**
 * @description 生成html模板
 */
gulp.task('template',()=>{
    return gulp.src([
        path.join(config.paths.src,'**/*.html'),
        '!src/index.html'
    ])
        .pipe($.htmlToJson({
            baseDir:'app',
            overrideDir:'app',
            filename:'templateCache',
            useAsVariable: true
        }))
		//替换模板格式,去除//= *.html
		.pipe($.replace(/\/\/=([\s\S]*)\.html/,''))
		//替换模板中的var语句
		.pipe($.replace(/(var)\s([\S]*)(=)/,'$2:'))
		.pipe($.replace(/}$/,'},'))
		.pipe($.concat(config.modules.filename+'.js'))
		//封闭模版作用域
		.pipe($.wrap('var '+config.modules.templateModuleName+' =(function(){return {<%= contents %>}}());'))
		.pipe(gulp.dest(path.join(config.paths.src,config.modules.dest)))
})

gulp.task('vendor', gulpsync.sync(['vendor:base', 'vendor:app']));


/**
 * @description 复制依赖文件
 */

gulp.task('vendor:base', ()=> {
	let jsFilter = $.filter('**/*.js', {
			restore: true
		}),
		cssFilter = $.filter('**/*.css', {
			restore: true
		});
	return gulp.src(config.vendor.base.source, {
			base: config.paths.bower_path
		})
		.pipe($.expectFile(config.vendor.base.source))
		.pipe(jsFilter)
		.pipe($.concat(config.vendor.base.name + '.js'))
		.pipe(jsFilter.restore)
		.pipe(cssFilter)
		.pipe($.concat(config.vendor.base.name + '.css'))
		.pipe(cssFilter.restore)
		.pipe(gulp.dest(config.vendor.base.dest));
});

gulp.task('vendor:app', ()=> {

	let jsFilter = $.filter('*.js', {
			restore: true
		}),
		cssFilter = $.filter('*.css', {
			restore: true
		});

	return gulp.src(config.vendor.app.source, {
			base: config.paths.bower_path
		})
		.pipe($.expectFile(config.vendor.app.source))
		.pipe(jsFilter)
		.pipe(jsFilter.restore)
		.pipe(cssFilter)
		.pipe(cssFilter.restore)
		.pipe(gulp.dest(config.vendor.app.dest));

});
