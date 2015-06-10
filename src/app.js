'use strict'

import app from 'ampersand-app'
import './styles/main.styl'
import Router from './router.js'
import actions from './actions.js'
import faunaCollectionStore from './stores'

window.app = app // expose app to the browser console

app.extend({
  init () {
    this.router = new Router()
    this.Actions = actions()
    faunaCollectionStore(this.Actions)
    // console.log('app.js: this.Actions:', this.Actions)
    // this.Stores = stores(this.Actions)
  }
})

app.init()
