
var gulp = require('gulp');
//var uglify = require('gulp-uglify');
//var concat = require('gulp-concat');
var watchLess = require('gulp-watch-less');
var less = require('gulp-less');

/*gulp.task('scripts', function() {
    return gulp.src('src/js/!*.js')
        .pipe(concat('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});*/


gulp.task('less', function(){
    gulp.src('src/less/main.less')
        .pipe(watchLess('src/less/main.less'))
        .pipe(less())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('default', ['less']);