'use strict'

import app from 'ampersand-app'
import PouchDB from 'pouchdb'
import './styles/main.styl'
import Router from './router.js'
import actions from './actions.js'
import stores from './stores'

window.app = app // expose 'app' to the browser console
window.PouchDB = PouchDB // enable pouch inspector

app.extend({
  init () {
    this.Actions = actions()
    stores(this.Actions)
    this.router = new Router()
    this.router.history.start()
  }
})

app.init()
