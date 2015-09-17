'use strict'

// import needed dependencies (more will be imported by dependant modules)
import app from 'ampersand-app'
import PouchDB from 'pouchdb'
import pouchdbUpsert from 'pouchdb-upsert'
import pouchdbAuthentication from 'pouchdb-authentication'
import Router from './router.js'
import actions from './actions.js'
import stores from './stores'
import pouchUrl from './modules/getCouchUrl.js'
import getGroupsLoadedFromLocalGroupsDb from './modules/getGroupsLoadedFromLocalGroupsDb.js'
// make webpack import styles
import './styles/main.styl'
// this lib can not be imported directly - need to load it as a global using https://github.com/webpack/script-loader
import 'script!../node_modules/xlsx/dist/xlsx.core.min.js'
// make webpack import server.js
import 'file?name=server.js!../server.js'

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
    // pouchdb keeps setting a lot of listeners which makes browsers show warnings in the console
    // up the number of listeners to reduce the number of console warnings
    PouchDB.setMaxListeners(80)
    // set up all the needed databases in parallel
    // in chrome these can be looked at using pouch inspector (https://chrome.google.com/webstore/detail/pouchdb-inspector/hbhhpaojmpfimakffndmpmpndcmonkfa)
    Promise.all([
      this.localDb = new PouchDB('ae'),
      this.localHierarchyDb = new PouchDB('aeHierarchy'),
      this.localPathDb = new PouchDB('aePaths'),
      this.localGroupsDb = new PouchDB('aeGroups'),
      this.localFilterOptionsDb = new PouchDB('aeFilterOptions'),
      this.remoteDb = new PouchDB(pouchUrl())
    ])
    // get meaningful messages when errors occur in design docs
    // this.localDb.on('error', function (err) { debugger })
    // initiate localGroupsDb if necessary
    // putIfNotExists is a method added by pouchdbUpsert
    .then(() => this.localGroupsDb.putIfNotExists({
        _id: 'groups',
        groupsLoaded: []
      })
    )
    // initiate login data if necessary
    // by adding a local document to pouch
    // local documents are not replicated
    .then(() => this.localDb.putIfNotExists({
        _id: '_local/login',
        logIn: false,
        email: null
      })
    )
    // initiate pcs data if necessary
    .then(() => this.localDb.putIfNotExists({
        _id: '_local/pcs',
        pcs: []
      })
    )
    // initiate rcs data if necessary
    .then(() => this.localDb.putIfNotExists({
        _id: '_local/rcs',
        rcs: []
      })
    )
    // initiate fields data if necessary
    .then(() => this.localDb.putIfNotExists({
        _id: '_local/fields',
        fields: []
      })
    )
    .then(() => {
      // initiate actions, stores and router
      // extend app with them so they can be called in modules
      // and accessed in the browser console
      this.Actions = actions()
      stores(this.Actions)
      this.router = new Router()
      this.router.history.start()
      // check if groups have previously been loaded in pouchdb
      return getGroupsLoadedFromLocalGroupsDb()
    })
    .then((groupsLoadedInPouch) => {
      // if so, load them
      if (groupsLoadedInPouch.length > 0) {
        this.Actions.loadPouchFromLocal(groupsLoadedInPouch)
        this.Actions.showGroupLoading({
          group: groupsLoadedInPouch[0],
          finishedLoading: true
        })
      }
    })
    .catch((error) => app.Actions.showError({title: 'app.js: error initializing app:', msg: error}))
  }
})

// o.k., everything necessary is prepared
// now lauch the app
app.init()
