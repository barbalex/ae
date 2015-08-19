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
import buildFilterOptions from './modules/buildFilterOptions.js'
import getSynonymsOfObject from './modules/getSynonymsOfObject.js'
import getGruppen from './modules/gruppen.js'

export default function (Actions) {
  app.loginStore = Reflux.createStore({
    /*
     * contains email of logged in user
     * well, it is saved in pouch as local doc
     * and contains "logIn" bool which states if user needs to log in
     */
    listenables: Actions,

    getLogin () {
      return new Promise(function (resolve, reject) {
        app.localDb.get('_local/login', { include_docs: true })
          .then(function (doc) {
            resolve(doc)
          })
          .catch(function (error) {
            reject('loginStore: error getting login from localDb: ' + error)
          })
      })
    },

    onLogin (passedVariables) {
      // console.log('loginStore: onLogin, passedVariables', passedVariables)
      const that = this
      const logIn = passedVariables.logIn
      const email = passedVariables.email
      // change email only if it was passed
      const changeEmail = email !== undefined

      app.localDb.get('_local/login', { include_docs: true })
        .then(function (doc) {
          // console.log('loginStore: login doc', doc)
          if (doc.logIn !== logIn || (changeEmail && doc.email !== email) || (logIn && !email)) {
            doc.logIn = logIn
            if (changeEmail) {
              doc.email = email
            } else {
              passedVariables.email = doc.email
            }
            // console.log('loginStore: triggering passedVariables:', passedVariables)
            that.trigger(passedVariables)
            return app.localDb.put(doc)
          }
        })
        .catch(function (error) {
          console.log('loginStore: error logging in:', error)
        })
    }
  })

  app.pathStore = Reflux.createStore({
    /*
     * simple store that keeps a hash of paths as keys and guids as values
     * well, they are kept in the pouch in localPathDb
     */
    listenables: Actions,

    onLoadPathStore (newItemsPassed) {
      const that = this
      // get existing paths
      addPathsFromItemsToLocalPathDb(newItemsPassed)
        .then(function () {
          that.trigger(true)
        })
        .catch(function (error) {
          console.log('pathStore: error adding paths from passed items:', error)
        })
    }
  })

  app.filterOptionsStore = Reflux.createStore({
    /*
     * simple store that keeps an array of filter options
     * because creating them uses a lot of cpu
     * well, they are kept in the pouch in localFilterOptionsDb
    */
    listenables: Actions,

    getOptions () {
      return new Promise(function (resolve, reject) {
        app.localFilterOptionsDb.allDocs({include_docs: true})
          .then(function (result) {
            const options = result.rows.map(function (row) {
              return row.doc
            })
            resolve(options)
          })
          .catch(function (error) {
            reject('filterOptionsStore: error fetching options from localFilterOptionsDb:', error)
          })
      })
    },

    onLoadFilterOptionsStore () {
      const payload = {
        options: null,
        loading: true
      }
      this.trigger(payload)
    },

    onLoadFilterOptionsStoreCompleted (newItemsPassed) {
      const that = this
      let options = []
      // get existing options
      this.getOptions()
        .then(function (optionsFromPouch) {
          options = options.concat(optionsFromPouch)
          if (newItemsPassed) options = options.concat(buildFilterOptions(newItemsPassed))
          const payload = {
            options: options,
            loading: false
          }
          that.trigger(payload)
        })
        .catch(function (error) {
          console.log('filterOptionsStore: error preparing trigger:', error)
        })
    }
  })

  app.activePathStore = Reflux.createStore({
    /*
     * simple store that keeps the path (=url) as an array
     * components can listen to changes in order to update the path
    */
    listenables: Actions,

    path: [],

    guid: null,

    onLoadActivePathStore (path, guid) {
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
      const that = this
      // only change if something has changed
      if (!_.isEqual(item, this.item)) {
        // item can be an object or {}
        this.item = item
        this.loaded = _.keys(item).length > 0
        // tell views that data has changed
        this.trigger(item, [])
        // now check for synonym objects
        // if they exist: trigger again and pass synonyms
        getSynonymsOfObject(item)
          .then(function (synonymObjects) {
            if (synonymObjects.length > 0) that.trigger(item, synonymObjects)
          })
          .catch(function (error) {
            console.log('activeObjectStore: error fetching synonyms of object:', error)
          })
      }
    }
  })

  app.objectStore = Reflux.createStore({
    /*
     * keeps an array of objects, of hierarchy objects and of groups loaded (i.e. their names)
     * the are managed with the same store (but different databases)
     * because they depend on each other / always change together
     *
     * objects are kept in the pouch in localDb,
     * hierarchies in localHierarchyDb,
     * groups in localGroupsDb
    */
    listenables: Actions,

    groupsLoading: [],

    groupsLoaded () {
      return new Promise(function (resolve, reject) {
        getGroupsLoadedFromLocalGroupsDb()
          .then(function (groupsLoaded) {
            resolve(groupsLoaded)
          })
          .catch(function (error) {
            reject('objectStore, groupsLoaded: error getting groups loaded:', error)
          })
      })
    },

    isGroupLoaded (gruppe) {
      const that = this
      return new Promise(function (resolve, reject) {
        that.groupsLoaded()
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
      let hierarchy = []

      this.groupsLoading = _.union(this.groupsLoading, [gruppe])

      // get items
      this.getHierarchy()
        .then(function (result) {
          hierarchy = result
          // get groups loaded
          return getGroupsLoadedFromLocalGroupsDb()
        })
        .then(function (groupsLoaded) {
          // trigger change so components can set loading state
          const payload = {
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

    onLoadPouchFromRemoteCompleted (groupsLoaded) {
      const that = this
      const allGroups = getGruppen()
      let hierarchy = []
      // get all docs from pouch
      getItemsFromLocalDb()
        .then(function (docs) {
          // need to build filter options, hierarchy and paths only for groups newly loaded
          const items = _.filter(docs, function (doc) {
            return _.includes(groupsLoaded, doc.Gruppe)
          })
          Actions.loadFilterOptionsStore(items)
          // build path hash - it makes finding an item by path much easier
          Actions.loadPathStore(items)
          // build hierarchy and save to pouch
          hierarchy = buildHierarchy(items)
          return app.localHierarchyDb.bulkDocs(hierarchy)
        })
        .then(function () {
          that.groupsLoading = []
          return app.localGroupsDb.get('groups')
        })
        .then(function (groupsLoadedDoc) {
          groupsLoadedDoc.groupsLoaded = allGroups
          return app.localGroupsDb.put(groupsLoadedDoc)
        })
        .then(function () {
          // tell views that data has changed
          const payload = {
            hierarchy: hierarchy,
            groupsLoaded: allGroups,
            groupsLoading: []
          }
          that.trigger(payload)
        })
        .catch(function (error) {
          console.log('objectStore, onLoadPouchFromRemoteCompleted, error processing allDocs:', error)
        })
    },

    onLoadPouchFromLocal (groupsLoadedInPouch) {
      // console.log('objectStore, onLoadPouchFromLocal')
      this.groupsLoading = groupsLoadedInPouch
      const payload = {
        groupsLoaded: []
      }
      this.trigger(payload)
    },

    onLoadPouchFromLocalCompleted (groupsLoadedInPouch) {
      const that = this
      getHierarchyFromLocalHierarchyDb()
        .then(function (hierarchy) {
          that.groupsLoading = []
          const payload = {
            groupsLoaded: groupsLoadedInPouch,
            hierarchy: hierarchy
          }
          that.trigger(payload)
          Actions.loadFilterOptionsStore()
        })
    },

    onLoadFailed (error) {
      console.log('objectStore: error loading objectStore from pouch:', error)
    },

    onLoadObjectStoreCompleted (gruppe) {
      const that = this
      let payloadHierarchy = []
      let payloadGroupsLoaded = []
      let items = []

      // get items
      getItemsFromLocalDb()
        .then(function (docs) {
          // got all docs, including other groups > filter by group
          items = _.filter(docs, 'Gruppe', gruppe)
          return items
        })
        .then(function (items) {
          // load path, filter and hierarchy store
          Actions.loadPathStore(items)
          Actions.loadFilterOptionsStore(items)
          const hierarchy = buildHierarchy(items)
          const hierarchyOfGruppe = _.find(hierarchy, {'Name': gruppe})
          return app.localHierarchyDb.put(hierarchyOfGruppe, gruppe)
        })
        .then(function () {
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
          // signal that this group is not being loaded any more
          that.groupsLoading = _.without(that.groupsLoading, gruppe)
          const groupsLoading = that.groupsLoading

          // tell views that data has changed
          const payload = {
            hierarchy: payloadHierarchy,
            groupsLoaded: payloadGroupsLoaded,
            groupsLoading: groupsLoading
          }
          that.trigger(payload)
        })
        .catch(function (error) {
          console.log('objectStore, onLoadObjectStoreCompleted, error putting hierarchyOfGruppe to localHierarchyDb or items to localDb:', error)
        })
    },

    onLoadObjectStoreCompleted_OLD_DELETE (payloadReceived) {
      // console.log('objectStore, onLoadObjectStoreCompleted')
      const { gruppe, items } = payloadReceived
      const that = this
      let payloadHierarchy = []
      let payloadGroupsLoaded = []

      // build hierarchy
      const hierarchy = buildHierarchy(items)
      const hierarchyOfGruppe = _.find(hierarchy, {'Name': gruppe})

      Actions.loadPathStore(items)

      PouchDB.utils.Promise.all([
        app.localHierarchyDb.put(hierarchyOfGruppe, gruppe),
        app.localDb.bulkDocs(items)
      ])
        .then(function () {
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
          // signal that this group is not being loaded any more
          that.groupsLoading = _.without(that.groupsLoading, gruppe)
          const groupsLoading = that.groupsLoading

          // tell views that data has changed
          const payload = {
            hierarchy: payloadHierarchy,
            groupsLoaded: payloadGroupsLoaded,
            groupsLoading: groupsLoading
          }
          that.trigger(payload)
        })
        .catch(function (error) {
          console.log('objectStore, onLoadObjectStoreCompleted, error putting hierarchyOfGruppe to localHierarchyDb or items to localDb:', error)
        })
    },

    onLoadObjectStoreFailed (error, gruppe) {
      this.groupsLoading = _.without(this.groupsLoading, gruppe)
      console.log('objectStore: loading items failed with error: ', error)
    }
  })
}
