'use strict'

import app from 'ampersand-app'
import Reflux from 'reflux'
import PouchDB from 'pouchdb'
import _ from 'lodash'
import buildHierarchy from './modules/buildHierarchy.js'
import getGroupsLoadedFromHierarchy from './modules/getGroupsLoadedFromHierarchy.js'
import getItemsFromLocalDb from './modules/getItemsFromLocalDb.js'
import getItemFromLocalDb from './modules/getItemFromLocalDb.js'
import getHierarchyFromLocalHierarchyDb from './modules/getHierarchyFromLocalHierarchyDb.js'
import addPathsFromItemsToLocalPathDb from './modules/addPathsFromItemsToLocalPathDb.js'

export default function (Actions) {
  app.activePathStore = Reflux.createStore({
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

  app.activeObjectStore = Reflux.createStore({
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

  app.objectStore = Reflux.createStore({
    listenables: Actions,

    groupsLoading: [],

    isGroupLoaded (gruppe) {
      return new Promise(function (resolve, reject) {
        getGroupsLoadedFromHierarchy()
          .then(function (groupsLoaded) {
            const groupIsLoaded = _.includes(groupsLoaded, gruppe)
            resolve(groupIsLoaded)
          })
          .catch(function (error) {
            reject('objectStore: error getting groups loaded:', error)
          })
      })
    },

    // getItems and getItem get Item(s) from pouch if loaded
    getItems () {
      return getItemsFromLocalDb()
    },

    getItem (guid) {
      return getItemFromLocalDb(guid)
    },

    getHierarchy () {
      return getHierarchyFromLocalHierarchyDb()
    },

    onLoadObjectStore (gruppe) {
      const that = this
      let payloadItems = []
      let payloadHierarchy = []

      this.groupsLoading = _.union(this.groupsLoading, [gruppe])

      this.getItems()
        .then(function (result) {
          payloadItems = result
          return that.getHierarchy()
        })
        .then(function (result) {
          payloadHierarchy = result
          return getGroupsLoadedFromHierarchy()
        })
        .then(function (payloadGroupsLoaded) {
          // trigger change so components can set loading state
          const payload = {
            items: payloadItems,
            hierarchy: payloadHierarchy,
            gruppe: gruppe,
            groupsLoaded: payloadGroupsLoaded,
            groupsLoading: that.groupsLoading
          }
          that.trigger(payload)
        })
        .catch(function (error) {
          console.log('objectStore, onLoadObjectStore, error getting groupsLoaded:', error)
        })
    },

    onLoadPouchCompleted () {
      console.log('objectStore, onLoadPouchCompleted')
      const that = this
      let items = []
      let hierarchy = []
      // get all docs from pouch
      // an error occurs - and it is too cpu intensive
      app.localDb.allDocs({include_docs: true})
        .then(function (result) {
          console.log('objectStore, onLoadPouchCompleted: allDocs fetched')
          // extract objects from result
          items = result.rows.map(function (row) {
            return row.doc
          })

          // build path hash - it makes finding an item by path much easier
          addPathsFromItemsToLocalPathDb(items)

          // build hierarchy and save to pouch
          hierarchy = buildHierarchy(items)
          app.localHierarchyDb.bulkDocs(hierarchy)
            .catch(function (error) {
              console.log('objectStore, onLoadPouchCompleted: error writing hierarchy to pouch:', error)
            })

          that.groupsLoading = []
          const groupsLoaded = _.pluck(hierarchy, 'Name')

          // tell views that data has changed
          const payload = {
            items: items,
            hierarchy: hierarchy,
            groupsLoaded: groupsLoaded,
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
      const { gruppe, items } = payloadReceived
      const that = this
      let payloadItems = []

      // build hierarchy
      const hierarchy = buildHierarchy(items)
      const hierarchyOfGruppe = _.find(hierarchy, {'Name': gruppe})

      PouchDB.utils.Promise.all([
        addPathsFromItemsToLocalPathDb(items),
        app.localHierarchyDb.put(hierarchyOfGruppe, gruppe),
        app.localDb.bulkDocs(items)
      ])
      .then(function () {
        return that.getItems()
      })
      .then(function (result) {
        payloadItems = result
        return that.getHierarchy()
      })
      .then(function (payloadHierarchy) {
        // loaded all items
        const groupsLoaded = _.pluck(payloadHierarchy, 'Name')
        // signal that this group is not being loaded any more
        that.groupsLoading = _.without(that.groupsLoading, gruppe)
        const groupsLoading = that.groupsLoading

        // tell views that data has changed
        const payload = {
          items: payloadItems,
          hierarchy: payloadHierarchy,
          groupsLoaded: groupsLoaded,
          groupsLoading: groupsLoading
        }
        // console.log('store.js, onLoadObjectStoreCompleted, payload to be triggered', payload)
        that.trigger(payload)
      })
      .catch(function (error) {
        console.log('objectStore, onLoadObjectStoreCompleted, error putting hierarchyOfGruppe to localHierarchyDb or items to localDb:', error)
      })
    },

    onLoadObjectStoreFailed (error, gruppe) {
      // const indexOfGruppe = this.groupsLoading.indexOf(gruppe)
      // this.groupsLoading.splice(indexOfGruppe, 1)
      this.groupsLoading = _.without(this.groupsLoading, gruppe)
      console.log('objectStore: loading items failed with error: ', error)
    }
  })
}
