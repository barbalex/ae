'use strict'

import Reflux from 'reflux'
import _ from 'lodash'
import addPathToObject from './modules/addPathToObject.js'
import kickOffStores from './modules/kickOffStores.js'

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
      // only change if something has changed
      if (this.guid !== guid || !_.isEqual(this.path, path)) {
        this.guid = guid
        this.path = path
        this.trigger(path, guid)
      }
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

    onLoadActiveObjectStoreCompleted (item) {
      // only change if something has changed
      if (!_.isEqual(item, this.item)) {
        // item can be an object or {}
        this.item = item
        this.loaded = _.keys(item).length > 0
        // tell views that data has changed
        this.trigger(item)
      }
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

    groupsLoading: [],

    groupsLoaded () {
      return _.pluck(this.hierarchy, 'Name')
    },

    isGroupLoaded (gruppe) {
      return _.includes(this.groupsLoaded(), gruppe)
    },

    onLoadObjectStore (gruppe) {
      // somehow this get's called when clicking a node
      // hm. why?
      // well, sometime this may happen when syncing. But not yet...
      // don't let it happen if group is already loaded
      // because then group stays loading, as the process is never completed...
      if (!this.isGroupLoaded(gruppe)) {
        this.groupsLoading = _.union(this.groupsLoading, [gruppe])
        // trigger change so components can set loading state
        const payload = {
          items: this.items,
          hierarchy: this.hierarchy,
          gruppe: gruppe,
          groupsLoaded: this.groupsLoaded(),
          groupsLoading: this.groupsLoading
        }
        this.trigger(payload)
      }
    },

    onLoadObjectStoreFromPouchCompleted (payloadReceived) {
      const { path, gruppe, guid } = payloadReceived
      // do
      kickOffStores(path, gruppe, guid)
    },

    onLoadObjectStoreFromPouchFailed (error, payloadReceived) {
      const { path, gruppe, guid } = payloadReceived
      kickOffStores(path, gruppe, guid)
      console.log('error loading objectStore from pouch:', error)
    },

    onLoadObjectStoreCompleted (payloadReceived) {
      // const that = this
      const { gruppe, items, hierarchy } = payloadReceived
      console.log('objectStore: finished loading, payload', payloadReceived)

      // although this should ony happen once, make sure hierarchy is only included once
      this.hierarchy = _.without(this.hierarchy, _.findWhere(this.hierarchy, { 'Name': gruppe }))
      this.hierarchy.push(hierarchy)

      // add path to items - it makes finding an item by path much easier
      _.forEach(items, function (item) {
        addPathToObject(item)
      })

      _.assign(this.items, items)

      // loaded all items
      // signal that this group is not being loaded any more
      // const indexOfGruppe = this.groupsLoading.indexOf(gruppe)
      // this.groupsLoading.splice(indexOfGruppe, 1)
      this.groupsLoading = _.without(this.groupsLoading, gruppe)

      // tell views that data has changed
      const payload = {
        items: this.items,
        hierarchy: this.hierarchy,
        gruppe: gruppe,
        groupsLoaded: this.groupsLoaded(),
        groupsLoading: this.groupsLoading
      }
      console.log('objectStore: triggering with payload', payload)
      this.trigger(payload)
    },

    onLoadObjectStoreFailed (error, gruppe) {
      // const indexOfGruppe = this.groupsLoading.indexOf(gruppe)
      // this.groupsLoading.splice(indexOfGruppe, 1)
      this.groupsLoading = _.without(this.groupsLoading, gruppe)
      console.log('objectStore: loading items failed with error: ', error)
    }
  })
}
