// require('time-require');
var gulp        = require('gulp'),
    connect     = require('gulp-connect');

var watch = require('gulp-watch');

/*
 * Files and Folders
 */

var destinationDir  = 'build',
    sourceDir       = 'src',
    jadeFiles       = sourceDir + '/**/*.jade',
    cssFiles        = sourceDir + '/_css/*.css',
    jsFiles         = sourceDir + '/_js/**/*js',
    assetFiles      = sourceDir + '/_assets/**/*'

/*
 * Helper Tasks.
 *
 * To be used by other tasks,
 * not neccessarily to be used on cli.
 */

/*
 * Jade Tasks
 */

gulp.task('jade', function() {
  var jade = require('gulp-jade');
  return gulp.src([jadeFiles, '!src/_templates/**/*.jade'])
    .pipe(jade({
      'pretty': true
    }))
    .pipe(gulp.dest(destinationDir))
    .pipe(connect.reload());
});

/*
 * CSS Tasks
 */

gulp.task('css:project', function(){
  var myth  = require('gulp-myth');
  gulp.src(cssFiles)
    .pipe(myth())
    .pipe(gulp.dest(destinationDir + '/_css'))
    .pipe(connect.reload());
});

gulp.task('css:vendor', function(){
  return gulp.src('src/_css/vendor/**/*')
    .pipe(gulp.dest(destinationDir + '/_css/vendor'))
    .pipe(connect.reload());
})

gulp.task('css', ['css:project', 'css:vendor']);

/*
 * JavaScript Tasks
 */

gulp.task('js', function(){
  return gulp.src(jsFiles)
    .pipe(gulp.dest(destinationDir + '/_js'))
    .pipe(connect.reload());
});

/*
 * Asset Tasks
 */

gulp.task('assets', function(){
  return gulp.src(assetFiles)
    .pipe(gulp.dest(destinationDir + '/_assets'))
    .pipe(connect.reload());
});

/*
 * Connect Task (Server with LiveReload)
 */

gulp.task('connect', function() {
  connect.server({
      root: destinationDir,
      livereload: true
    });
});

/*
 * CLI Tasks.
 * Those are the tasks to be used.
 */

gulp.task('default', ['jade', 'css', 'js', 'assets']);

gulp.task('watch', ['connect'], function(){

  // Use gulp-watch to rebuild jade files
  // on a per-file basis.
  // takes too long to rebuid all.
  var watch = require('gulp-watch');
  var jade = require('gulp-jade');
  gulp.src([jadeFiles, '!src/_templates/**/*.jade'])
    .pipe(watch(jadeFiles, {name: 'Jade'}))
    .pipe(jade({
      'pretty': true
    }))
    .pipe(gulp.dest(destinationDir))
    .pipe(connect.reload());

  // Use gulp.watch for everything else.
  gulp.watch(['src/_css/**/*.css','!src/_css/vendor/**/*.css'], ['css:project']);
  gulp.watch('src/_css/vendor/**/*.css', ['css:vendor']);
  gulp.watch(jsFiles, ['js']);
  gulp.watch(assetFiles, ['assets']);
});

gulp.task('styleguide', function() {

  var zebra = require('gulp-zebrakss'),
    concat = require('gulp-concat'),
    myth  = require('gulp-myth');

  gulp.src(cssFiles)
  .pipe(myth())
  .pipe(zebra({
    kssOptions: {
      markdown: true
    },
    styleFile: 'style.css',
    overview: __dirname + '/src/_css/styleguide.md',
    brand: 'Style'
  }))
  .pipe(gulp.dest('styleguide'));

  gulp.src(cssFiles)
  .pipe(myth())
  .pipe(concat('style.css'))
  .pipe(gulp.dest('styleguide'));

});

gulp.task('deploy', function () {
  var sftp = require('gulp-sftp');
  return gulp.src('build/**/*')
      .pipe(sftp({
          host: 'yourHost',
          remotePath: 'path/if/required',
          auth: 'key' 
      }));
});
