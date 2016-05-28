'use strict'

/**
 * import needed dependencies (more will be imported by dependant modules)
 */
import app from 'ampersand-app'
import PouchDB from 'pouchdb'
import pouchdbUpsert from 'pouchdb-upsert'
import pouchdbAuthentication from 'pouchdb-authentication'
import Router from './router.js'
import actions from './actions.js'
import stores from './stores'
import pouchUrl from './modules/getCouchUrl.js'
import pouchBaseUrl from './modules/getCouchBaseUrl.js'
import getGroupsLoadedFromLocalDb from './modules/getGroupsLoadedFromLocalDb.js'
/**
 * need this polyfill to transform promise.all
 * without it IE11 and lower bark
 */
import 'babel-polyfill'
/**
 * need this polyfill to use fetch in IE
 * https://github.com/github/fetch
 * http://caniuse.com/#feat=promises
 */
import 'es6-promise'
// make webpack import styles
import './styles/main.styl'
// make webpack import server.js
import 'file?name=server.js!../server.js'
// this lib can not be imported directly - need to load it as a global using https://github.com/webpack/script-loader
import 'script!../node_modules/xlsx/dist/xlsx.core.min.js'
// load favicon
require('file?name=favicon.ico!../favicon.ico')

/**
 * set up pouchdb plugins
 */
PouchDB.plugin(pouchdbUpsert)
PouchDB.plugin(pouchdbAuthentication)

/**
 * expose 'app' to the browser console
 * this is handy to call actions and stores in the browser console
 */
window.app = app
/**
 * enable pouch inspector in chrome
 * (https://chrome.google.com/webstore/detail/pouchdb-inspector/hbhhpaojmpfimakffndmpmpndcmonkfa)
 */
window.PouchDB = PouchDB

/**
 * get path to remote _users db
 */
const remoteDbUrl = pouchUrl()
const remoteDumpsDbUrl = `${pouchBaseUrl()}ae_dumps`
const remoteUsersDbUrl = remoteDbUrl
  .replace('/ae', '/_users')
  .replace('/artendb', '/_users')

/**
 * ampersand-app is extended with app methods (=singleton)
 * modules that need an app method import ampersand-app instead of using a global
 */
app.extend({
  init() {
    /**
     * pouchdb keeps setting a lot of listeners which makes browsers show warnings in the console
     * up the number of listeners to reduce the number of console warnings
     */
    PouchDB.setMaxListeners(80)
    /**
     * set up all the needed databases in parallel
     * in chrome these can be looked at using pouch inspector
     * (https://chrome.google.com/webstore/detail/pouchdb-inspector/hbhhpaojmpfimakffndmpmpndcmonkfa)
     */
    Promise.all([
      this.localDb = new PouchDB('ae'),
      this.remoteDb = new PouchDB(pouchUrl()),
      this.remoteUsersDb = new PouchDB(remoteUsersDbUrl),
      this.remoteDumpsDb = new PouchDB(remoteDumpsDbUrl)
    ])
    .then(() => Promise.all([
      /**
       * initiate groupsLoaded if necessary
       * putIfNotExists is a method added by pouchdbUpsert
       */
      this.localDb.putIfNotExists({
        _id: '_local/groupsLoaded',
        groupsLoaded: []
      }),
      /**
       * initiate hierarchy if necessary
       */
      this.localDb.putIfNotExists({
        _id: '_local/hierarchy',
        hierarchy: []
      }),
      /**
       * initiate paths if necessary
       */
      this.localDb.putIfNotExists({
        _id: '_local/paths',
        paths: {}
      }),
      /**
       * initiate filterOptions if necessary
       */
      this.localDb.putIfNotExists({
        _id: '_local/filterOptions',
        filterOptions: []
      }),
      /**
       * initiate login data if necessary
       * by adding a local document to pouch
       * local documents are not replicated
       */
      this.localDb.putIfNotExists({
        _id: '_local/login',
        logIn: false,
        email: null
      }),
      // initiate tcs data if necessary
      this.localDb.putIfNotExists({
        _id: '_local/tcs',
        tcs: []
      }),
      // initiate pcs data if necessary
      this.localDb.putIfNotExists({
        _id: '_local/pcs',
        pcs: []
      }),
      // initiate rcs data if necessary
      this.localDb.putIfNotExists({
        _id: '_local/rcs',
        rcs: []
      }),
      // initiate fields data if necessary
      this.localDb.putIfNotExists({
        _id: '_local/fields',
        fields: []
      })
    ]))
    .then(() => {
      // get meaningful messages when errors occur in design docs
      // this.localDb.on('error', function (err) { debugger })

      /**
       * initiate actions, stores and router
       * extend app with them so they can be called in modules
       * and accessed in the browser console
       */
      this.Actions = actions()
      stores(this.Actions)
      this.router = new Router()
      this.router.history.start()
      // check if groups have previously been loaded in pouchdb
      return getGroupsLoadedFromLocalDb()
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
    .catch((error) =>
      app.Actions.showError({
        title: 'app.js: error initializing app:',
        msg: error
      })
    )
  }
})

/**
 * o.k., everything necessary is prepared
 * now lauch the app
 */
app.init()
