// ☱☲☴ Images

var gulp            = require('gulp');
var config          = require('../config.json');
var cache           = require('gulp-cache');
var imagemin        = require('gulp-imagemin');

// Compress images & handle SVG files

gulp.task('images', function () {
    return gulp.src([config.srcDir + 'images/**/*.{png,jpg,svg}'])
        .pipe(cache(imagemin({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest(config.distDir + 'images')
        );
});
