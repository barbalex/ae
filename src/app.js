'use strict'

// import needed dependencies (more will be imported by dependant modules)
import app from 'ampersand-app'
import PouchDB from 'pouchdb'
import pouchdbUpsert from 'pouchdb-upsert'
import pouchdbAuthentication from 'pouchdb-authentication'
// make webpack import styles
import './styles/main.styl'
import Router from './router.js'
import actions from './actions.js'
import stores from './stores'
import pouchUrl from './modules/getCouchUrl.js'
import getGroupsLoadedFromLocalGroupsDb from './modules/getGroupsLoadedFromLocalGroupsDb.js'

// set up pouchdb plugins
PouchDB.plugin(pouchdbUpsert)
PouchDB.plugin(pouchdbAuthentication)

// expose 'app' to the browser console
// this is handy to call actions and stores in the browser console
window.app = app
// enable pouch inspector (https://chrome.google.com/webstore/detail/pouchdb-inspector/hbhhpaojmpfimakffndmpmpndcmonkfa)
window.PouchDB = PouchDB

// ampersand-app is extended with app methods (=singleton)
// modules that need an app method import ampersand-app instead of using a global
app.extend({
  init () {
    const that = this
    // pouchdb keeps setting a lot of listeners which makes browsers show warnings in the console
    // up the number of listeners to reduce the number of console warnings
    PouchDB.setMaxListeners(80)
    // set up all the needed databases in parallel
    // in chrome these can be looked at using pouch inspector (https://chrome.google.com/webstore/detail/pouchdb-inspector/hbhhpaojmpfimakffndmpmpndcmonkfa)
    Promise.all([
      that.localDb = new PouchDB('ae'),
      that.localHierarchyDb = new PouchDB('aeHierarchy'),
      that.localPathDb = new PouchDB('aePaths'),
      that.localGroupsDb = new PouchDB('aeGroups'),
      that.localFilterOptionsDb = new PouchDB('aeFilterOptions'),
      that.remoteDb = new PouchDB(pouchUrl())
    ])
    .then(function () {
      // initiate localGroupsDb if necessary
      // putIfNotExists is a method added by pouchdbUpsert
      const groupsDoc = {
        _id: 'groups',
        groupsLoaded: []
      }
      return that.localGroupsDb.putIfNotExists(groupsDoc)
    })
    .then(function () {
      // initiate login data if necessary
      // by adding a local document to pouch
      // local documents are not replicated
      return that.localDb.putIfNotExists({
        _id: '_local/login',
        logIn: false,
        email: null
      })
    })
    .then(function () {
      // initiate actions, stores and router
      // extend app with them so they can be called in modules
      // and accessed in the browser console
      that.Actions = actions()
      stores(that.Actions)
      that.router = new Router()
      that.router.history.start()
      // check if groups have previously been loaded in pouchdb
      return getGroupsLoadedFromLocalGroupsDb()
    })
    .then(function (groupsLoadedInPouch) {
      // if so, load them
      if (groupsLoadedInPouch.length > 0) {
        that.Actions.loadPouchFromLocal(groupsLoadedInPouch)
        that.Actions.showGroupLoading({
          group: groupsLoadedInPouch[0],
          finishedLoading: true
        })
      }
    })
    .catch(function (error) {
      console.log('app.js: error initializing app:', error)
    })
  }
})

// o.k., everything necessary is prepared
// now lauch the app
app.init()
