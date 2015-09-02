'use strict'

import app from 'ampersand-app'
import Reflux from 'reflux'
import _ from 'lodash'
import getGroupsLoadedFromLocalGroupsDb from './modules/getGroupsLoadedFromLocalGroupsDb.js'
import getItemsFromLocalDb from './modules/getItemsFromLocalDb.js'
import getItemFromLocalDb from './modules/getItemFromLocalDb.js'
import getItemFromRemoteDb from './modules/getItemFromRemoteDb.js'
import getHierarchyFromLocalHierarchyDb from './modules/getHierarchyFromLocalHierarchyDb.js'
import addPathsFromItemsToLocalPathDb from './modules/addPathsFromItemsToLocalPathDb.js'
import buildFilterOptions from './modules/buildFilterOptions.js'
import getSynonymsOfObject from './modules/getSynonymsOfObject.js'
import addGroupsLoadedToLocalGroupsDb from './modules/addGroupsLoadedToLocalGroupsDb.js'
import getGruppen from './modules/gruppen.js'
import loadGroupFromRemote from './modules/loadGroupFromRemote.js'
import queryPropertyCollections from './queries/propertyCollections.js'

export default function (Actions) {
  app.propertyCollectionsStore = Reflux.createStore({
    /*
     * queries property collections
     * keeps last query result in pouch (_local/pcs.pcs) for fast delivery
     * app.js sets default _local/pcs.pcs = [] if not exists on app start
     * pc's are arrays of the form:
     * [collectionType, pcName, combining, importedBy, {Beschreibung: xxx, Datenstand: xxx, Link: xxx, Nutzungsbedingungen: xxx}]
     */
    listenables: Actions,

    getPcs () {
      return new Promise(function (resolve, reject) {
        app.localDb.get('_local/pcs', { include_docs: true })
          .then(function (doc) {
            resolve(doc.pcs)
          })
          .catch(function (error) {
            reject('loginStore: error getting property collections from localDb: ' + error)
          })
      })
    },

    savePcs (pcs) {
      app.localDb.get('_local/pcs', { include_docs: true })
        .then(function (doc) {
          doc.pcs = pcs
          return app.localDb.put(doc)
        })
        .catch(function (error) {
          console.log(error)
        })
    },

    getPcByName (pcName) {
      const that = this
      return new Promise(function (resolve, reject) {
        that.getPcs()
          .then(function (pcs) {
            const pc = _.find(pcs, function (pc) {
              return pc.name === pcName
            })
            resolve(pc)
          })
          .catch(function (error) {
            reject(error)
          })
      })
    },

    onQueryPropertyCollections () {
      const that = this
      // if pc's exist, send them immediately
      this.getPcs()
        .then(function (pcs) {
          if (pcs.length > 0) that.trigger(pcs)
        })
        .catch(function (error) {
          console.log(error)
        })
      // now fetch up to date pc's
      queryPropertyCollections()
        .then(function (pcs) {
          that.savePcs(pcs)
          that.trigger(pcs)
        })
        .catch(function (error) {
          console.log('propertyCollectionsStore: error querying property collections:', error)
        })
    }
  })

  app.loginStore = Reflux.createStore({
    /*
     * contains email of logged in user
     * well, it is saved in pouch as local doc _local/login
     * and contains "logIn" bool which states if user needs to log in
     * app.js sets default _local/login if not exists on app start
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
            // add it to the beginning of the array
            that.groupsLoading.unshift(objectPassed)
          }
          groupsLoaded = allGroups ? gruppen : _.union(groupsLoaded, [group])
          if (finishedLoading) {
            // remove this group from groupsLoading
            that.groupsLoading = _.without(that.groupsLoading, group)
            // load next group if on is queued
            if (that.groupsLoading.length > 0) {
              // get group of last element
              const nextGroup = that.groupsLoading[that.groupsLoading.length - 1].group
              // load if
              loadGroupFromRemote(nextGroup)
                .then(function () {
                  return Actions.loadObjectStore.completed(nextGroup)
                })
                .catch(function (error) {
                  const errorMsg = 'Actions.loadObjectStore, error loading group ' + nextGroup + ': ' + error
                  Actions.loadObjectStore.failed(errorMsg, nextGroup)
                })
            }
            // write change to groups loaded to localGroupsDb
            const groupsToPass = allGroups ? gruppen : [group]
            addGroupsLoadedToLocalGroupsDb(groupsToPass)
              .catch(function (error) {
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
      return new Promise(function (resolve, reject) {
        getItemFromLocalDb(guid)
          .then(function (item) {
            // if no item is found in localDb, get from remote
            // important on first load of an object url
            // in order for this to work, getItemFromLocalDb returns null when not finding the doc
            if (!item) return getItemFromRemoteDb(guid)
            return item
          })
          .then(function (item) {
            resolve(item)
          })
          .catch(function (error) {
            reject('objectStore, getItem: error getting item from guid' + guid + ':', error)
          })
      })
    },

    getHierarchy () {
      return getHierarchyFromLocalHierarchyDb()
    },

    onLoadPouchFromRemoteCompleted () {
      const that = this

      this.getHierarchy()
        .then(function (hierarchy) {
          // trigger change so components can set loading state
          that.trigger(hierarchy)
        })
        .catch(function (error) {
          console.log('objectStore, onLoadObjectStore, error getting data:', error)
        })
    },

    onLoadPouchFromLocalCompleted (groupsLoadedInPouch) {
      const that = this
      Actions.loadFilterOptionsStore()
      this.getHierarchy()
        .then(function (hierarchy) {
          that.trigger(hierarchy)
        })
    },

    onLoadPouchFromLocalFailed (error) {
      console.log('objectStore: error loading objectStore from pouch:', error)
    },

    onLoadObjectStore (gruppe) {
      const that = this

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
      this.getHierarchy()
        .then(function (hierarchy) {
          // tell views that data has changed
          that.trigger(hierarchy)
        })
        .catch(function (error) {
          console.log('objectStore, onLoadObjectStore, error getting data:', error)
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
