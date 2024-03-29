var gulp = require('gulp');
var webpack = require('webpack-stream');
var webpackModule = require('webpack');
var postcss = require('gulp-postcss');
var cssnano = require('cssnano');
var postcss_import = require('postcss-import');
var postcss_url = require('postcss-url');
var concat = require('gulp-concat');
var preprocess = require('gulp-preprocess');
var file = require('gulp-file');
try{
	var config = require('./config.json');
}catch(e){
	console.warn('Config file cannot be loaded. Copy config.json.def to config.json');
}

gulp.task('default', [
	'frontend', 'backend', 'scoreshare',
]);

gulp.task('frontend', [
	'copy-frontend',
	'build-html', 'build-frontend-js', 'build-frontend-css',
]);

gulp.task('backend', [
	'copy-backend',
	'build-config', 'build-backend-css'
]);

gulp.task('scoreshare', [
	'copy-scoreshare',
]);

var frontendList = [
	'frontend/.htaccess',
	'frontend/**/*',
	'!frontend/index.html',
	'!frontend/js/**/*',
	'!frontend/js',
	'!frontend/css/**/*.css',
];
gulp.task('copy-frontend', function(){
	return gulp.src(frontendList, {
		base: 'frontend',
	})
		.pipe(gulp.dest('dist/'));
});

var backendList = [
	'backend/**/*',
	'!backend/config.php',
	'!backend/css/**/*',
];
gulp.task('copy-backend', function(){
	return gulp.src(backendList, {base: 'backend'})
		.pipe(gulp.dest('dist/'));
});

var scoreshareList = [
	'scoreshare/.htaccess',
	'scoreshare/**/*',
];
gulp.task('copy-scoreshare', function(){
	return gulp.src(scoreshareList)
		.pipe(gulp.dest('dist/scoreshare/'));
});

gulp.task('build-html', function(){
	return gulp.src('frontend/index.html', {base: 'frontend'})
		.pipe(preprocess({context: config}))
		.pipe(gulp.dest('dist/'));
});

gulp.task('build-config', function(){
	return gulp.src('backend/config.php', {base: 'backend'})
		.pipe(preprocess({context: config}))
		.pipe(gulp.dest('dist/'));
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
	var webpackConfig = {
		output: {
			filename: 'app.js',
		},
		plugins: [
			new webpackModule.optimize.UglifyJsPlugin()
		],
		resolve: {
			alias: {
				asmcrypto: __dirname + '/dist/js/asmcrypto.js'
			}
		},
	};

	if(config.useCdn){
		webpackConfig.externals = {
			jquery: 'jQuery',
			'jquery-ui/dialog': 'jQuery',
			'jquery-ui/button': 'jQuery',
			'jquery-ui/effect-clip': 'jQuery',
			'jquery-ui/mouse': 'jQuery',
			'./chart.js': 'Chart',
		};
	}

	return gulp.src('frontend/js/app.js')
		.pipe(webpack(webpackConfig))
		.pipe(gulp.dest('dist/js/'));
});


gulp.task('build-frontend-css', function(){
	return gulp.src('frontend/css/style.css')
		.pipe(preprocess({context: config}))
        .pipe(postcss([
			postcss_import(),
			postcss_url(),
			cssnano(),
		]))
        .pipe(gulp.dest('dist/css/'));
});

gulp.task('build-backend-css', function(){
	return gulp.src('backend/css/backend.css')
		.pipe(preprocess({context: config}))
        .pipe(postcss([
			postcss_import(),
			postcss_url(),
			cssnano(),
		]))
        .pipe(gulp.dest('dist/css/'));
});

gulp.task('generate-config', function(){
	var crypto = require('crypto');
	var key = crypto.randomBytes(64).toString('base64');
	var config = {
		system: process.env['SYSTEM'] || 'ระบบประกาศผลคะแนนสอบ',
		branding: process.env['BRANDING'] || 'กำหนดค่า BRANDING',
		password: process.env['PASSWORD'] || '',
		encryptionKey: key,
		useCdn: process.env['USE_CDN'] != 'false',
		nyanCat: process.env['NYANCAT'] != 'false',
		logoUrl: process.env['LOGO_URL'] || 'img/logo.gif',
	};
	return file('config.json', JSON.stringify(config), {src: true})
		.pipe(gulp.dest('.'));
});

gulp.task('watch', function(){
	gulp.watch(frontendList, ['copy-frontend']);
	gulp.watch(backendList, ['copy-backend']);
	gulp.watch(scoreshareList, ['copy-scoreshare']);
	gulp.watch('frontend/index.html', ['build-html']);
	gulp.watch('backend/config.php', ['build-config']);
	gulp.watch('frontend/js/**/*.js', ['build-frontend-js']);
	gulp.watch('frontend/css/**/*.css', ['build-frontend-css']);
	gulp.watch('backend/css/**/*.css', ['build-backend-css']);
});
