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
import 'expose?$!expose?jQuery!jquery'
import 'bootstrap'
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

// keep old store working for a while
app.extend({
  init() {
    this.Actions = actions()
    stores(this.Actions)
  }
})
app.init()

render(
  <Router />,
  document.getElementById('root')
)

// wait for home.js to do it's job
setTimeout(() => {
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
    .catch(() => {
      // do something
    })
}, 1000)
