'use strict'

import app from 'ampersand-app'
import Reflux from 'reflux'
import _ from 'lodash'
import addPathToObject from './modules/addPathToObject.js'
import buildHierarchy from './modules/buildHierarchy.js'

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

    pouchLoaded: false,

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
          groupsLoading: []
        }
        this.trigger(payload)
      }
    },

    onLoadPouchCompleted () {
      console.log('objectStore, onLoadPouchCompleted')
      const that = this
      this.pouchLoaded = true
      // get all docs from pouch
      // an error occurs - and it is too cpu intensive
      app.localDb.allDocs({include_docs: true})
        .then(function (result) {
          console.log('objectStore, onLoadPouchCompleted: allDocs fetched')
          // extract objects from result
          const itemsArray = result.rows.map(function (row) {
            return row.doc
          })
          console.log('objectStore, onLoadPouchCompleted, itemsArray.length:', itemsArray.length)
          const hierarchy = buildHierarchy(itemsArray)
          console.log('objectStore, onLoadPouchCompleted, hierarchy:', hierarchy)
          //   convert items-array to object with keys made of id's
          const items = _.indexBy(itemsArray, '_id')
          // add path to items - it makes finding an item by path much easier
          _.forEach(items, function (item) {
            addPathToObject(item)
          })

          that.items = items
          that.hierarchy = hierarchy
          // that.hierarchy = []
          that.groupsLoading = []

          // tell views that data has changed
          const payload = {
            items: that.items,
            hierarchy: that.hierarchy,
            groupsLoaded: that.groupsLoaded(),
            groupsLoading: []
          }
          that.trigger(payload)
        })
        .catch(function (error) {
          console.log('objectStore, onLoadPouchCompleted, error processing allDocs:', error)
        })
    },

    onLoadFailed (error) {
      console.log('objectStore: error loading objectStore from pouch:', error)
    },

    onLoadObjectStoreCompleted (payloadReceived) {
      // const that = this
      const { gruppe, items, hierarchy } = payloadReceived

      // although this should only happen once, make sure hierarchy is only included once
      this.hierarchy = _.without(this.hierarchy, _.findWhere(this.hierarchy, { 'Name': gruppe }))
      this.hierarchy.push(hierarchy)

      // add path to items - it makes finding an item by path much easier
      _.forEach(items, function (item) {
        addPathToObject(item)
      })

      _.assign(this.items, items)

      // loaded all items
      // signal that this group is not being loaded any more
      this.groupsLoading = _.without(this.groupsLoading, gruppe)

      // tell views that data has changed
      const payload = {
        items: this.items,
        hierarchy: this.hierarchy,
        groupsLoaded: this.groupsLoaded(),
        groupsLoading: this.groupsLoading
      }
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
