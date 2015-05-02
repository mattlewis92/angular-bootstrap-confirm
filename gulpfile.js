var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var open = require('open');
var bowerFiles = require('main-bower-files');
var series = require('stream-series');
var runSequence = require('run-sequence');

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
  gulp.start('test:watch');
  gulp.watch('src/angular-bootstrap-confirm.js', ['lint']);
  gulp.watch([
    './index.html',
    './src/**/*.js'
  ]).on('change', $.livereload.changed);
});

gulp.task('build', function() {
  //TODO
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

function runTests(action, onDistCode) {
  var vendorJs = gulp.src(bowerFiles({includeDev: true})).pipe($.filter('*.js'));
  if (onDistCode) {
    var appJs = gulp.src('dist/*.js').pipe($.angularFilesort());
  } else {
    var appJs = gulp.src('src/*.js').pipe($.angularFilesort());
  }
  var test = gulp.src('test/*.js');

  return series(vendorJs, appJs, test)
    .pipe($.karma({
      configFile: 'karma.conf.js',
      action: action
    }));
}

gulp.task('test:src', function() {
  return runTests('run').on('error', function(err) {
    throw err;
  });
});

gulp.task('test:dist', function() {
  return runTests('run', true).on('error', function(err) {
    throw err;
  });
});

gulp.task('test:watch', function() {
  return runTests('watch');
});

gulp.task('ci', function(done) {
  runSequence('ci:lint', 'build', 'test:dist', done);
});

