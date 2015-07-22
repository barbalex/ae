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
    listenables: Actions,

    groupsLoading: [],

    groupsLoaded () {
      return new Promise(function (resolve, reject) {
        app.localHierarchyDb.allDocs({include_docs: true})
          .then(function (result) {
            const hierarchy = result.rows.map(function (row) {
              return row.doc
            })
            resolve(_.pluck(hierarchy, 'Name'))
          })
          .catch(function (error) {
            console.log('objectStore, groupsLoaded: error getting items from localHierarchyDb:', error)
            resolve([])
          })
      })
    },

    isGroupLoaded (gruppe) {
      return _.includes(this.groupsLoaded(), gruppe)
    },

    // getItems and getItem get Item(s) from pouch if loaded
    getItems () {
      return new Promise(function (resolve, reject) {
        app.localDb.allDocs({include_docs: true})
          .then(function (result) {
            const items = result.rows.map(function (row) {
              return row.doc
            })
            resolve(items)
          })
          .catch(function (error) {
            console.log('objectStore: error getting items from localDb:', error)
            reject(error)
          })
      })
    },

    getItem (guid) {
      if (!guid) {
        console.log('objectStore, getItem: no guid passed')
        return {}
      }
      return app.localDb.get(guid)
        .then(function (item) {
          return item
        })
        .catch(function (error) {
          console.log('objectStore: error getting item from localDb:', error)
          return {}
        })
    },

    getHierarchy () {
      return new Promise(function (resolve, reject) {
        app.localHierarchyDb.allDocs({include_docs: true})
          .then(function (result) {
            const hierarchy = result.rows.map(function (row) {
              return row.doc
            })
            resolve(hierarchy)
          })
          .catch(function (error) {
            console.log('objectStore: error getting items from localHierarchyDb:', error)
            reject(error)
          })
      })
    },

    getPaths () {
      return new Promise(function (resolve, reject) {
        app.localPathDb.get('aePaths')
          .then(function (paths) {
            resolve(paths)
          })
          .catch(function (error) {
            console.log('objectStore: error getting paths from localPathDb:', error)
            reject(error)
          })
      })
    },

    getPath (pathString) {
      return new Promise(function (resolve, reject) {
        if (!pathString) {
          reject('objectStore, getPath: no pathString passed')
        }
        this.getPaths()
          .then(function (paths) {
            resolve(paths[pathString])
          })
          .catch(function (error) {
            reject('objectStore, getPath: error getting path:', error)
          })
      })
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
          return that.groupsLoaded()
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
      let payloadItems = []
      let payloadHierarchy = []

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
      .then(function () {
        return that.getItems()
      })
      .then(function (result) {
        payloadItems = result
        return that.getHierarchy()
      })
      .then(function (result) {
        payloadHierarchy = result
        return that.groupsLoaded()
      })
      .then(function (payloadGroupsLoaded) {
        // loaded all items
        // signal that this group is not being loaded any more
        that.groupsLoading = _.without(that.groupsLoading, gruppe)

        // tell views that data has changed
        const payload = {
          items: payloadItems,
          hierarchy: payloadHierarchy,
          groupsLoaded: payloadGroupsLoaded,
          groupsLoading: that.groupsLoading
        }
        console.log('store.js, onLoadObjectStoreCompleted, payload to be triggered', payload)
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
