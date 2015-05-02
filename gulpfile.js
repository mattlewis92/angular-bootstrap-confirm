var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var open = require('open');

gulp.task('server', function() {
  $.connect.server({
    root: ['./'],
    port: 8000,
    livereload: false
  });

  open('http://localhost:8000');
});

gulp.task('watch', ['server'], function() {
  $.livereload.listen();
  //gulp.start('test:watch');
  gulp.watch('src/angular-bootstrap-confirm.js', ['lint']);
  gulp.watch([
    './index.html',
    './src/**/*.js'
  ]).on('change', $.livereload.changed);
});

function lint(failOnError) {
  var stream = gulp.src('src/angular-bootstrap-confirm.js')
    .pipe($.eslint())
    .pipe($.eslint.format());

  if (failOnError) {
    return stream.pipe($.eslint.failOnError());
  } else {
    return stream;
  }
}

gulp.task('lint', function() {
  return lint();
});

gulp.task('ci:lint', function() {
  return lint(true);
});

gulp.task('ci', ['ci:lint']);
