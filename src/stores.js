'use strict'

import app from 'ampersand-app'
import Reflux from 'reflux'
import PouchDB from 'pouchdb'
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

    groupsLoading: [],

    groupsLoaded () {
      app.localHierarchyDb.allDocs({include_docs: true})
        .then(function (result) {
          const hierarchy = result.rows.map(function (row) {
            return row.doc
          })
          return _.pluck(hierarchy, 'Name')
        })
        .catch(function (error) {
          console.log('objectStore, groupsLoaded: error getting items from localHierarchyDb:', error)
        })
    },

    isGroupLoaded (gruppe) {
      return _.includes(this.groupsLoaded(), gruppe)
    },

    pouchLoaded () {
      app.localDb.info()
        .then(function (result) {
          if (result.doc_count && result.doc_count > 0) return true
          return false
        })
        .catch(function (error) {
          console.log('app.js: error getting info of localDb:', error)
          return false
        })
    },

    // getItems and getItem get Item(s) from pouch if loaded
    getItems () {
      app.localDb.allDocs({include_docs: true})
        .then(function (result) {
          const items = result.rows.map(function (row) {
            return row.doc
          })
          return items
        })
        .catch(function (error) {
          console.log('objectStore: error getting items from localDb:', error)
        })
    },

    getItem (guid) {
      if (!guid) {
        console.log('objectStore, getItem: no guid passed')
        return {}
      }
      app.localDb.get(guid)
        .then(function (item) {
          return item
        })
        .catch(function (error) {
          console.log('objectStore: error getting item from localDb:', error)
          return {}
        })
    },

    getHierarchy () {
      app.localHierarchyDb.allDocs({include_docs: true})
        .then(function (result) {
          const hierarchy = result.rows.map(function (row) {
            return row.doc
          })
          return hierarchy
        })
        .catch(function (error) {
          console.log('objectStore: error getting items from localHierarchyDb:', error)
        })
    },

    getPaths () {
      app.localPathDb.get('aePaths')
        .then(function (paths) {
          return paths
        })
        .catch(function (error) {
          console.log('objectStore: error getting paths from localPathDb:', error)
          return {}
        })
    },

    getPath (pathString) {
      if (!pathString) {
        console.log('objectStore, getPath: no pathString passed')
        return null
      }
      const paths = this.getPaths()
      return paths[pathString]
    },

    onLoadObjectStore (gruppe) {
      this.groupsLoading = _.union(this.groupsLoading, [gruppe])
      // trigger change so components can set loading state
      const payload = {
        items: this.getItems(),
        hierarchy: this.getHierarchy(),
        gruppe: gruppe,
        groupsLoaded: this.groupsLoaded(),
        groupsLoading: []
      }
      this.trigger(payload)
    },

    onLoadPouchCompleted () {
      console.log('objectStore, onLoadPouchCompleted')
      const that = this
      // get all docs from pouch
      // an error occurs - and it is too cpu intensive
      app.localDb.allDocs({include_docs: true})
        .then(function (result) {
          console.log('objectStore, onLoadPouchCompleted: allDocs fetched')
          // extract objects from result
          const items = result.rows.map(function (row) {
            return row.doc
          })
          const hierarchy = buildHierarchy(items)

          // add path to items - it makes finding an item by path much easier
          const paths = {}
          _.forEach(items, function (item) {
            const hierarchy = _.get(item, 'Taxonomien[0].Eigenschaften.Hierarchie', [])
            let path = _.pluck(hierarchy, 'Name')
            path = replaceProblematicPathCharactersFromArray(path).join('/')
            paths[path] = item._id
          })
          // that.items = items
          // that.hierarchy = hierarchy
          // save paths and hierarchy to pouch
          app.localHierarchyDb.bulkDocs(hierarchy)
            .then(function (result) {
              console.log('objectStore, onLoadPouchCompleted: written hierarchy to pouch')
            })
            .catch(function (error) {
              console.log('objectStore, onLoadPouchCompleted: error writing hierarchy to pouch:', error)
            })

          // console.log('objectStore, onLoadPouchCompleted: writing that.paths to pouch:', that.paths)

          app.localPathDb.put(paths, 'aePaths')
            .then(function (result) {
              console.log('objectStore, onLoadPouchCompleted: written paths to pouch')
            })
            .catch(function (error) {
              console.log('objectStore, onLoadPouchCompleted: error writing paths to pouch:', error)
            })

          that.groupsLoading = []

          // tell views that data has changed
          const payload = {
            items: items,
            hierarchy: hierarchy,
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
      const { gruppe, items } = payloadReceived
      const that = this

      // build paths
      let paths = {_id: 'aePaths'}
      const pathsOfGruppe = {}
      _.forEach(items, function (item) {
        const hierarchy = _.get(item, 'Taxonomien[0].Eigenschaften.Hierarchie', [])
        let path = _.pluck(hierarchy, 'Name')
        path = replaceProblematicPathCharactersFromArray(path).join('/')
        pathsOfGruppe[path] = item._id
      })

      // combine these paths with those already in pathDb
      app.localPathDb.get('aePaths', function (error, pathsFromDb) {
        if (error) {
          if (error.status === 404) {
            // leave paths as it is
          } else {
            return console.log('objectStore: could not save paths')
          }
        } else {
          // there existed already a path object
          // combine them
          paths = pathsFromDb
        }
        _.assign(paths, pathsOfGruppe)
        app.localPathDb.put(paths, function (error) {
          if (error) console.log('error writing paths to localPathDb')
        })
      })

      // build hierarchy
      const hierarchy = buildHierarchy(items)
      const hierarchyOfGruppe = _.find(hierarchy, {'Name': gruppe})

      PouchDB.utils.Promise.all([
        app.localHierarchyDb.put(hierarchyOfGruppe, gruppe),
        app.localDb.bulkDocs(items)
      ])
      .catch(function (error) {
        console.log('objectStore, onLoadObjectStoreCompleted, error putting hierarchyOfGruppe to localHierarchyDb or items to localDb:', error)
      })
      .then(function () {
        // loaded all items
        // signal that this group is not being loaded any more
        that.groupsLoading = _.without(that.groupsLoading, gruppe)

        // tell views that data has changed
        const payload = {
          items: that.getItems(),
          hierarchy: that.getHierarchy(),
          groupsLoaded: that.groupsLoaded(),
          groupsLoading: that.groupsLoading
        }
        console.log('store.js, onLoadObjectStoreCompleted, payload to be triggered', payload)
        that.trigger(payload)
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
