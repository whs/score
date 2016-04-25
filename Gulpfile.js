var gulp = require('gulp');
var webpack = require('webpack-stream');
var webpackModule = require('webpack');
var postcss = require('gulp-postcss');
var cssnano = require('cssnano');
var postcss_import = require('postcss-import');
var postcss_url = require('postcss-url');
var concat = require('gulp-concat');

gulp.task('default', ['copy-frontend', 'copy-backend', 'copy-scoreshare', 'build-frontend-js', 'build-frontend-css']);

gulp.task('copy-frontend', function(){
	return gulp.src([
		'frontend/.htaccess',
		'frontend/**/*',
		'!frontend/js/**/*',
		'!frontend/js',
		'!frontend/css/**/*.css',
	], {
		base: 'frontend',
	})
		.pipe(gulp.dest('dist/'));
});

gulp.task('copy-backend', function(){
	return gulp.src('backend/**/*', {base: 'backend'})
		.pipe(gulp.dest('dist/'));
});

gulp.task('copy-scoreshare', function(){
	return gulp.src([
		'scoreshare/.htaccess',
		'scoreshare/**/*',
	])
		.pipe(gulp.dest('dist/scoreshare/'));
});

gulp.task('build-asmcrypto', function(){
	return gulp.src([
		'node_modules/asmcrypto.js/src/errors.js',
		'node_modules/asmcrypto.js/src/utils.js',
		'node_modules/asmcrypto.js/src/exports.js',
		'node_modules/asmcrypto.js/src/hash/hash.js',
		'node_modules/asmcrypto.js/src/hash/sha1/sha1.asm.js',
		'node_modules/asmcrypto.js/src/hash/sha1/sha1.js',
		'node_modules/asmcrypto.js/src/hash/sha1/exports.js',
	])
		.pipe(concat('asmcrypto.js'))
		.pipe(gulp.dest('dist/js/'));
});

gulp.task('build-frontend-js', ['build-asmcrypto'], function(){
	return gulp.src('frontend/js/app.js')
		.pipe(webpack({
			output: {
				filename: 'app.js',
			},
			plugins: [
				// new webpackModule.optimize.UglifyJsPlugin()
			],
			resolve: {
				alias: {
					asmcrypto: __dirname + '/dist/js/asmcrypto.js'
				}
			}
		}))
		.pipe(gulp.dest('dist/js/'));
});

gulp.task('build-frontend-css', function(){
	return gulp.src('frontend/css/style.css')
        .pipe(postcss([
			postcss_import(),
			postcss_url(),
			cssnano(),
		]))
        .pipe(gulp.dest('dist/css/'));
});
