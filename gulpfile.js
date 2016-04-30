/*☱☲☴☲☱☲☴☲☱☲☴☲ ॐ ☱☲☴☲☱☲☴☲☱☲☴☲☱☲☴☲

              C R A C K P O T

☱☲☴☲☱☲☴☲☱☲☴☲☱☲☴☲☱☲☴☲☱☲☴☲☱☲☴☲☱☲☴*/


// Project variables

var config        = require('./config.json');

//// Dependencies ////

var gulp        	= require('gulp');

// JS
var jshint        = require('gulp-jshint');
var stylish       = require('jshint-stylish');
var concat      	= require('gulp-concat');
var uglify      	= require('gulp-uglify');

// CSS
var sass        	= require('gulp-sass');
var sourceMaps  	= require('gulp-sourcemaps');
var autoprefixer 	= require('gulp-autoprefixer');
var critical      = require('critical');

// Min
var CSSnano   		= require('gulp-cssnano');
var HTMLmin 		  = require('gulp-htmlmin');
var imagemin    	= require('gulp-imagemin');

// Utilities
var cache         = require('gulp-cache');
var del           = require('del');
var gutil       	= require('gulp-util');
var browserSync 	= require('browser-sync');
var gulpSequence 	= require('gulp-sequence').use(gulp);
var shell       	= require('gulp-shell');
var plumber     	= require('gulp-plumber');
var swank         = require('swank');
var pageSpeed     = require('psi');
var ngrok         = require('ngrok');
var color         = gutil.colors;
var notifier      = require('node-notifier');
var path          = require('path');

// ☱☲☴☲☱☲☴☲☱☲☴☲☱☲☴☲☱☲☴☲☱☲☴☲☱☲☴☲☱☲


// ☱☲☴ Error log

var onError = function(err) {
    console.log(err);
}


// ☱☲☴ Setup browserSync

gulp.task( 'browserSync', function() {
    browserSync.init( {
        //open: true,
		server: {baseDir: config.srcDir},
        options: {
		    reloadDelay: 250
	    },
        browser: "google chrome"
    });
});


// ☱☲☴ Images

// Compress images & handle SVG files
gulp.task('images', function () {
  return gulp.src([config.srcDir + 'images/**/*.{png,jpg,svg}'])
    .pipe(cache(imagemin({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
     })))
    .pipe(gulp.dest(config.srcDir + 'images'))
});

// Copy images for production
gulp.task('images-production', function() {
    gulp.src([config.srcDir + 'images/**/*'])
    .pipe(plumber())
    .pipe(gulp.dest(config.distDir + 'images'));
});


// ☱☲☴ JS

// Compile JS plugins
gulp.task('scripts', function() {
  return gulp.src([
    config.srcDir + 'js/plugins/**/*.js'
  ])
	  .pipe(plumber())
    .pipe(concat('plugins.js'))
    .on('error', gutil.log)
    .pipe(gulp.dest(config.srcDir + 'js'))
    .pipe(browserSync.reload({stream: true}));
});

// Compile JS settings
gulp.task('scripts-settings', function() {
	return gulp.src([
    config.srcDir + 'js/settings/**/*.js'
  ])
	  .pipe(plumber())
	  // Lint JS files and report errors
	  .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(concat('main.js'))
    .on('error', gutil.log)
    .pipe(gulp.dest(config.srcDir + 'js'))
    .pipe(browserSync.reload({stream: true}));
});

// Compile and minimize JS plugins for deployment
gulp.task('scripts-production', function() {
  return gulp.src([
    config.srcDir + 'js/plugins/**/*.js'
  ])
	  .pipe(plumber())
    .pipe(concat('plugins.js'))
    .pipe(uglify())
    .pipe(gulp.dest(config.distDir + 'js'));
});

// Compile and minimize JS settings for deployment
gulp.task('scripts-settings-production', function() {
  return gulp.src([
    config.srcDir + 'js/settings/**/*.js'
  ])
	  .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest(config.distDir + 'js'));
});

// Copy vendor scripts for deployment
gulp.task('vendor-scripts', function() {
  gulp.src(config.srcDir + 'js/vendor/**/*.*')
	  .pipe(gulp.dest(config.distDir + 'js/vendor'));
});


// ☱☲☴ CSS

// Compile SCSS files
gulp.task('styles', function() {
	// The master SCSS file that imports everything
	return gulp.src(config.srcDir + 'css/scss/init.scss')
    .pipe(plumber({
		  errorHandler: function (err) {
        console.log(err);
        this.emit('end');
	    }
	}))
	  .pipe(sourceMaps.init())
    .pipe(sass({
		  errLogToConsole: true,
      includePaths: [config.srcDir + 'css/scss/']
	}))
	  .pipe(autoprefixer(config.browserList))
    .on('error', gutil.log)
    .pipe(concat('style.css'))
    .pipe(sourceMaps.write())
    .pipe(gulp.dest(config.srcDir + 'css'))
    .pipe(browserSync.reload({stream: true}));
});

//compile SCSS files for deployment
gulp.task('styles-production', function() {
	// The master SCSS file that imports everything
	return gulp.src(config.srcDir + 'css/scss/init.scss')
	  .pipe(plumber())
    .pipe(sass({
		  includePaths: [
			config.srcDir + 'css/scss',
		]}))
	.pipe(autoprefixer(config.browserList))
	.pipe(concat('style.css'))
	.pipe(CSSnano({discardComments: {removeAll: true}}))
	.pipe(gulp.dest(config.distDir + 'css'));
});


// ☱☲☴ HTML

// Watch all HTML files

gulp.task('html', function() {
//Watch all HTML files and refresh when something changes
	return gulp.src([config.srcDir + '**/*.html'])
	  .pipe(plumber())
    .pipe(browserSync.reload({stream: true}))
    .on('error', gutil.log);
});


// Migrate over all HTML files for deployment
gulp.task('html-production', function() {
	// Copy everything, even invisible files but …
	// … do not copy the JS plugins & settings and the SASS files
	gulp.src([
	  config.srcDir + '*',
	  config.srcDir + '**/*',
	  config.srcDir + '.*',
      '!' + config.srcDir + '**/*.html',
      '!' + config.srcDir + '{js/plugins,js/plugins/**}',
      '!' + config.srcDir + '{js/*.js,js/settings,js/settings/**}',
      '!' + config.srcDir + '{css,css/**/*}'
    ])
    .pipe(plumber())
    .pipe(gulp.dest(config.distDir));

// Copy and minimize all HTML Files
	gulp.src([config.srcDir + '**/*.html'])
	  .pipe(plumber())
    .pipe(HTMLmin({
      collapseWhitespace: true,
      removeComments: true,
	  }))
    .pipe(gulp.dest(config.distDir));

// Grab all font files
	gulp.src(config.srcDir + 'fonts/**/*')
		.pipe(plumber())
		.pipe(gulp.dest(config.distDir + 'fonts'));

// Grab all styles
	gulp.src([config.srcDir + 'css/*.css', '!' + config.srcDir + 'css/style.css'])
		.pipe(plumber())
		.pipe(gulp.dest(config.distDir + 'css'));
});

// Clean the dist directory
gulp.task('clean', function () {
  return del([config.distDir + '*', config.distDir + '.*', config.distDir + '*/**']);
});

// Create folders in dist directory using shell
gulp.task('scaffold', function() {
	return shell.task([
    'cd dist',
		'mkdir dist/fonts',
		'mkdir dist/images',
		'mkdir dist/js',
		'mkdir dist/css'
	]);
});


// ☱☲☴ Critical task
// Insert render blocking CSS in index.html inline
gulp.task('critical', function (cb) {
  return critical.generate({
    inline: true,
    base: 'dist/',
    src: 'index.html',
    dest: 'dist/index.html',
    minify: true,
    width: 320,
    height: 480
  });
});


// ☱☲☴ Pagespeed Insights

// Serve dist folder with swank on port 8000
gulp.task('serve', function(cb){
  swank({
    watch: false,
    path: 'dist',
    log: false
  })
  .then(function(s){
    console.log('Server running: '+s.url);
    cb();
  });
});

// -----------------------------------------------------------------------------
// Performance test: PageSpeed Insights
//
// Initializes a public tunnel so the PageSpeed service can access your local
// site, then it tests the site. This task outputs the standard PageSpeed results.
//
// The task will output a standard exit code based on the result of the PSI test
// results. 0 is success and any other number is a failure. To learn more about
// bash-compatible exit status codes read this page:
//
// http://tldp.org/LDP/abs/html/exit-status.html
// -----------------------------------------------------------------------------

// PageSpeed task for desktop score
gulp.task('psi-desktop', function() {
  // Set up a public tunnel so PageSpeed can see the local site.
  return ngrok.connect(8000, function (err_ngrok, url) {
    console.log(color.blue('ngrok'), '- serving your site from', color.black.bgBlue(url));
    // Run PageSpeed once the tunnel is up.
    pageSpeed.output(url, {
      strategy: ['desktop'],
      threshold: 80
    }, function (err_psi, data) {
      // Log any potential errors and return a FAILURE.
      if (err_psi) {
        log(err_psi);
        process.exit(1);
      }
      // Kill the ngrok tunnel and return SUCCESS.
      process.exit(0);
    });
  });
});

// PageSpeed task for mobile score
gulp.task('psi-mobile', function() {
  // Set up a public tunnel so PageSpeed can see the local site.
  return ngrok.connect(8000, function (err_ngrok, url) {
    console.log(color.blue('ngrok'), '- serving your site from', color.black.bgBlue(url));
    // Run PageSpeed once the tunnel is up.
    pageSpeed.output(url, {
      strategy: ['mobile'],
      threshold: 80
    }, function (err_psi, data) {
      // Log any potential errors and return a FAILURE.
      if (err_psi) {
        log(err_psi);
        process.exit(1);
      }
      // Kill the ngrok tunnel and return SUCCESS.
      process.exit(0);
    });
  });
});


// ☱☲☴ The watcher

gulp.task('watch', function() {
  //watch all HTML, JS and CSS files and the image folder
//   gulp.watch([config.srcDir + '**/*.html', config.srcDir + '**/*.php'], browserSync.reload);
 gulp.watch([config.srcDir + '**/*.html', config.srcDir + '**/*.php'], ['html'], browserSync.reload);
// This always reports changes in multiple files wtf?
  gulp.watch(config.srcDir + 'css/scss/**', ['styles']);
  gulp.watch(config.srcDir + 'js/plugins/**/*', ['scripts']);
  gulp.watch(config.srcDir + 'js/settings/**/*', ['scripts-settings']);
  gulp.watch([config.srcDir + 'images/**/*.{png,jpg,gif,svg}'], ['images']);
});


// ☱☲☴☲☱☲☴ Gulp tasks ☱☲☴☲☱☲☴

// ☱☲☴ Spark Master Task
// Start web server,
// sync browsers,
// compress all images,
// concat all scripts and SCSS files
gulp.task('default', gulpSequence('scripts', 'scripts-settings', 'vendor-scripts', 'styles', 'images', ['browserSync', 'watch']));


// gulp.task('production', gulpSequence('clean', 'scaffold', ['scripts-production', 'scripts-settings-production', 'styles-production', 'images-production', 'html-production'], 'critical'));

// ☱☲☴ Production Task
// Clean dist folder
// Minimize all the things and copy them over
// Insert render blocking CSS inline
// Notify when finished
gulp.task('production', function (cb) {
  gulpSequence('clean', 'scaffold', ['scripts-production', 'scripts-settings-production', 'styles-production', 'images-production', 'html-production'], 'critical')(cb);
});

gulp.task('build', ['production'], function () {
  return gulp.src('gulpfile.js')
    .pipe(notifier.notify({
      title: 'Crackpot',
      subtitle: 'Site built in',
      message: config.distURL,
      open: config.distURL,
      icon: path.join(__dirname, 'app/images/favicon/favicon.png')
    }))
    .on('end', function(){ gutil.log('Done!'); });
});


// ☱☲☴ Page Speed Insights Task
// Start ngrok server
// Run PSI on tunnel URL
gulp.task('mobile', gulpSequence('serve', 'psi-mobile'));
gulp.task('desktop', gulpSequence('serve', 'psi-desktop'));
