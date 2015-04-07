var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var assign = require('lodash.assign');

var bOpts = assign({}, watchify.args, {
  entries: './js/webpage_main.js',
  transform: [reactify]
});
var b = watchify(browserify(bOpts));

gulp.task('default', ['build']);

gulp.task('build', ['build:js', 'build:html', 'build:css']);

gulp.task('build:js', bundle);
b.on('update', bundle);
b.on('log', gutil.log);

gulp.task('build:html', function() {
  return gulp.src('html/*.html').pipe(gulp.dest('dist'));
});

gulp.task('build:css', function() {
  return gulp.src('css/*.css').pipe(gulp.dest('dist/css'));
});

function bundle(){
  return b.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('index.js'))
    .pipe(gulp.dest('dist/js'));
}
