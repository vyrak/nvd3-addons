var gulp = require('gulp');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var uglify = require('gulp-uglify');
var wrap = require('gulp-wrap');

gulp.task('clean', function() {
  return gulp.src('build/*')
    .pipe(clean());
});

gulp.task('concat-js', function() {
  return gulp.src('src/**/*.js')
    .pipe(concat('nvd3-addons.js'))
    .pipe(wrap('(function(){\n\'use strict\';\n\n<%= contents %>\n})();'))
    .pipe(gulp.dest('build'));
});

gulp.task('uglify-js', ['concat-js'], function() {
  return gulp.src('build/*.js')
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify('build'))
    .pipe(gulp.dest('build'));
});

gulp.task('build-js', function() {
  return runSequence(['concat-js', 'uglify-js']);
});

gulp.task('concat-css', function() {
  return gulp.src('src/css/**/*.css')
    .pipe(concat('nvd3-addons.css'))
    .pipe(gulp.dest('build'));
});

gulp.task('build-css', ['concat-css']);

gulp.task('build', ['build-js', 'build-css']);

gulp.task('default', function() {
return runSequence(['clean', 'build']);
});
