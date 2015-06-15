'use strict'

import Reflux from 'reflux'
import _ from 'lodash'

export default function (Actions) {
  window.faunaStore = Reflux.createStore({
    // This store caches the requested item in the items property
    // When all the items are loaded,
    // it will set the loaded property to true
    // so that the store consumers (e.g. a jsx component)
    // will know if a API request is needed
    listenables: Actions,

    items: {},

    loaded: false,

    // the object component uses this method
    // to get the object
    get (guid) {
      return this.items[guid]
    },

    onLoadFaunaStoreCompleted (items) {
      // console.log('faunaStore: load completed')
      if (items instanceof Array) {
        // loaded all items
        items = _.indexBy(items, '_id')
        this.loaded = true
      }
      _.assign(this.items, items)
      this.trigger(this.items)
    },

    onLoadFaunaStoreFailed (error) {
      console.log('faunaStore: loading items failed with error: ', error)
    },

    getInitialState () {
      return this.items
    },

    // trigger view refresh on any url transition
    /*onTransition () {
      this.trigger(this.item)
    }*/
  })
}
