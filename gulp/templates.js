'use strict';

var gulp = require('gulp');

var gulpTemplateCache = require('gulp-angular-templatecache');

gulp.task('templates', function () {
  return gulp.src('./src/templates/**/*.html')
      .pipe(gulpTemplateCache({
          module: 'irontec.simpleChat'
      }))
      .pipe(gulp.dest('./src/scripts'));
});