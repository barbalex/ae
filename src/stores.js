'use strict'

import app from 'ampersand-app'
import Reflux from 'reflux'
import _ from 'lodash'
import buildHierarchy from './modules/buildHierarchy.js'
import replaceProblematicPathCharactersFromArray from './modules/replaceProblematicPathCharactersFromArray.js'

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
    /* This store caches the requested items in the items property
     * When all the items are loaded,
     * it will set the loaded property to true
     * so that the consuming components
     * will know if a API request is needed
     */
    listenables: Actions,

    // paths is a hash of paths (strings joined with '/', as keys) and guids (as values)
    // it helps finding a guid for a path quickly
    paths: {},

    // items are the objects
    items: {},

    // see module 'buildHierarchy' for how hierarchies are structured
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
          // convert items-array to object with keys made of id's
          const items = _.indexBy(itemsArray, '_id')

          // add path to items - it makes finding an item by path much easier
          _.forEach(items, function (item) {
            const hierarchy = _.get(item, 'Taxonomien[0].Eigenschaften.Hierarchie', [])
            let path = _.pluck(hierarchy, 'Name')
            path = replaceProblematicPathCharactersFromArray(path).join('/')
            that.paths[path] = item._id
          })
          that.items = items
          that.hierarchy = hierarchy
          // save paths and hierarchy to pouch
          app.localHierarchyDb.bulkDocs(hierarchy)
            .then(function (result) {
              console.log('objectStore, onLoadPouchCompleted: written hierarchy to pouch')
            })
            .catch(function (error) {
              console.log('objectStore, onLoadPouchCompleted: error writing hierarchy to pouch:', error)
            })
          app.localPathDb.put(that.paths)
            .then(function (result) {
              console.log('objectStore, onLoadPouchCompleted: written paths to pouch')
            })
            .catch(function (error) {
              console.log('objectStore, onLoadPouchCompleted: error writing paths to pouch:', error)
            })

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
      const that = this
      const { gruppe, items, hierarchy } = payloadReceived

      // although this should only happen once, make sure hierarchy is only included once
      this.hierarchy = _.without(this.hierarchy, _.findWhere(this.hierarchy, { 'Name': gruppe }))
      this.hierarchy.push(hierarchy)

      // add path to items - it makes finding an item by path much easier
      _.forEach(items, function (item) {
        const hierarchy = _.get(item, 'Taxonomien[0].Eigenschaften.Hierarchie', [])
        let path = _.pluck(hierarchy, 'Name')
        path = replaceProblematicPathCharactersFromArray(path).join('/')
        that.paths[path] = item._id
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
