'use strict'

import app from 'ampersand-app'
import PouchDB from 'pouchdb'
// make webpack import styles
import './styles/main.styl'
import Router from './router.js'
import actions from './actions.js'
import stores from './stores'
import pouchUrl from './modules/getCouchUrl.js'

// expose 'app' to the browser console
window.app = app
// enable pouch inspector
window.PouchDB = PouchDB

app.extend({
  init () {
    const that = this
    this.Actions = actions()
    stores(this.Actions)
    this.router = new Router()
    this.router.history.start()
    PouchDB.utils.Promise.all([
      that.localDb = new PouchDB('ae'),
      that.localHierarchyDb = new PouchDB('aeHierarchy'),
      that.localPathDb = new PouchDB('aePaths'),
      that.remoteDb = new PouchDB(pouchUrl())
    ])
    .catch(function (error) {
      console.log('error initializing pouches:', error)
    })
  }
})

app.init()
