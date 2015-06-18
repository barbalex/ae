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

    loaded: {
      'Fauna': false,
      'Flora': false,
      'Moose': false,
      'Pilze': false
    },

    // the object component uses this method
    // to get the object
    getItem (gruppe, guid) {
      if (!this.loaded[gruppe] || !this.items || !this.items[gruppe] || !this.items[gruppe][guid]) return {}
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

      // console.log('stores.js onLoadObjectStoreCompleted: items:', items)
      // console.log('stores.js onLoadObjectStoreCompleted: hierarchyObject:', hierarchyObject)
      console.log('stores.js onLoadObjectStoreCompleted: gruppe:', gruppe)

      if (items instanceof Array) {
        // loaded all items
        items = _.indexBy(items, '_id')
        this.loaded[gruppe] = true
      }
      this.items[gruppe] = {}

      // console.log('stores.js onLoadObjectStoreCompleted: this.items[gruppe] before assigning:', this.items[gruppe])

      _.assign(this.items[gruppe], items)

      // console.log('stores.js onLoadObjectStoreCompleted: this.items[gruppe] after assigning:', this.items[gruppe])

      this.hierarchyObject[gruppe] = {}

      // console.log('stores.js onLoadObjectStoreCompleted: this.hierarchyObject[gruppe] before assigning:', this.hierarchyObject[gruppe])

      _.assign(this.hierarchyObject[gruppe], hierarchyObject)

      // console.log('stores.js onLoadObjectStoreCompleted: this.hierarchyObject[gruppe] after assigning:', this.hierarchyObject[gruppe])
      // console.log('stores.js onLoadObjectStoreCompleted: this.items:', this.items)
      // console.log('stores.js onLoadObjectStoreCompleted: this.hierarchyObject:', this.hierarchyObject)

      this.trigger(this.items, this.hierarchyObject)
    },

    onLoadObjectStoreFailed (error) {
      console.log('objectStore: loading items failed with error: ', error)
    },

    getInitialState () {
      return this.items
    }
  })
}
