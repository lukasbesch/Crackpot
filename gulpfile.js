// Initialize all variables
var app, base, concat, directory, gulp, gutil, hostname, HTMLmin, path, refresh, sass, uglify, imagemin, CSSnano, del, browserSync, autoprefixer, gulpSequence, shell, sourceMaps, plumber;

var autoPrefixBrowserList = ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'];

// Load all dependencies
gulp        	= require('gulp');
gutil       	= require('gulp-util');
concat      	= require('gulp-concat');
uglify      	= require('gulp-uglify');
sass        	= require('gulp-sass');
sourceMaps  	= require('gulp-sourcemaps');
imagemin    	= require('gulp-imagemin');
CSSnano   		= require('gulp-cssnano');
browserSync 	= require('browser-sync');
autoprefixer 	= require('gulp-autoprefixer');
gulpSequence 	= require('gulp-sequence').use(gulp);
shell       	= require('gulp-shell');
plumber     	= require('gulp-plumber');
HTMLmin 		= require('gulp-htmlmin');

// Setup browserSync
gulp.task('browserSync', function() {
	browserSync({
	server: {
		baseDir: "app/"
	},
	options: {
		reloadDelay: 250
	},
	browser: "google chrome"
	});
});


//////////// Images

// Compress images & handle SVG files
gulp.task('images', function(tmp) {
	gulp.src(['app/images/*.jpg', 'app/images/*.png'])
		.pipe(plumber())
		.pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
		.pipe(gulp.dest('app/images'));
});

// Compress images & handle SVG files for production
gulp.task('images-deploy', function() {
    gulp.src(['app/images/**/*', '!app/images/README'])
        .pipe(plumber())
        .pipe(gulp.dest('dist/images'));
});


////////// Scripts

// Compile JS plugins
gulp.task('scripts', function() {
    return gulp.src(['app/js/plugins/*.js', 'app/js/plugins/**/*.js'])
		.pipe(plumber())
		.pipe(concat('plugins.js'))
		.on('error', gutil.log)
		.pipe(gulp.dest('app/js'))
		.pipe(browserSync.reload({stream: true}));
});

// Compile JS settings
gulp.task('scripts-settings', function() {
	return gulp.src(['app/js/settings/*.js', 'app/js/settings/**/*.js'])
		.pipe(plumber())
		.pipe(concat('main.js'))
		.on('error', gutil.log)
		.pipe(gulp.dest('app/js'))
		.pipe(browserSync.reload({stream: true}));
});

// Compile and compress JS plugins for deployment
gulp.task('scripts-deploy', function() {
    return gulp.src(['app/js/plugins/*.js', 'app/js/plugins/**/*.js'])
		.pipe(plumber())
		.pipe(concat('plugins.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'));
});

// Compile and compress JS settings for deployment
gulp.task('scripts-settings-deploy', function() {
    return gulp.src(['app/js/settings/**/*.js', 'app/js/settings/**/*.js'])
		.pipe(plumber())
		.pipe(concat('main.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'));
});

// Copy vendor scripts for production
gulp.task('vendor-scripts', function() {
	gulp.src('app/js/vendor/**/*.*')
		.pipe(gulp.dest('dist/js/vendor'));
});


////////// CSS

// Compile SCSS files
gulp.task('styles', function() {
	// The master SCSS file that imports everything
	return gulp.src('app/css/scss/init.scss')
		.pipe(plumber({
	    	errorHandler: function (err) {
			console.log(err);
			this.emit('end');
	    }
	}))
	.pipe(sourceMaps.init())
	.pipe(sass({
		errLogToConsole: true,
		includePaths: [
			'app/css/scss/'
		]
	}))
	.pipe(autoprefixer({
		browsers: autoPrefixBrowserList,
		cascade:  true
	}))
	.on('error', gutil.log)
	.pipe(concat('style.css'))
	.pipe(sourceMaps.write())
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream: true}));
});

//compile SCSS files for deployment
gulp.task('styles-deploy', function() {
	//the initializer / master SCSS file, which will just be a file that imports everything
	return gulp.src('app/css/scss/init.scss')
	.pipe(plumber())
	.pipe(sass({
		includePaths: [
			'app/css/scss',
		]
	}))
	.pipe(autoprefixer({
		browsers: autoPrefixBrowserList,
		cascade:  true
	}))
	.pipe(concat('style.css'))
	.pipe(CSSnano())
	.pipe(gulp.dest('dist/css'));
});


////////// HTML

// Watch all HTML files
gulp.task('html', function() {
	//Watch all HTML files and refresh when something changes
	return gulp.src('app/*.html')
		.pipe(plumber())
		.pipe(browserSync.reload({stream: true}))
		.on('error', gutil.log);
});

// Migrate over all HTML files for deployment
gulp.task('html-deploy', function() {

	// Copy everything but the HTML files, even invisible files
	gulp.src(['app/*', '!app/*.html', 'app/.*', '!app/**/*.html'])
		.pipe(plumber())
		.pipe(gulp.dest('dist'));

	// Copy and compress all HTML Files
	gulp.src(['app/*.html', 'app/**/*.html'])
		.pipe(plumber())
		.pipe(HTMLmin({
			collapseWhitespace: true,
			removeComments: true,
		}))
		.pipe(gulp.dest('dist'));

	// Copy all font files
	gulp.src('app/fonts/**/*')
		.pipe(plumber())
		.pipe(gulp.dest('dist/fonts'));

	// Grab all of the styles
	gulp.src(['app/css/*.css', '!app/css/style.css'])
		.pipe(plumber())
		.pipe(gulp.dest('dist/css'));
});

// Cleans the dist directory in case things got deleted
gulp.task('clean', function() {
	return shell.task([
		'rm -rf dist'
	]);
});

// Create folders using shell
gulp.task('scaffold', function() {
	return shell.task([
		'mkdir dist',
		'mkdir dist/fonts',
		'mkdir dist/images',
		'mkdir dist/js',
		'mkdir dist/css'
	]);
});

// Master Task
// 	Start web server,
//	sync browsers,
//  compress all scripts and SCSS files
gulp.task('default', ['browserSync', 'scripts', 'scripts-settings', 'vendor-scripts', 'styles'], function() {
    //watch all HTML, JS and CSS files and the image folder
    gulp.watch(['app/*.html', 'app/**/*.html'], ['html']);
    gulp.watch('app/css/scss/**', ['styles']);
    gulp.watch(['app/js/*', 'app/js/**/*'], ['scripts', 'scripts-settings']);
    gulp.watch('app/images/**', ['images']);
});

// Production Task
//	Copy everything over and compress where neccessary
gulp.task('production', gulpSequence('clean', 'scaffold', ['scripts-deploy', 'scripts-settings-deploy', 'styles-deploy', 'images-deploy'], 'html-deploy'));
