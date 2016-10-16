var gulp        	= require('gulp');
var gulpSequence  = require('gulp-sequence').use(gulp);

var gutil       	= require('gulp-util');
var color         = gutil.colors;
var ngrok         = require('ngrok');
var pageSpeed     = require('psi');
var swank         = require('swank');

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


// ☱☲☴ Page Speed Insights Task
// Start ngrok server
// Run PSI on tunnel URL
gulp.task('psi-mobile', gulpSequence('serve', 'psi-mobile'));
gulp.task('psi-desktop', gulpSequence('serve', 'psi-desktop'));
