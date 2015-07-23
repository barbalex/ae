'use strict'

import app from 'ampersand-app'
import Reflux from 'reflux'
import PouchDB from 'pouchdb'
import _ from 'lodash'
import buildHierarchy from './modules/buildHierarchy.js'
import getGroupsLoadedFromLocalGroupsDb from './modules/getGroupsLoadedFromLocalGroupsDb.js'
import getItemsFromLocalDb from './modules/getItemsFromLocalDb.js'
import getItemFromLocalDb from './modules/getItemFromLocalDb.js'
import getHierarchyFromLocalHierarchyDb from './modules/getHierarchyFromLocalHierarchyDb.js'
import addPathsFromItemsToLocalPathDb from './modules/addPathsFromItemsToLocalPathDb.js'
import gruppen from './modules/gruppen.js'

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
        getGroupsLoadedFromLocalGroupsDb()
          .then(function (groupsLoaded) {
            const groupIsLoaded = _.includes(groupsLoaded, gruppe)
            resolve(groupIsLoaded)
          })
          .catch(function (error) {
            reject('objectStore, isGroupLoaded: error getting groups loaded:', error)
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
      let items = []
      let hierarchy = []

      this.groupsLoading = _.union(this.groupsLoading, [gruppe])

      // get items
      this.getItems()
        .then(function (result) {
          items = result
          // get hierarchy
          return that.getHierarchy()
        })
        .then(function (result) {
          hierarchy = result
          // get groups loaded
          return getGroupsLoadedFromLocalGroupsDb()
        })
        .then(function (groupsLoaded) {
          // trigger change so components can set loading state
          const payload = {
            items: items,
            hierarchy: hierarchy,
            gruppe: gruppe,
            groupsLoaded: groupsLoaded,
            groupsLoading: that.groupsLoading
          }
          that.trigger(payload)
        })
        .catch(function (error) {
          console.log('objectStore, onLoadObjectStore, error getting data:', error)
        })
    },

    onLoadPouchFromRemoteCompleted () {
      console.log('objectStore, onLoadPouchFromRemoteCompleted')
      const that = this
      let items = []
      let hierarchy = []
      let groupsLoaded = []
      // get all docs from pouch
      // an error occurs - and it is too cpu intensive
      getItemsFromLocalDb()
        .then(function (docs) {
          console.log('objectStore, onLoadPouchFromRemoteCompleted: allDocs fetched')
          // extract objects from result
          items = docs

          // build path hash - it makes finding an item by path much easier
          addPathsFromItemsToLocalPathDb(items)

          // build hierarchy and save to pouch
          hierarchy = buildHierarchy(items)
          groupsLoaded = _.pluck(hierarchy, 'Name')
          app.localHierarchyDb.bulkDocs(hierarchy)
            .catch(function (error) {
              console.log('objectStore, onLoadPouchFromRemoteCompleted: error writing hierarchy to pouch:', error)
            })

          that.groupsLoading = []

          return app.localGroupsDb.get('groups')
        })
        .then(function (groupsLoadedDoc) {
          groupsLoadedDoc.groupsLoaded = groupsLoaded
          return app.localGroupsDb.put(groupsLoadedDoc)
        })
        .then(function () {
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
          console.log('objectStore, onLoadPouchFromRemoteCompleted, error processing allDocs:', error)
        })
    },

    onLoadPouchFromLocal (groupsLoadedInPouch) {
      console.log('objectStore, onLoadPouchFromLocal')
      this.groupsLoading = groupsLoadedInPouch
      const payload = {
        groupsLoaded: []
      }
      this.trigger(payload)
    },

    onLoadPouchFromLocalCompleted (groupsLoadedInPouch) {
      console.log('objectStore, onLoadPouchFromLocalCompleted')
      
      const that = this

      this.groupsLoading = []

      Promise.all([
        getItemsFromLocalDb(),
        getHierarchyFromLocalHierarchyDb()
      ])
      .then(function (value) {
        const items = value[0]
        const hierarchy = value[1]

        const payload = {
          groupsLoaded: groupsLoadedInPouch,
          items: items,
          hierarchy: hierarchy
        }
        that.trigger(payload)
      })
    },

    onLoadFailed (error) {
      console.log('objectStore: error loading objectStore from pouch:', error)
    },

    onLoadObjectStoreCompleted (payloadReceived) {
      console.log('objectStore, onLoadObjectStoreCompleted')
      const { gruppe, items } = payloadReceived
      const that = this
      let payloadItems = []
      let payloadHierarchy = []
      let payloadGroupsLoaded = []

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
      .then(function (result) {
        payloadHierarchy = result
        // get groups loaded
        return app.localGroupsDb.get('groups')
      })
      .then(function (groupsLoadedDoc) {
        // update groups loaded
        groupsLoadedDoc.groupsLoaded.push(gruppe)
        payloadGroupsLoaded = groupsLoadedDoc.groupsLoaded
        app.localGroupsDb.put(groupsLoadedDoc)
      })
      .then(function () {
        // loaded all items
        // signal that this group is not being loaded any more
        that.groupsLoading = _.without(that.groupsLoading, gruppe)
        const groupsLoading = that.groupsLoading

        // tell views that data has changed
        const payload = {
          items: payloadItems,
          hierarchy: payloadHierarchy,
          groupsLoaded: payloadGroupsLoaded,
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
