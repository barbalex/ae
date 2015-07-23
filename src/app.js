'use strict'

import app from 'ampersand-app'
import PouchDB from 'pouchdb'
import pouchdbUpsert from 'pouchdb-upsert'
// make webpack import styles
import './styles/main.styl'
import Router from './router.js'
import actions from './actions.js'
import stores from './stores'
import pouchUrl from './modules/getCouchUrl.js'
import getGroupsLoadedFromLocalGroupsDb from './modules/getGroupsLoadedFromLocalGroupsDb.js'

PouchDB.plugin(pouchdbUpsert)

// expose 'app' to the browser console
window.app = app
// enable pouch inspector
window.PouchDB = PouchDB

app.extend({
  init () {
    const that = this
    PouchDB.utils.Promise.all([
      that.localDb = new PouchDB('ae'),
      that.localHierarchyDb = new PouchDB('aeHierarchy'),
      that.localPathDb = new PouchDB('aePaths'),
      that.localGroupsDb = new PouchDB('aeGroups'),
      that.remoteDb = new PouchDB(pouchUrl())
    ])
    .then(function () {
      // initialte localGroupsDb if necessary
      const groupsDoc = {
        _id: 'groups',
        groupsLoaded: []
      }
      return that.localGroupsDb.putIfNotExists(groupsDoc)
    })
    .then(function () {
      that.Actions = actions()
      stores(that.Actions)
      that.router = new Router()
      that.router.history.start()
    })
    .then(function () {
      return getGroupsLoadedFromLocalGroupsDb()
    })
    .then(function (groupsLoadedInPouch) {
      if (groupsLoadedInPouch.length > 0) that.Actions.loadPouchFromLocal(groupsLoadedInPouch)
    })
    .catch(function (error) {
      console.log('app.js: error initializing app:', error)
    })
  }
})

app.init()
