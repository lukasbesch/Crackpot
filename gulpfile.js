/*☱☲☴☲☱☲☴☲☱☲☴☲ ॐ ☱☲☴☲☱☲☴☲☱☲☴☲☱☲☴☲

              C R A C K P O T

☱☲☴☲☱☲☴☲☱☲☴☲☱☲☴☲☱☲☴☲☱☲☴☲☱☲☴☲☱☲☴☲*/


// Project variables

var projectURL      = 'http://localhost:3000';
var distURL         = 'http://localhost:8888/_Frameworks/Crackpot/dist/';
var liveURL         = 'http://wwww.example.com';
var srcDir          = './app/';
var distDir         = './dist/';

//
// Dependencies
//

var gulp        	= require('gulp');

// JS
var concat      	= require('gulp-concat');
var uglify      	= require('gulp-uglify');

// CSS
var sass        	= require('gulp-sass');
var sourceMaps  	= require('gulp-sourcemaps');
var autoprefixer 	= require('gulp-autoprefixer');

var autoPrefixBrowserList = [
    'last 2 version',
    '> 1%',
    'ie >= 9',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 5',
    'opera >= 23',
    'ios >= 6',
    'android >= 4',
    'bb >= 10'
  ];

// Min
var CSSnano   		= require('gulp-cssnano');
var HTMLmin 		= require('gulp-htmlmin');
var imagemin    	= require('gulp-imagemin');

// Utilities
var gutil       	= require('gulp-util');
var browserSync 	= require('browser-sync');
var gulpSequence 	= require('gulp-sequence').use(gulp);
var shell       	= require('gulp-shell');
var plumber     	= require('gulp-plumber');
var swank           = require('swank');
var pageSpeed       = require('psi');
var ngrok           = require('ngrok');
var c               = gutil.colors;

// ☱☲☴☲☱☲☴☲☱☲☴☲☱☲☴☲☱☲☴☲☱☲☴☲☱☲☴☲☱☲☴☲

// ☱☲☴ Setup browserSync
gulp.task( 'browserSync', function() {
    browserSync.init( {
        //open: true,
		server: {baseDir: srcDir},
        options: {
		    reloadDelay: 250
	    },
        browser: "google chrome"
    });
});


// ☱☲☴ Images ☱☲☴

// Compress images & handle SVG files
gulp.task('images', function(tmp) {
	gulp.src([srcDir + 'images/*.jpg', srcDir + 'images/*.png'])
		.pipe(plumber())
		.pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
		.pipe(gulp.dest(srcDir + 'images'));
});

// Compress images & handle SVG files for production
gulp.task('images-deploy', function() {
    gulp.src([srcDir + 'images/**/*'])
        .pipe(plumber())
        .pipe(gulp.dest(distDir + 'images'));
});


// ☱☲☴ JS ☱☲☴

// Compile JS plugins
gulp.task('scripts', function() {
    return gulp.src([srcDir + 'js/plugins/*.js', srcDir + 'js/plugins/**/*.js'])
		.pipe(plumber())
		.pipe(concat('plugins.js'))
		.on('error', gutil.log)
		.pipe(gulp.dest(srcDir + 'js'))
		.pipe(browserSync.reload({stream: true}));
});

// Compile JS settings
gulp.task('scripts-settings', function() {
	return gulp.src([srcDir + 'js/settings/*.js', srcDir + 'js/settings/**/*.js'])
		.pipe(plumber())
		.pipe(concat('main.js'))
		.on('error', gutil.log)
		.pipe(gulp.dest(srcDir + 'js'))
		.pipe(browserSync.reload({stream: true}));
});

// Compile and compress JS plugins for deployment
gulp.task('scripts-deploy', function() {
    return gulp.src([srcDir + 'js/plugins/*.js', srcDir + 'js/plugins/**/*.js'])
		.pipe(plumber())
		.pipe(concat('plugins.js'))
		.pipe(uglify())
		.pipe(gulp.dest(distDir + 'js'));
});

// Compile and compress JS settings for deployment
gulp.task('scripts-settings-deploy', function() {
    return gulp.src([srcDir + 'js/settings/**/*.js', srcDir + 'js/settings/**/*.js'])
		.pipe(plumber())
		.pipe(concat('main.js'))
		.pipe(uglify())
		.pipe(gulp.dest(distDir + 'js'));
});

// Copy vendor scripts for production
gulp.task('vendor-scripts', function() {
	gulp.src(srcDir + 'js/vendor/**/*.*')
		.pipe(gulp.dest(distDir + 'js/vendor'));
});


// ☱☲☴ CSS ☱☲☴

// Compile SCSS files
gulp.task('styles', function() {
	// The master SCSS file that imports everything
	return gulp.src(srcDir + 'scss/init.scss')
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
			srcDir + 'css/scss/'
		]
	}))
	.pipe(autoprefixer({
		browsers: autoPrefixBrowserList,
		cascade:  true
	}))
	.on('error', gutil.log)
	.pipe(concat('style.css'))
	.pipe(sourceMaps.write())
	.pipe(gulp.dest(srcDir + 'css'))
	.pipe(browserSync.reload({stream: true}));
});

//compile SCSS files for deployment
gulp.task('styles-deploy', function() {
	//the initializer / master SCSS file, which will just be a file that imports everything
	return gulp.src(srcDir + 'css/scss/init.scss')
	.pipe(plumber())
	.pipe(sass({
		includePaths: [
			srcDir + 'css/scss',
		]
	}))
	.pipe(autoprefixer({
		browsers: autoPrefixBrowserList,
		cascade:  true
	}))
	.pipe(concat('style.css'))
	.pipe(CSSnano({discardComments: {removeAll: true}}))
	.pipe(gulp.dest(distDir + 'css'));
});


// ☱☲☴ HTML ☱☲☴

// Watch all HTML files
gulp.task('html', function() {
	//Watch all HTML files and refresh when something changes
	return gulp.src(srcDir + '*.html')
		.pipe(plumber())
		.pipe(browserSync.reload({stream: true}))
		.on('error', gutil.log);
});

// Migrate over all HTML files for deployment
gulp.task('html-deploy', function() {

	// Copy everything but the HTML files, even invisible files
	gulp.src([srcDir + '*', '!' + srcDir + '*.html', srcDir + '.*', '!' + srcDir + '**/*.html'])
		.pipe(plumber())
		.pipe(gulp.dest(distDir));

	// Copy and compress all HTML Files
	gulp.src([srcDir + '*.html', srcDir + '**/*.html', srcDir + '*.php', srcDir + '**/*.php'])
		.pipe(plumber())
		.pipe(HTMLmin({
			collapseWhitespace: true,
			removeComments: true,
		}))
		.pipe(gulp.dest(distDir));

	// Copy all font files
	gulp.src(srcDir + 'fonts/**/*')
		.pipe(plumber())
		.pipe(gulp.dest(distDir + 'fonts'));

	// Grab all of the styles
	gulp.src([srcDir + 'css/*.css', '!' + srcDir + 'css/style.css'])
		.pipe(plumber())
		.pipe(gulp.dest(distDir + 'css'));
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


// ☱☲☴ Pagespeed Insights ☱☲☴

// Serve dist folder with swank
gulp.task('serve', function(cb){
  swank({
    watch: false,
    path: 'dist',
    log: false
  }).then(function(s){
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
gulp.task('pagespeed', function() {
  // Set up a public tunnel so PageSpeed can see the local site.
  return ngrok.connect(8000, function (err_ngrok, url) {
    console.log(c.cyan('ngrok'), '- serving your site from', c.yellow(url));

    // Run PageSpeed once the tunnel is up.
    pageSpeed.output(url, {
      strategy: ['mobile', 'desktop'],
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

// ☱☲☴ Gulp tasks ☱☲☴

// Master Task
// 	Start web server,
//	sync browsers,
//  compress all scripts and SCSS files
gulp.task('default', ['browserSync', 'scripts', 'scripts-settings', 'vendor-scripts', 'styles'], function() {
    //watch all HTML, JS and CSS files and the image folder
    gulp.watch([srcDir + '*.html', srcDir + '**/*.html', srcDir + '*.php', srcDir + '**/*.php'], ['html']);
    gulp.watch(srcDir + 'css/scss/**', ['styles']);
    gulp.watch([srcDir + 'js/*', srcDir + 'js/**/*'], ['scripts', 'scripts-settings']);
    gulp.watch(srcDir + 'images/**', ['images']);
});

// Production Task
//	Copy everything over and compress where neccessary
gulp.task('production', gulpSequence('clean', 'scaffold', ['scripts-deploy', 'scripts-settings-deploy', 'styles-deploy', 'images-deploy'], 'html-deploy'));


// Page Speed Insights Task
//  Start ngrok server
//  Run PSI on tunnel URL
gulp.task('psi', gulpSequence('serve', 'pagespeed'));

