'use strict'

import app from 'ampersand-app'
import Reflux from 'reflux'
import _ from 'lodash'
import addPathToObject from './modules/addPathToObject.js'

export default function (Actions) {
  window.pathStore = Reflux.createStore({
    /*
     * simple store that keeps the path (=url) as an array
     * components can listen to changes in order to update the path
    */
    listenables: Actions,

    path: [],

    onLoadPathStore (path) {
      this.path = path
      this.trigger(path)
    }
  })

  window.activeObjectStore = Reflux.createStore({
    /*
     * keeps the active object (active = is shown)
     * components can listen to changes in order to update it's data
     */
    listenables: Actions,

    loaded: false,

    item: {},

    getItem () {
      return this.item
    },/*

    onLoadActiveObjectStore (item) {
      // pass this on so ui can express it already
      this.trigger(this.item)
    },*/

    onLoadActiveObjectStoreCompleted (item, metaData) {
      // item can be an object or {}
      this.item = item
      this.loaded = _.keys(item).length > 0
      // tell views that data has changed
      this.trigger(item, metaData)
    }
  })

  window.objectStore = Reflux.createStore({
    /* This store caches the requested items in the items property
     * When all the items are loaded,
     * it will set the loaded property to true
     * so that the consuming components
     * will know if a API request is needed
     */
    listenables: Actions,

    items: {},

    // this is an object consisting of
    // _id's as keys
    // and a path array as values
    paths: {},

    hierarchy: [],

    taxMetadata: {},

    loaded: false,

    groupsLoaded: [],

    getItem (guid) {
      return this.items[guid]
    },

    isGroupLoaded (gruppe) {
      return _.includes(this.groupsLoaded, gruppe)
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
        gruppe: gruppe,
        groupsLoaded: this.groupsLoaded
      }
      this.trigger(payload)
    },

    onLoadObjectStoreCompleted (payloadReceived) {
      const { gruppe, items, hierarchy, taxMetadata } = payloadReceived

      // loaded all items
      this.loaded = true
      this.groupsLoaded.push(gruppe)

      this.hierarchy[gruppe] = hierarchy
      _.assign(this.taxMetadata, taxMetadata)

      _.forEach(items, function (item) {
        addPathToObject(item)
      })

      _.assign(this.items, items)

      // calculate paths

      // signal that this group is not being loaded any more
      app.loadingObjectStore = _.without(app.loadingObjectStore, gruppe)
      // tell views that data has changed
      const payload = {
        items: this.items,
        hierarchy: this.hierarchy,
        gruppe: gruppe,
        groupsLoaded: this.groupsLoaded
      }
      // console.log('objectStore loaded, will trigger with payload', payload)
      this.trigger(payload)
    },

    onLoadObjectStoreFailed (error) {
      console.log('objectStore: loading items failed with error: ', error)
    },

    onLoadActiveObjectStoreCompleted (item, metaData) {
      // on first load of the page
      // if an object is directly shown,
      // activeObjectStore fetches metaData
      // (in other cases objectStore fetches it)
      if (metaData) _.assign(this.taxMetadata, metaData)
    }
  })
}
