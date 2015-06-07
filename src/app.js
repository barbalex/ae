'use strict'

import app from 'ampersand-app'
import './styles/main.styl'
import Router from './router.js'
import Actions from './actions'

window.app = app // expose app to the browser console

app.extend({
  init () {
    this.router = new Router()
    this.Actions = Actions()
  }
})

app.init()
