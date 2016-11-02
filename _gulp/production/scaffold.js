// ☱☲☴ Scaffold

var gulp            = require('gulp');
var config          = require('../config.json');
var shell           = require('gulp-shell');

// Create folders in dist directory using shell

gulp.task('scaffold', function () {
    return shell.task([
        'cd dist',
        'mkdir ' + config.distDir + 'fonts',
        'mkdir ' + config.distDir + 'images',
        'mkdir ' + config.distDir + 'js',
        'mkdir ' + config.distDir + 'css'
    ]);
});
