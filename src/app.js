'use strict'

import app from 'ampersand-app'
import './styles/main.styl'
import Router from './router.js'
import actions from './actions.js'
import stores from './stores'

window.app = app // expose app to the browser console

app.extend({
  init () {
    this.Actions = actions()
    stores(this.Actions)
    Router()
  }
})

app.init()
