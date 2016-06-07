'use strict'

/**
 * import needed dependencies (more will be imported by dependant modules)
 */
import app from 'ampersand-app'
import React from 'react'
import { render } from 'react-dom'
import Router from './router.js'
import actions from './actions.js'
import stores from './stores'
import getGroupsLoadedFromLocalDb from './modules/getGroupsLoadedFromLocalDb.js'
import kickOffStores from './modules/kickOffStores.js'
import replaceProblematicPathCharactersFromArray from './modules/replaceProblematicPathCharactersFromArray.js'
import extractInfoFromPath from './modules/extractInfoFromPath.js'
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
 * expose 'app' to the browser console
 * this is handy to call actions and stores in the browser console
 */
window.app = app

/**
 * ampersand-app is extended with app methods (=singleton)
 * modules that need an app method import ampersand-app instead of using a global
 */
app.extend({
  init() {
    // get meaningful messages when errors occur in design docs
    // this.localDb.on('error', function (err) { debugger })

    /**
     * initiate actions, stores and router
     * extend app with them so they can be called in modules
     * and accessed in the browser console
     */
    this.Actions = actions()
    stores(this.Actions)
    render(
      <Router />,
      document.getElementById('root')
    )
    app.userStore.getLogin()
    // read data from url
    // need to remove first / or there will be a first path element of null
    let path = window.location.pathname.replace('/', '').split('/')
    path = replaceProblematicPathCharactersFromArray(path)
    const search = window.location.search
    const {
      path: pathArray,
      gruppe,
      guid
    } = extractInfoFromPath(path, search)
    kickOffStores(pathArray, gruppe, guid)
    // check if groups have previously been loaded in pouchdb
    getGroupsLoadedFromLocalDb()
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
