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
  //gulp.watch('src/**/*.js', ['lint']);
  gulp.watch([
    './index.html',
    './src/**/*.js'
  ]).on('change', $.livereload.changed);
});
