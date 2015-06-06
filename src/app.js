'use strict'

import app from 'ampersand-app'
import './styles/main.styl'
import Router from './router.js'

window.app = app // expose app to the browser console

app.extend({
  init () {
    this.router = new Router()
  }
})

app.init()
