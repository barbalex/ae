'use strict'

import app from 'ampersand-app'
import Reflux from 'reflux'
import { difference, get, isEqual, reject, union, without } from 'lodash'
import getGroupsLoadedFromLocalDb from './modules/getGroupsLoadedFromLocalDb.js'
import getItemsFromLocalDb from './modules/getItemsFromLocalDb.js'
import getItemFromLocalDb from './modules/getItemFromLocalDb.js'
import getItemFromRemoteDb from './modules/getItemFromRemoteDb.js'
import getHierarchyFromLocalDb from './modules/getHierarchyFromLocalDb.js'
import addPathsFromItemsToLocalDb from './modules/addPathsFromItemsToLocalDb.js'
import buildFilterOptions from './modules/buildFilterOptions.js'
import getSynonymsOfObject from './modules/getSynonymsOfObject.js'
import addGroupsLoadedToLocalDb from './modules/addGroupsLoadedToLocalDb.js'
import getGruppen from './modules/gruppen.js'
import loadGroupFromRemote from './modules/loadGroupFromRemote.js'
import queryPcs from './queries/pcs.js'
import queryRcs from './queries/rcs.js'
import getPathFromGuid from './modules/getPathFromGuid.js'
import extractInfoFromPath from './modules/extractInfoFromPath.js'
import refreshUserRoles from './modules/refreshUserRoles.js'
import changePathOfObjectInLocalDb from './modules/changePathOfObjectInLocalDb.js'
import buildFilterOptionsFromObject from './modules/buildFilterOptionsFromObject.js'
import updateActivePathFromObject from './modules/updateActivePathFromObject.js'
import exportDataStore from './stores/exportData.js'
import changeRebuildingRedundantDataStore from './stores/changeRebuildingRedundantData.js'
import replicateFromRemoteDbStore from './stores/replicateFromRemoteDb.js'
import replicateToRemoteDbStore from './stores/replicateToRemoteDb.js'
import errorStore from './stores/error.js'
import organizationsStore from './stores/organizations.js'
import usersStore from './stores/users.js'
import objectsPcsStore from './stores/objectsPcs.js'
import objectsRcsStore from './stores/objectsRcs.js'
import fieldsStore from './stores/fields.js'
import taxonomyCollectionsStore from './stores/taxonomyCollections.js'
import propertyCollectionsStore from './stores/propertyCollections.js'

export default (Actions) => {
  app.exportDataStore = exportDataStore(Actions)

  app.changeRebuildingRedundantDataStore = changeRebuildingRedundantDataStore(Actions)

  app.replicateFromRemoteDbStore = replicateFromRemoteDbStore(Actions)

  app.replicateToRemoteDbStore = replicateToRemoteDbStore(Actions)

  app.errorStore = errorStore(Actions)

  app.usersStore = usersStore(Actions)

  app.organizationsStore = organizationsStore(Actions)

  app.objectsPcsStore = objectsPcsStore(Actions)

  app.objectsRcsStore = objectsRcsStore(Actions)

  app.fieldsStore = fieldsStore(Actions)

  app.taxonomyCollectionsStore = taxonomyCollectionsStore(Actions)

  app.propertyCollectionsStore = propertyCollectionsStore(Actions)

  app.relationCollectionsStore = Reflux.createStore({
    /*
     * queries relation collections
     * keeps last query result in pouch (_local/rcs.rcs) for fast delivery
     * app.js sets default _local/rcs.rcs = [] if not exists on app start
     * rc's are arrays of the form:
     * [collectionType, rcName, combining, organization, {Beschreibung: xxx, Datenstand: xxx, Link: xxx, Nutzungsbedingungen: xxx}, count: xxx]
     *
     * when this store triggers it passes two variables:
     * rcs: the relation collections
     * rcsQuerying: true/false: are rcs being queryied? if true: show warning in symbols
     */
    listenables: Actions,

    rcsQuerying: false,

    getRcs () {
      return new Promise((resolve, reject) => {
        app.localDb.get('_local/rcs')
          .then((doc) => resolve(doc.rcs))
          .catch((error) =>
            reject('userStore: error getting relation collections from localDb: ' + error)
          )
      })
    },

    saveRc (rc) {
      let rcs
      app.localDb.get('_local/rcs')
        .then((doc) => {
          doc.rcs.push(rc)
          doc.rcs = doc.rcs.sort((rc) => rc.name)
          rcs = doc.rcs
          return app.localDb.put(doc)
        })
        .then(() => this.trigger(rcs, this.rcsQuerying))
        .catch((error) =>
          app.Actions.showError({title: 'Fehler in relationCollectionsStore, saveRc:', msg: error})
        )
    },

    saveRcs (rcs) {
      app.localDb.get('_local/rcs')
        .then((doc) => {
          doc.rcs = rcs
          return app.localDb.put(doc)
        })
        .catch((error) =>
          app.Actions.showError({title: 'Fehler in relationCollectionsStore, saveRcs:', msg: error})
        )
    },

    removeRcByName (name) {
      let rcs
      app.localDb.get('_local/rcs')
        .then((doc) => {
          doc.rcs = reject(doc.rcs, (rc) => rc.name === name)
          rcs = doc.rcs
          return app.localDb.put(doc)
        })
        .then(() => this.trigger(rcs, this.rcsQuerying))
        .catch((error) =>
          app.Actions.showError({title: 'Fehler in relationCollectionsStore, removeRcByName:', msg: error})
        )
    },

    getRcByName (name) {
      return new Promise((resolve, reject) => {
        this.getRcs()
          .then((rcs) => {
            const rc = rcs.find((rc) => rc.name === name)
            resolve(rc)
          })
          .catch((error) => reject(error))
      })
    },

    onQueryRelationCollections (offlineIndexes) {
      // if rc's exist, send them immediately
      this.rcsQuerying = true
      this.getRcs()
        .then((rcs) => this.trigger(rcs, this.rcsQuerying))
        .catch((error) =>
          app.Actions.showError({title: 'relationCollectionsStore, error getting existing rcs:', msg: error})
        )
      // now fetch up to date rc's
      queryRcs(offlineIndexes)
        .then((rcs) => {
          this.rcsQuerying = false
          this.trigger(rcs, this.rcsQuerying)
          return this.saveRcs(rcs)
        })
        .catch((error) =>
          app.Actions.showError({title: 'relationCollectionsStore, error querying up to date rcs:', msg: error})
        )
    }
  })

  app.userStore = Reflux.createStore({
    /*
     * contains email and roles of logged in user
     * well, it is saved in pouch as local doc _local/login
     * and contains "logIn" bool which states if user needs to log in
     * app.js sets default _local/login if not exists on app start
     */
    listenables: Actions,

    getLogin () {
      return new Promise((resolve, reject) => {
        app.localDb.get('_local/login')
          .then((doc) => {
            refreshUserRoles(doc.email)
            resolve(doc)
          })
          .catch((error) =>
            reject('userStore: error getting login from localDb: ' + error)
          )
      })
    },

    onLogin ({ logIn, email, roles }) {
      app.localDb.get('_local/login')
        .then((doc) => {
          doc.logIn = logIn
          doc.email = email || undefined
          doc.roles = roles || []
          this.trigger({ logIn, email, roles })
          /*
           * need to requery organizations if they have been loaded
           * because isUserAdmin needs to be updated
           */
          if (email && app.organizationsStore.organizations.length > 0) app.Actions.getOrganizations(email)
          return app.localDb.put(doc)
        })
        .catch((error) =>
          app.Actions.showError({title: 'userStore: error logging in:', msg: error})
        )
    }
  })

  app.pathStore = Reflux.createStore({
    /*
     * simple store that keeps a hash of paths as keys and guids as values
     * well, they are kept in the pouch in localDb
     */
    listenables: Actions,

    onLoadPaths (newItemsPassed) {
      // get existing paths
      addPathsFromItemsToLocalDb(newItemsPassed)
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
     * well, they are kept in localDb in _local/filterOptions
    */
    listenables: Actions,

    getOptions () {
      return new Promise((resolve, reject) => {
        app.localDb.get('_local/filterOptions')
          .then((doc) => resolve(doc.filterOptions))
          .catch((error) =>
            reject('filterOptionsStore: error fetching filterOptions from localDb:', error)
          )
      })
    },

    onLoadFilterOptions (newItemsPassed) {
      this.trigger({
        filterOptions: null,
        loading: true
      })
      // get existing filterOptions
      this.getOptions()
        .then((optionsFromPouch) => {
          let filterOptions = optionsFromPouch
          if (newItemsPassed) filterOptions = filterOptions.concat(buildFilterOptions(newItemsPassed))
          const loading = false
          this.trigger({ filterOptions, loading })
        })
        .catch((error) =>
          app.Actions.showError({title: 'filterOptionsStore: error preparing trigger:', msg: error})
        )
    },

    onChangeFilterOptionsForObject (object) {
      const option = buildFilterOptionsFromObject(object)
      let options = null
      app.localDb.get('_local/filterOptions')
        .then((doc) => {
          // replace option with new
          doc.filterOptions = doc.filterOptions.filter((op) => op.value !== object._id)
          doc.filterOptions.push(option)
          options = doc.filterOptions
          return app.localDb.put(doc)
        })
        .then(() => this.trigger({ options: options, loading: false }))
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

    onLoadActivePath (path, guid) {
      // only change if something has changed
      if (this.guid !== guid || !isEqual(this.path, path)) {
        this.guid = guid
        this.path = path
        const { gruppe, mainComponent } = extractInfoFromPath(path)
        this.trigger({ path, guid, gruppe, mainComponent })
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

    onLoadActiveObject (guid) {
      // check if group is loaded > get object from objectStore
      if (!guid) {
        this.onLoadActiveObjectCompleted({})
      } else {
        app.objectStore.getObject(guid)
          // group is already loaded
          // pass object to activeObjectStore by completing action
          // if object is empty, store will have no item
          // so there is never a failed action
          .then((object) => this.onLoadActiveObjectCompleted(object))
          .catch((error) => {  // eslint-disable-line handle-callback-err
            // this group is not loaded yet
            // get Object from couch
            app.remoteDb.get(guid)
              .then((object) => this.onLoadActiveObjectCompleted(object))
              .catch((error) => app.Actions.showError({
                title: 'error fetching doc from remoteDb with guid ' + guid + ':',
                msg: error
              }))
          })
      }
    },

    onLoadActiveObjectCompleted (item) {
      // only change if active item has changed
      if (!isEqual(item, this.item)) {
        // item can be an object or {}
        this.item = item
        this.loaded = Object.keys(item).length > 0
        // tell views that data has changed
        this.trigger(item, [])
        // load path for this object...
        if (item && item._id) {
          getPathFromGuid(item._id)
            .then(({ path, url }) => {
              // ...if it differs from the loaded path
              if (!isEqual(app.activePathStore.path, path)) app.Actions.loadActivePath(path, item._id)
              // now check for synonym objects
              return getSynonymsOfObject(item)
            })
            .then((synonymObjects) => {
              // if they exist: trigger again and pass synonyms
              if (synonymObjects.length > 0) this.trigger(item, synonymObjects)
            })
            .catch((error) =>
              app.Actions.showError({title: 'activeObjectStore: error fetching synonyms of object:', msg: error})
            )
        }
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
        getGroupsLoadedFromLocalDb()
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
            const groupIsLoaded = groupsLoaded.includes(gruppe)
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
      // otherwise 5 addGroupsLoadedToLocalDb calls occur at the same moment...
      const { group, allGroups, finishedLoading } = objectPassed
      const gruppen = getGruppen()
      let groupsLoaded

      getGroupsLoadedFromLocalDb()
        .then((gl) => {
          groupsLoaded = gl
          // if an object with this group is contained in groupsLoading, remove it
          if (allGroups) {
            this.groupsLoading = []
          } else {
            this.groupsLoading = reject(this.groupsLoading, (groupObject) => groupObject.group === group)
          }
          // add the passed object, if it is not yet loaded
          if (!finishedLoading) {
            // add it to the beginning of the array
            this.groupsLoading.unshift(objectPassed)
          }
          groupsLoaded = allGroups ? gruppen : union(groupsLoaded, [group])
          if (finishedLoading) {
            // remove this group from groupsLoading
            this.groupsLoading = without(this.groupsLoading, group)
            // load next group if on is queued
            if (this.groupsLoading.length > 0) {
              // get group of last element
              const nextGroup = this.groupsLoading[this.groupsLoading.length - 1].group
              // load if
              loadGroupFromRemote(nextGroup)
                .then(() => app.objectStore.getHierarchy())
                .catch((error) => {
                  const errorMsg = 'Actions.loadObject, error loading group ' + nextGroup + ': ' + error
                  app.objectStore.onLoadObjectFailed(errorMsg, nextGroup)
                })
            }
            // write change to groups loaded to localDb
            const groupsToPass = allGroups ? gruppen : [group]
            addGroupsLoadedToLocalDb(groupsToPass)
              .catch((error) =>
                app.Actions.showError({title: 'loadingGroupsStore, onShowGroupLoading, error adding group(s) to localDb:', msg: error})
              )
          }
          // inform views
          const payload = {
            groupsLoadingObjects: this.groupsLoading,
            groupsLoaded: groupsLoaded
          }
          this.trigger(payload)
        })
        .then(() => {
          // if all groups are loaded, replicate
          // uncommented because leaded to errors
          // TODO: use action
          if (gruppen.length === groupsLoaded.length && finishedLoading) {
            app.Actions.replicateFromRemoteDb('thenToRemoteDb')
            /*
            app.localDb.replicate.from(app.remoteDb, { batch_size: 500 })
              .then(() => app.localDb.replicate.to(app.remoteDb, { batch_size: 500 }))
              .catch((error) => console.log('error replicating', error))*/
          }
        })
        .catch((error) =>
          app.Actions.showError({title: 'loadingGroupsStore, onShowGroupLoading, error getting groups loaded from localDb:', msg: error})
        )
    }
  })

  app.objectStore = Reflux.createStore({
    /*
     * keeps an array of objects, of hierarchy objects and of groups loaded (i.e. their names)
     * they are managed with the same store (but different databases)
     * because they depend on each other / always change together
     *
     * objects are kept in the pouch in localDb,
     * hierarchies in localDb,
     * groups in localDb
    */
    listenables: Actions,

    // getObjects and getObject get Object(s) from pouch if loaded
    getObjects () {
      return getItemsFromLocalDb()
    },

    getObject (guid) {
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
            reject('objectStore, getObject: error getting item from guid' + guid + ': ', error)
          )
      })
    },

    onSaveObject (object, oldObject) {
      /**
       * 1. write object to localDb
       * 2. update object rev
       * 3. if object is active: update activeObjectStore
       * 4. replace path in pathStore
       * 5. replace path in activePathStore
       * 5. replace filter options in filterOptionsStore
       * 6. update hierarchy
       * 7. replicate changes to remoteDb
       */

      // 1. write object to localDb
      app.localDb.put(object)
        .then((result) => {
          // 2. update object rev
          object._rev = result.rev
          // 3. if object is active: update activeObjectStore
          const objectIsActive = app.activeObjectStore.item && app.activeObjectStore.item._id && app.activeObjectStore.item._id === object._id
          if (objectIsActive) app.Actions.loadActiveObject(object._id)
          // 4. replace path in pathStore
          changePathOfObjectInLocalDb(object)
          updateActivePathFromObject(object)
          // 5. replace filter options in filterOptionsStore
          app.Actions.changeFilterOptionsForObject(object)
          // 6. update hierarchy
          this.updateHierarchyForObject(object)
          // 7. replicate changes to remoteDb
          app.Actions.replicateToRemoteDb()
        })
        .catch((error) => {
          app.Actions.showError({ title: 'objectStore: error saving object:', msg: error })
        })
    },

    getHierarchy () {
      getHierarchyFromLocalDb()
        .then((hierarchy) => this.trigger(hierarchy))
        .catch((error) =>
          app.Actions.showError({title: 'objectStore, error getting hierarchy:', msg: error})
        )
    },

    updateHierarchieInChildObject (guid, index, name) {
      this.getObject(guid)
        .then((object) => {
          const taxonomies = object.Taxonomien
          if (taxonomies) {
            const taxonomy = taxonomies.find((taxonomy) => taxonomy.Standardtaxonomie)
            if (taxonomy) {
              const hierarchy = get(taxonomy, 'Eigenschaften.Hierarchie')
              if (hierarchy && hierarchy.length && hierarchy.length > 0 && hierarchy[index] && hierarchy[index].Name) {
                hierarchy[index].Name = name
                return app.localDb.put(object)
              }
            }
          }
        })
        .catch((error) => app.Actions.showError({ title: 'objectStore: error updating hierarchy in child object:', msg: error }))
    },

    updateChildrensPath (child, index, name) {
      // 1. update path of child
      child.path[index] = name
      // 2. update Hierarchie in child object
      if (child.GUID) this.updateHierarchieInChildObject(child.GUID, index - 1, name)
      // 3. update it's children
      const children = child.children
      if (children && children.length && children.length > 0) {
        children.forEach((child) => this.updateChildrensPath(child, index, name))
      }
    },

    updateHierarchyForObject (object) {
      // if lr need to update names in child lr's hierarchies
      // idea: use _local/hierarchy and follow its hierarchy down
      // then change _local/hierarchy AND the objects themselves
      const taxonomies = object.Taxonomien
      const group = object.Gruppe

      if (group && taxonomies) {
        const taxonomy = taxonomies.find((taxonomy) => taxonomy.Standardtaxonomie)
        if (taxonomy) {
          const objectHierarchy = get(taxonomy, 'Eigenschaften.Hierarchie')
          if (objectHierarchy && objectHierarchy.length && objectHierarchy.length > 0) {
            const objectHierarchyObject = objectHierarchy[objectHierarchy.length - 1]
            if (objectHierarchyObject && objectHierarchyObject.Name && objectHierarchyObject.GUID) {
              let globalHierarchy
              app.localDb.get('_local/hierarchy')
                .then((doc) => {
                  globalHierarchy = doc.hierarchy
                  // drill down to this object's hierarchy
                  const gruppeHierarchy = globalHierarchy.find((h) => h.Name === group)
                  let hierarchyPart = gruppeHierarchy
                  objectHierarchy.forEach((hO, index) => {
                    if (hO.GUID) {
                      hierarchyPart = hierarchyPart.children.find((child) => child.GUID === hO.GUID)
                    } else {
                      // non-LR: upper hierarchy levels have no guid
                      hierarchyPart = hierarchyPart.children.find((child) => child.Name === hO.Name)
                    }
                  })
                  // update Name
                  hierarchyPart.Name = objectHierarchyObject.Name
                  // now update path Name in all childrens hierarchy objects
                  let children = hierarchyPart.children
                  if (children && children.length && children.length > 0) {
                    children.forEach((child) =>
                      this.updateChildrensPath(child, objectHierarchy.length, objectHierarchyObject.Name)
                    )
                  }
                  // save doc
                  return app.localDb.put(doc)
                })
                .then(() => this.trigger(globalHierarchy))
                .catch((error) =>
                  reject('objectStore: error updating hierarchy for object: ' + error)
                )
            }
          }
        }
      }
    },

    onLoadPouchFromLocal (groupsLoadedInPouch) {
      Actions.loadFilterOptions()
      this.getHierarchy()
    },

    onLoadPouchFromRemote () {
      const groups = getGruppen()
      let groupsLoading = []
      // get groups already loaded
      app.loadingGroupsStore.groupsLoaded()
        .then((groupsLoaded) => {
          groupsLoading = difference(groups, groupsLoaded)
          // load all groups not yet loaded
          groupsLoading.forEach((group) => Actions.loadObject(group))
        })
        .catch((error) => app.Actions.showError({
          title: 'Actions.loadPouchFromRemote, error loading groups:',
          msg: error
        }))
    },

    onLoadObject (gruppe) {
      // make sure gruppe was passed
      if (!gruppe) return false
      // make sure a valid group was passed
      const gruppen = getGruppen()
      const validGroup = gruppen.includes(gruppe)
      if (!validGroup) return this.onLoadObjectFailed('Actions.loadObject: the group passed is not valid', gruppe)

      // app.loadingGroupsStore.groupsLoading is a task list that is worked off one by one
      // if a loadGroupFromRemote call is started while the last is still active, bad things happen
      // > add this group to the tasklist
      const groupsLoadingObject = {
        group: gruppe,
        message: 'Werde ' + gruppe + ' laden...'
      }
      app.loadingGroupsStore.groupsLoading.unshift(groupsLoadingObject)
      // check if there are groups loading now
      // if yes: when finished, loadGroupFromRemote will begin loading the next group in the queue
      if (app.loadingGroupsStore.groupsLoading.length === 1) {
        // o.k., no other group is being loaded - go on
        loadGroupFromRemote(gruppe)
          .then(() => this.getHierarchy())
          .catch((error) => {
            const errorMsg = 'Actions.loadObject, error loading group ' + gruppe + ': ' + error
            this.onLoadObjectFailed(errorMsg, gruppe)
          })
      }
    },

    onLoadObjectFailed (error, gruppe) {
      // remove loading indicator
      Actions.showGroupLoading({
        group: gruppe,
        finishedLoading: true
      })
      app.Actions.showError({title: 'objectStore: loading items failed with error:', msg: error})
    }
  })
}
