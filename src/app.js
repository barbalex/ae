'use strict'

import app from 'ampersand-app'
import PouchDB from 'pouchdb'
import './styles/main.styl'
import Router from './router.js'
import actions from './actions.js'
import stores from './stores'
import pouchUrl from './modules/getCouchUrl.js'

window.app = app // expose 'app' to the browser console
window.PouchDB = PouchDB // enable pouch inspector

app.extend({
  init () {
    this.Actions = actions()
    stores(this.Actions)
    this.router = new Router()
    this.router.history.start()
    this.localDb = new PouchDB('ae', function (error) {
      if (error) return console.log('error initializing local pouch ae:', error)
    })
    this.localHierarchyDb = new PouchDB('aeHierarchy', function (error) {
      if (error) return console.log('error initializing local pouch aeHierarchy:', error)
    })
    this.localPathDb = new PouchDB('aePaths', function (error) {
      if (error) return console.log('error initializing local pouch aePaths:', error)
    })
    this.remoteDb = new PouchDB(pouchUrl(), function (error) {
      if (error) return console.log('error initializing remote couch:', error)
    })
  }
})

app.init()
