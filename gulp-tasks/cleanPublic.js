'use strict'

const gulp = require('gulp')
const del = require('del')

gulp.task('cleanPublic', (cb) => del(['public'], cb))
