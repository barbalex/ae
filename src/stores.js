'use strict'

import app from 'ampersand-app'
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

    dsMetadata: {},

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

    getAllItems () {
      let items = {}
      _.forEach(this.items, function (value, key) {
        // _.values(value) is an array of all items
        // const itemsArray = _.values(value)
        // items = items.concat(itemsArray)
        _.assign(items, value)
      })
      return items
    },

    getItemByGuid (guid) {
      return this.getAllItems()[guid]
    },

    getGroupsLoaded () {
      return _.keys(this.items)
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

    getDsMetadata () {
      return this.dsMetadata
    },

    onLoadObjectStore (gruppe) {// trigger change because of loaded state
      this.trigger(this.items, this.hierarchyObject, gruppe)
    },

    onLoadObjectStoreCompleted (gruppe, items, hierarchyObject, dsMetadata) {
      // console.log('stores.js onLoadObjectStoreCompleted: items:', items)
      // console.log('stores.js onLoadObjectStoreCompleted: hierarchyObject:', hierarchyObject)
      // console.log('stores.js onLoadObjectStoreCompleted: gruppe:', gruppe)

      if (items instanceof Array) {
        // loaded all items
        items = _.indexBy(items, '_id')
        this.loaded[gruppe] = true
      }
      this.items[gruppe] = {}
      _.assign(this.items[gruppe], items)
      this.hierarchyObject[gruppe] = {}
      _.assign(this.hierarchyObject[gruppe], hierarchyObject)
      _.assign(this.dsMetadata, _.indexBy(dsMetadata, 'Name'))

      // signal that this group is not being loaded any more
      app.loadingObjectStore = _.without(app.loadingObjectStore, gruppe)
      // tell views that data has changed
      this.trigger(this.items, this.hierarchyObject, gruppe)
    },

    onLoadObjectStoreFailed (error) {
      console.log('objectStore: loading items failed with error: ', error)
    },

    getInitialState () {
      return this.items
    }
  })
}
