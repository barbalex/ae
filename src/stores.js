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
import queryPcs from './queries/pcs.js'
import objectsIdsByPcsName from './queries/objectsIdsByPcsName.js'

export default (Actions) => {
  app.errorStore = Reflux.createStore({
    /*
     * receives an error object with two keys: title, msg
     * keeps error objects in the array errors
     * deletes errors after a defined time - the time while the error will be shown to the user
     *
     * if a view wants to inform of an error it
     * calls action showError and passes the object
     *
     * the errorStore triggers, passing the errors array
     * ...then triggers again after removing the last error some time later
     *
     * Test: app.Actions.showError({title: 'testTitle', msg: 'testMessage'})
     * template: app.Actions.showError({title: 'title', msg: error})
     */
    listenables: Actions,

    errors: [],

    // this is how long the error will be shown
    duration: 10000,

    onShowError (error) {
      if (!error) {
        // user wants to remove error messages
        this.errors = []
        this.trigger(this.errors)
      } else {
        this.errors.unshift(error)
        this.trigger(this.errors)
        setTimeout(() => {
          this.errors.pop()
          this.trigger(this.errors)
        }, this.duration)
      }
    }
  })

  app.objectsPcsStore = Reflux.createStore({
    /**
     * used to manipulate property collections in objects
     * when importing and deleting property collections
     */
    listenables: Actions,

    onImportPcs () {

    },

    onDeletePcByName (name) {
      /**
       * gets name of pc
       * removes pc's with this name from all objects
       * is listened to by importPc.js
       * returns: idsOfAeObjects, deletingPcProgress
       * if a callback is passed, it is executed at the end
       */
      let idsOfAeObjects = []
      let deletingPcProgress = null
      let nameBestehend = name
      this.trigger({ idsOfAeObjects, deletingPcProgress, nameBestehend })
      objectsIdsByPcsName(name)
        .then((ids) => {
          idsOfAeObjects = ids
          ids.forEach((id, index) => {
            app.objectStore.getItem(id)
              .then((doc) => {
                doc.Eigenschaftensammlungen = _.reject(doc.Eigenschaftensammlungen, (es) => es.Name === name)
                return app.localDb.put(doc)
              })
              .then(() => {
                deletingPcProgress = Math.round((index + 1) / ids.length * 100)
                if (deletingPcProgress === 100) app.propertyCollectionsStore.removePcByName(name)
                this.trigger({ idsOfAeObjects, deletingPcProgress })
              })
              .catch((error) => app.Actions.showError({title: `Fehler: Das Objekt mit der ID ${id} wurde nicht aktualisiert:`, msg: error}))
          })
        })
        .catch((error) => app.Actions.showError({title: 'Fehler beim Versuch, die Eigenschaften zu löschen:', msg: error}))
    },

    onRemovePcInstances (name, idsOfAeObjects) {
      idsOfAeObjects.forEach((guid, index) => {
        app.objectStore.getItem(guid)
          .then((doc) => {
            doc.Eigenschaftensammlungen = _.reject(doc.Eigenschaftensammlungen, (es) => es.Name === name)
            return app.localDb.put(doc)
          })
          .then(() => {
            const deletingPcInstancesProgress = Math.round((index + 1) / idsOfAeObjects.length * 100)
            let pcsRemoved = false
            if (deletingPcInstancesProgress === 100) pcsRemoved = true
            this.trigger({ deletingPcInstancesProgress, pcsRemoved })
          })
          .catch((error) => app.Actions.showError({title: `Fehler: Das Objekt mit der GUID ${guid} wurde nicht aktualisiert:`, msg: error}))
      })
    }

  })

  app.propertyCollectionsStore = Reflux.createStore({
    /*
     * queries property collections
     * keeps last query result in pouch (_local/pcs.pcs) for fast delivery
     * app.js sets default _local/pcs.pcs = [] if not exists on app start
     * pc's are arrays of the form:
     * [collectionType, pcName, combining, importedBy, {Beschreibung: xxx, Datenstand: xxx, Link: xxx, Nutzungsbedingungen: xxx}, count: xxx]
     */
    listenables: Actions,

    getPcs () {
      return new Promise((resolve, reject) => {
        app.localDb.get('_local/pcs', { include_docs: true })
          .then((doc) => resolve(doc.pcs))
          .catch((error) =>
            reject('loginStore: error getting property collections from localDb: ' + error)
          )
      })
    },

    savePc (pc) {
      let pcs
      app.localDb.get('_local/pcs', { include_docs: true })
        .then((doc) => {
          doc.pcs.push(pc)
          doc.pcs = _.sortBy(doc.pcs, (pc) => pc.name)
          pcs = doc.pcs
          return app.localDb.put(doc)
        })
        .then(() => this.trigger(pcs))
        .catch((error) =>
          app.Actions.showError({title: 'Fehler in propertyCollectionsStore, savePc:', msg: error})
        )
    },

    savePcs (pcs) {
      app.localDb.get('_local/pcs', { include_docs: true })
        .then((doc) => {
          doc.pcs = pcs
          return app.localDb.put(doc)
        })
        .catch((error) =>
          app.Actions.showError({title: 'Fehler in propertyCollectionsStore, savePcs:', msg: error})
        )
    },

    removePcByName (name) {
      let pcs
      app.localDb.get('_local/pcs', { include_docs: true })
        .then((doc) => {
          doc.pcs = _.reject(doc.pcs, (pc) => pc.name === name)
          pcs = doc.pcs
          return app.localDb.put(doc)
        })
        .then(() => this.trigger(pcs))
        .catch((error) =>
          app.Actions.showError({title: 'Fehler in propertyCollectionsStore, removePcByName:', msg: error})
        )
    },

    getPcByName (name) {
      return new Promise((resolve, reject) => {
        this.getPcs()
          .then((pcs) => {
            const pc = _.find(pcs, (pc) => pc.name === name)
            resolve(pc)
          })
          .catch((error) => reject(error))
      })
    },

    onQueryPropertyCollections () {
      // if pc's exist, send them immediately
      this.getPcs()
        .then((pcs) => {
          if (pcs.length > 0) this.trigger(pcs)
        })
        .catch((error) =>
          app.Actions.showError({title: 'propertyCollectionsStore, error getting existing pcs:', msg: error})
        )
      // now fetch up to date pc's
      queryPcs()
        .then((pcs) => {
          // email has empty values. Set default
          pcs.forEach((pc) => {
            pc.importedBy = pc.importedBy || 'alex@gabriel-software.ch'
          })
          this.trigger(pcs)
          return this.savePcs(pcs)
        })
        .catch((error) =>
          app.Actions.showError({title: 'propertyCollectionsStore, error querying up to date pcs:', msg: error})
        )
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
      return new Promise((resolve, reject) => {
        app.localDb.get('_local/login', { include_docs: true })
          .then((doc) => resolve(doc))
          .catch((error) =>
            reject('loginStore: error getting login from localDb: ' + error)
          )
      })
    },

    onLogin (passedVariables) {
      const logIn = passedVariables.logIn
      const email = passedVariables.email
      // change email only if it was passed
      const changeEmail = email !== undefined

      app.localDb.get('_local/login', { include_docs: true })
        .then((doc) => {
          if (doc.logIn !== logIn || (changeEmail && doc.email !== email) || (logIn && !email)) {
            doc.logIn = logIn
            if (changeEmail) {
              doc.email = email
            } else {
              passedVariables.email = doc.email
            }
            this.trigger(passedVariables)
            return app.localDb.put(doc)
          }
        })
        .catch((error) =>
          app.Actions.showError({title: 'loginStore: error logging in:', msg: error})
        )
    }
  })

  app.pathStore = Reflux.createStore({
    /*
     * simple store that keeps a hash of paths as keys and guids as values
     * well, they are kept in the pouch in localPathDb
     */
    listenables: Actions,

    onLoadPathStore (newItemsPassed) {
      // get existing paths
      addPathsFromItemsToLocalPathDb(newItemsPassed)
        .then(() => this.trigger(true))
        .catch((error) =>
          app.Actions.showError({title: 'pathStore: error adding paths from passed items:', msg: error})
        )
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
      return new Promise((resolve, reject) => {
        app.localFilterOptionsDb.allDocs({include_docs: true})
          .then((result) => {
            const filterOptions = result.rows.map((row) => row.doc)
            resolve(filterOptions)
          })
          .catch((error) =>
            reject('filterOptionsStore: error fetching filterOptions from localFilterOptionsDb:', error)
          )
      })
    },

    onLoadFilterOptionsStore () {
      const filterOptions = null
      const loading = true
      this.trigger({ filterOptions, loading })
    },

    onLoadFilterOptionsStoreCompleted (newItemsPassed) {
      let filterOptions = []
      // get existing filterOptions
      this.getOptions()
        .then((optionsFromPouch) => {
          filterOptions = filterOptions.concat(optionsFromPouch)
          if (newItemsPassed) filterOptions = filterOptions.concat(buildFilterOptions(newItemsPassed))
          const loading = false
          this.trigger({ filterOptions, loading })
        })
        .catch((error) =>
          app.Actions.showError({title: 'filterOptionsStore: error preparing trigger:', msg: error})
        )
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
          .then((synonymObjects) => {
            if (synonymObjects.length > 0) this.trigger(item, synonymObjects)
          })
          .catch((error) =>
            app.Actions.showError({title: 'activeObjectStore: error fetching synonyms of object:', msg: error})
          )
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
      return new Promise((resolve, reject) => {
        getGroupsLoadedFromLocalGroupsDb()
          .then((groupsLoaded) => resolve(groupsLoaded))
          .catch((error) =>
            reject('objectStore, groupsLoaded: error getting groups loaded:', error)
          )
      })
    },

    isGroupLoaded (gruppe) {
      return new Promise((resolve, reject) => {
        this.groupsLoaded()
          .then((groupsLoaded) => {
            const groupIsLoaded = _.includes(groupsLoaded, gruppe)
            resolve(groupIsLoaded)
          })
          .catch((error) =>
            reject('objectStore, isGroupLoaded: error getting groups loaded:', error)
          )
      })
    },

    onShowGroupLoading (objectPassed) {
      // groups: after loading all groups in parallel from remoteDb
      // need to pass a single action for all
      // otherwise 5 addGroupsLoadedToLocalGroupsDb calls occur at the same moment...
      const { group, allGroups, finishedLoading } = objectPassed
      const gruppen = getGruppen()

      getGroupsLoadedFromLocalGroupsDb()
        .then((groupsLoaded) => {
          // if an object with this group is contained in groupsLoading, remove it
          if (allGroups) {
            this.groupsLoading = []
          } else {
            this.groupsLoading = _.reject(this.groupsLoading, (groupObject) => groupObject.group === group)
          }
          // add the passed object, if it is not yet loaded
          if (!finishedLoading) {
            // add it to the beginning of the array
            this.groupsLoading.unshift(objectPassed)
          }
          groupsLoaded = allGroups ? gruppen : _.union(groupsLoaded, [group])
          if (finishedLoading) {
            // remove this group from groupsLoading
            this.groupsLoading = _.without(this.groupsLoading, group)
            // load next group if on is queued
            if (this.groupsLoading.length > 0) {
              // get group of last element
              const nextGroup = this.groupsLoading[this.groupsLoading.length - 1].group
              // load if
              loadGroupFromRemote(nextGroup)
                .then(() => Actions.loadObjectStore.completed(nextGroup))
                .catch((error) => {
                  const errorMsg = 'Actions.loadObjectStore, error loading group ' + nextGroup + ': ' + error
                  Actions.loadObjectStore.failed(errorMsg, nextGroup)
                })
            }
            // write change to groups loaded to localGroupsDb
            const groupsToPass = allGroups ? gruppen : [group]
            addGroupsLoadedToLocalGroupsDb(groupsToPass)
              .catch((error) =>
                app.Actions.showError({title: 'loadingGroupsStore, onShowGroupLoading, error adding group(s) to localGroupsDb:', msg: error})
              )
          }
          // inform views
          const payload = {
            groupsLoadingObjects: this.groupsLoading,
            groupsLoaded: groupsLoaded
          }
          this.trigger(payload)
        })
        .catch((error) =>
          app.Actions.showError({title: 'loadingGroupsStore, onShowGroupLoading, error getting groups loaded from localGroupsDb:', msg: error})
        )
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
      return new Promise((resolve, reject) => {
        getItemFromLocalDb(guid)
          .then((item) => {
            // if no item is found in localDb, get from remote
            // important on first load of an object url
            // in order for this to work, getItemFromLocalDb returns null when not finding the doc
            if (!item) return getItemFromRemoteDb(guid)
            return item
          })
          .then((item) => resolve(item))
          .catch((error) =>
            reject('objectStore, getItem: error getting item from guid' + guid + ': ', error)
          )
      })
    },

    getHierarchy () {
      return getHierarchyFromLocalHierarchyDb()
    },

    onLoadPouchFromRemoteCompleted () {
      this.getHierarchy()
        // trigger change so components can set loading state
        .then((hierarchy) => this.trigger(hierarchy))
        .catch((error) =>
          app.Actions.showError({title: 'objectStore, onLoadObjectStore, error getting data:', msg: error})
        )
    },

    onLoadPouchFromLocalCompleted (groupsLoadedInPouch) {
      Actions.loadFilterOptionsStore()
      this.getHierarchy()
        .then((hierarchy) => this.trigger(hierarchy))
    },

    onLoadPouchFromLocalFailed (error) {
      app.Actions.showError({title: 'objectStore: error loading objectStore from pouch:', msg: error})
    },

    onLoadObjectStore (gruppe) {
      this.getHierarchy()
        // trigger change so components can set loading state
        .then((hierarchy) => this.trigger(hierarchy))
        .catch((error) =>
          app.Actions.showError({title: 'objectStore, onLoadObjectStore, error getting data:', msg: error})
        )
    },

    onLoadObjectStoreCompleted (gruppe) {
      this.getHierarchy()
        .then((hierarchy) => this.trigger(hierarchy))
        .catch((error) =>
          app.Actions.showError({title: 'objectStore, onLoadObjectStore, error getting data:', msg: error})
        )
    },

    onLoadObjectStoreFailed (error, gruppe) {
      // remove loading indicator
      Actions.showGroupLoading({
        group: gruppe,
        finishedLoading: true
      })
      app.Actions.showError({title: 'objectStore: loading items failed with error:', msg: error})
    }
  })
}
