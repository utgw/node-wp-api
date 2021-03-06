'use strict';

var autoprefixer = require('gulp-autoprefixer');
var browserify   = require('browserify');
var browserSync  = require('browser-sync').create();
var buffer       = require('vinyl-buffer');
var gulp         = require('gulp');
var plumber      = require('gulp-plumber');
var sass         = require('gulp-sass');
var sourcemaps   = require('gulp-sourcemaps');
var source       = require('vinyl-source-stream');
var uglify       = require('gulp-uglify');
var watch        = require('gulp-watch');
var watchify     = require('watchify');

/**
 * Sass
 */
gulp.task('sass', function () {
  return gulp.src('./assets/_sass/**/*')
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']
    }))
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('./assets/css'))
    .pipe(browserSync.stream());
});

/**
 * Browserify and Watchify
 */
var b = browserify({
  entries: ['./assets/_js/main.js'],
  debug: true
});

function bundle() {
  return b.bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('./assets/js'))
    .pipe(browserSync.stream());
}

gulp.task('browserify', bundle);

gulp.task('watchify', function () {
  b = watchify(b);
  b.on('update', bundle);
});

/**
 * Browsersync
 */
gulp.task('browsersync', function () {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
});

/**
 * Watch
 */
gulp.task('watch', ['watchify'], function () {
  gulp.watch('./assets/_sass/**/*', ['sass']);
  gulp.watch([
    './**/*.html'
  ]).on('change', browserSync.reload);
});

/**
 * Build
 */
gulp.task('build', ['sass', 'browserify']);

/**
 * Default
 */
gulp.task('default', ['sass', 'browserify', 'browsersync', 'watch']);
