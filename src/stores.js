'use strict'

import app from 'ampersand-app'
import Reflux from 'reflux'
import _ from 'lodash'

export default function (Actions) {
  window.activeObjectStore = Reflux.createStore({
    listenables: Actions,

    loaded: false,

    item: {},

    getItem () {
      return this.item
    },

    onLoadActiveObjectStore (item) {
      // pass this on so ui can express it already
      this.trigger(this.item)
    },

    onLoadActiveObjectStoreCompleted (item) {
      // item can be an object or {}

      console.log('stores.js, activeObjectStore, onLoadActiveObjectStoreCompleted: item', item)

      this.item = item

      console.log('stores.js, activeObjectStore, onLoadActiveObjectStoreCompleted: this.item', this.item)

      this.loaded = _.keys(item).length > 0

      console.log('stores.js, activeObjectStore, onLoadActiveObjectStoreCompleted: this.loaded', this.loaded)

      // tell views that data has changed
      this.trigger(item)

      console.log('stores.js, activeObjectStore, onLoadActiveObjectStoreCompleted: this.triggered item')
    }
  })

  window.objectStore = Reflux.createStore({
    // This store caches the requested item in the items property
    // When all the items are loaded,
    // it will set the loaded property to true
    // so that the store consumers (e.g. a jsx component)
    // will know if a API request is needed
    listenables: Actions,

    items: {},

    hierarchy: {},

    taxMetadata: {},

    loaded: false,

    groupsLoaded: {
      'Fauna': false,
      'Flora': false,
      'Moose': false,
      'Pilze': false
    },

    getItem (guid) {
      return this.items[guid]
    },

    getGroupsLoaded () {
      return this.groupsLoaded
    },

    getItems () {
      return this.items
    },

    getHierarchy () {
      return this.hierarchy
    },

    getTaxMetadata () {
      return this.taxMetadata
    },

    onLoadObjectStore (gruppe) {
      // trigger change so components can set loading state
      const payload = {
        items: this.items,
        hierarchy: this.hierarchy,
        gruppe: gruppe
      }
      this.trigger(payload)
    },

    onLoadObjectStoreCompleted (payloadReceived) {
      const { gruppe, items, hierarchy, taxMetadata } = payloadReceived

      // loaded all items
      this.loaded = true
      this.groupsLoaded[gruppe] = true

      _.assign(this.items, items)
      this.hierarchy[gruppe] = {}
      _.assign(this.hierarchy[gruppe], hierarchy)
      _.assign(this.taxMetadata, taxMetadata)

      // signal that this group is not being loaded any more
      app.loadingObjectStore = _.without(app.loadingObjectStore, gruppe)
      // tell views that data has changed
      const payload = {
        items: this.items,
        hierarchy: this.hierarchy,
        gruppe: gruppe
      }
      this.trigger(payload)  // TODO: IN THIS LINE AN ERROR OCCURS: Uncaught TypeError: Cannot read property 'apply' of undefined
      console.log('objectStore, onLoadActiveObjectStoreCompleted: hola')
    },

    onLoadObjectStoreFailed (error) {
      console.log('objectStore: loading items failed with error: ', error)
    },

    onLoadActiveObjectStoreCompleted (item, metaData) {

      console.log('objectStore, onLoadActiveObjectStoreCompleted: metaData', metaData)

      if (metaData) _.assign(this.taxMetadata, metaData)
    },

    getInitialState () {
      return this.items
    }
  })
}
