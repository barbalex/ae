'use strict'

var gulp = require('gulp'),
  del = require('del')

gulp.task('cleanPublic', function (cb) {
  del(['public'], cb)
})
