'use strict'

import Reflux from 'reflux'
import _ from 'lodash'

export default function (Actions) {
  window.objectStore = Reflux.createStore({
    // This store caches the requested item in the items property
    // When all the items are loaded,
    // it will set the loaded property to true
    // so that the store consumers (e.g. a jsx component)
    // will know if a API request is needed
    listenables: Actions,

    items: {},

    hierarchyObject: {},

    loaded: false,

    // the object component uses this method
    // to get the object
    getItem (gruppe, guid) {
      return this.items[gruppe][guid]
    },

    getItems () {
      return this.items
    },

    getItemsOfGruppe (gruppe) {
      return this.items[gruppe]
    },

    getHierarchy () {
      return this.hierarchyObject
    },

    getHierarchyOfGruppe (gruppe) {
      return this.hierarchyObject[gruppe]
    },

    onLoadObjectStoreCompleted (items, hierarchyObject, gruppe) {

      // console.log('stores objectStore onLoadObjectStoreCompleted: gruppe:', gruppe)
      // console.log('stores objectStore onLoadObjectStoreCompleted: items:', items)
      // console.log('stores objectStore onLoadObjectStoreCompleted: hierarchyObject:', hierarchyObject)

      // console.log('objectStore: load completed')
      if (items instanceof Array) {
        // loaded all items
        items = _.indexBy(items, '_id')
        this.loaded = true
      }
      this.items[gruppe] = {}
      _.assign(this.items[gruppe], items)
      console.log('stores objectStore onLoadObjectStoreCompleted: this.items', this.items)
      this.hierarchyObject[gruppe] = {}
      _.assign(this.hierarchyObject[gruppe], hierarchyObject)
      console.log('stores objectStore onLoadObjectStoreCompleted: this.hierarchyObject', this.hierarchyObject)
      this.trigger(this.items)
    },

    onLoadObjectStoreFailed (error) {
      console.log('objectStore: loading items failed with error: ', error)
    },

    getInitialState () {
      return this.items
    }
  })
}
