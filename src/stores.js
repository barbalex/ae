'use strict'

import app from 'ampersand-app'
import Reflux from 'reflux'
import _ from 'lodash'
import buildHierarchy from './modules/buildHierarchy.js'
import getGroupsLoadedFromLocalGroupsDb from './modules/getGroupsLoadedFromLocalGroupsDb.js'
import getItemsFromLocalDb from './modules/getItemsFromLocalDb.js'
import getItemFromLocalDb from './modules/getItemFromLocalDb.js'
import getHierarchyFromLocalHierarchyDb from './modules/getHierarchyFromLocalHierarchyDb.js'
import addPathsFromItemsToLocalPathDb from './modules/addPathsFromItemsToLocalPathDb.js'
import buildFilterOptions from './modules/buildFilterOptions.js'
import getSynonymsOfObject from './modules/getSynonymsOfObject.js'
import addGroupsLoadedToLocalGroupsDb from './modules/addGroupsLoadedToLocalGroupsDb.js'
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

  app.loadingGroupsStore = Reflux.createStore({
    /*
     * keeps a list of loading groups
     * {group: 'Fauna', allGroups: false, message: 'Lade Fauna...', progressPercent: 60, finishedLoading: false}
     * loading groups are shown in menu under tree
     * if progressPercent is passed, a progressbar is shown
     * message is Text or label in progressbar
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

    onShowGroupLoading (objectPassed) {
      // groups: after loading all groups in parallel from remoteDb
      // need to pass a single action for all
      // otherwise 5 addGroupsLoadedToLocalGroupsDb calls occur at the same moment...
      const that = this
      const { group, allGroups, finishedLoading } = objectPassed
      const gruppen = getGruppen()

      getGroupsLoadedFromLocalGroupsDb()
        .then(function (groupsLoaded) {
          // if an object with this group is contained in groupsLoading, remove it
          if (allGroups) {
            that.groupsLoading = []
          } else {
            that.groupsLoading = _.reject(that.groupsLoading, function (groupObject) {
              return groupObject.group === group
            })
          }
          // add the passed object, if it is not yet loaded
          if (!finishedLoading) {
            that.groupsLoading.push(objectPassed)
          }
          groupsLoaded = allGroups ? gruppen : _.union(groupsLoaded, [group])
          if (finishedLoading) {
            const groupsToPass = allGroups ? gruppen : [group]
            addGroupsLoadedToLocalGroupsDb(groupsToPass).catch(function (error) {
              console.log('loadingGroupsStore, onShowGroupLoading, error adding group(s) to localGroupsDb:', error)
            })
          }
          // inform views
          const payload = {
            groupsLoadingObjects: that.groupsLoading,
            groupsLoaded: groupsLoaded
          }
          that.trigger(payload)
        })
        .catch(function (error) {
          console.log('loadingGroupsStore, onShowGroupLoading, error getting groups loaded from localGroupsDb:', error)
        })
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

    onLoadPouchFromRemoteCompleted (groupsLoaded) {
      const that = this
      const gruppen = getGruppen()
      let hierarchy = []
      gruppen.map(function (gruppe) {
        Actions.showGroupLoading({
          group: gruppe,
          message: 'Baue ' + gruppe + ' Taxonomie...'
        })
      })
      // get all docs from pouch
      this.getItems()
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
          // tell views that data has changed
          that.trigger(hierarchy)
          Actions.showGroupLoading({
            allGroups: true,
            finishedLoading: true
          })
        })
        .catch(function (error) {
          console.log('objectStore, onLoadPouchFromRemoteCompleted, error processing allDocs:', error)
        })
    },

    onLoadPouchFromLocal (groupsLoadedInPouch) {
      // signal that groups loaded = groups loaded in pouch
      // just pass one of the groups loaded as finished
      Actions.showGroupLoading({
        group: groupsLoadedInPouch[0],
        finishedLoading: true
      })
    },

    onLoadPouchFromLocalCompleted (groupsLoadedInPouch) {
      const that = this
      that.getHierarchy()
        .then(function (hierarchy) {
          that.trigger(hierarchy)
          Actions.loadFilterOptionsStore()
        })
    },

    onLoadPouchFromLocalFailed (error) {
      console.log('objectStore: error loading objectStore from pouch:', error)
    },

    onLoadObjectStore (gruppe) {
      const that = this

      // get items
      this.getHierarchy()
        .then(function (hierarchy) {
          // trigger change so components can set loading state
          that.trigger(hierarchy)
        })
        .catch(function (error) {
          console.log('objectStore, onLoadObjectStore, error getting data:', error)
        })
    },

    onLoadObjectStoreCompleted (gruppe) {
      const that = this
      let items = []
      let hierarchy = []

      Actions.showGroupLoading({
        group: gruppe,
        message: 'Baue ' + gruppe + ' Taxonomie...'
      })

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
          hierarchy = result
          // signal that this group is not being loaded any more
          Actions.showGroupLoading({
            group: gruppe,
            finishedLoading: true
          })
          // tell views that data has changed
          that.trigger(hierarchy)
        })
        .catch(function (error) {
          console.log('objectStore, onLoadObjectStoreCompleted, error putting hierarchyOfGruppe to localHierarchyDb or items to localDb:', error)
          that.trigger(hierarchy)
        })
    },

    onLoadObjectStoreFailed (error, gruppe) {
      // remove loading indicator
      Actions.showGroupLoading({
        group: gruppe,
        finishedLoading: true
      })
      console.log('objectStore: loading items failed with error: ', error)
    }
  })
}
