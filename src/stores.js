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

    guid: null,

    onLoadPathStore (path, guid) {
      this.guid = guid
      this.path = path
      this.trigger(path, guid)
    }
  })

  window.activeObjectStore = Reflux.createStore({
    /*
     * keeps the active object (active = is shown)
     * components can listen to changes in order to update it's data
     */
    listenables: Actions,

    loaded: false,

    item: {},/*

    onLoadActiveObjectStore (item) {
      // pass this on so ui can express it already
      this.trigger(this.item)
    },*/

    onLoadActiveObjectStoreCompleted (item) {
      // item can be an object or {}
      this.item = item
      this.loaded = _.keys(item).length > 0
      // tell views that data has changed
      this.trigger(item)
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

    hierarchy: [],

    loaded: false,

    groupsLoaded () {
      return _.pluck(this.hierarchy, 'Name')
    },

    isGroupLoaded (gruppe) {
      return _.includes(this.groupsLoaded(), gruppe)
    },

    onLoadObjectStore (gruppe) {
      // trigger change so components can set loading state
      const payload = {
        items: this.items,
        hierarchy: this.hierarchy,
        gruppe: gruppe,
        groupsLoaded: this.groupsLoaded(),
        groupLoading: gruppe
      }
      this.trigger(payload)
    },

    onLoadObjectStoreCompleted (payloadReceived) {
      const { gruppe, items, hierarchy } = payloadReceived

      // loaded all items
      this.loaded = true

      // although this should ony happen once, make sure hierarchy is only included once
      this.hierarchy = _.without(this.hierarchy, _.findWhere(this.hierarchy, { 'Name': gruppe }))
      this.hierarchy.push(hierarchy)

      // add path to items - it makes finding an item by path much easier
      _.forEach(items, function (item) {
        addPathToObject(item)
      })

      _.assign(this.items, items)

      // signal that this group is not being loaded any more
      app.loadingObjectStore = _.without(app.loadingObjectStore, gruppe)

      // tell views that data has changed
      const payload = {
        items: this.items,
        hierarchy: this.hierarchy,
        gruppe: gruppe,
        groupsLoaded: this.groupsLoaded(),
        groupLoading: null
      }
      this.trigger(payload)
    },

    onLoadObjectStoreFailed (error) {
      console.log('objectStore: loading items failed with error: ', error)
    }
  })
}
