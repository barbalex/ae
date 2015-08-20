'use strict'

// import needed dependencies (more will be imported by dependant modules)
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
// enable pouch inspector (https://chrome.google.com/webstore/detail/pouchdb-inspector/hbhhpaojmpfimakffndmpmpndcmonkfa)
window.PouchDB = PouchDB
// set up pouchdb plugins
PouchDB.plugin(require('pouchdb-authentication'))

// instead of creating a global like window.app,
// ampersand-app is used and extended
app.extend({
  init () {
    const that = this
    // pouchdb keeps setting a lot of listeners which makes broswers show warnings in the console
    // up the number of listeners to reduce the number of console warnings
    PouchDB.setMaxListeners(80)
    // set up all the used databases
    // in chrome these can be looked at using pouch inspector
    Promise.all([
      that.localDb = new PouchDB('ae'),
      that.localHierarchyDb = new PouchDB('aeHierarchy'),
      that.localPathDb = new PouchDB('aePaths'),
      that.localGroupsDb = new PouchDB('aeGroups'),
      that.localFilterOptionsDb = new PouchDB('aeFilterOptions'),
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
      // initiate login data if necessary
      return that.localDb.putIfNotExists({
        _id: '_local/login',
        logIn: false,
        email: null
      })
    })
    .then(function () {
      // initiate actions, stores and router
      that.Actions = actions()
      stores(that.Actions)
      that.router = new Router()
      that.router.history.start()
      // check if groups have previously been loaded in pouchdb
      return getGroupsLoadedFromLocalGroupsDb()
    })
    .then(function (groupsLoadedInPouch) {
      // if so, load them
      if (groupsLoadedInPouch.length > 0) that.Actions.loadPouchFromLocal(groupsLoadedInPouch)
    })
    .catch(function (error) {
      console.log('app.js: error initializing app:', error)
    })
  }
})

// o.k., get moving
app.init()
