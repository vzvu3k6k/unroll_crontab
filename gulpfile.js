var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var reactify = require('reactify');

gulp.task('default', ['build']);

gulp.task('build', ['build:js', 'build:html', 'build:css']);

gulp.task('build:js', function() {
  return browserify({
    entries: './js/webpage_main.js',
    transform: [reactify]
  }).bundle()
    .pipe(source('index.js'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('build:html', function() {
  return gulp.src('html/*.html').pipe(gulp.dest('dist'));
});

gulp.task('build:css', function() {
  return gulp.src('css/*.css').pipe(gulp.dest('dist/css'));
});
