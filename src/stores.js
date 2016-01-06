'use strict'

import app from 'ampersand-app'
import Reflux from 'reflux'
import { difference, get, reject, union, without } from 'lodash'
import getGroupsLoadedFromLocalDb from './modules/getGroupsLoadedFromLocalDb.js'
import getItemsFromLocalDb from './modules/getItemsFromLocalDb.js'
import getItemFromLocalDb from './modules/getItemFromLocalDb.js'
import getItemFromRemoteDb from './modules/getItemFromRemoteDb.js'
import getHierarchyFromLocalDb from './modules/getHierarchyFromLocalDb.js'
import addGroupsLoadedToLocalDb from './modules/addGroupsLoadedToLocalDb.js'
import getGruppen from './modules/gruppen.js'
import loadGroupFromRemote from './modules/loadGroupFromRemote.js'
import changePathOfObjectInLocalDb from './modules/changePathOfObjectInLocalDb.js'
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
import relationCollectionsStore from './stores/relationCollections.js'
import userStore from './stores/user.js'
import pathStore from './stores/path.js'
import filterOptionsStore from './stores/filterOptions.js'
import activePathStore from './stores/activePath.js'
import activeObjectStore from './stores/activeObject.js'
import loadingGroupsStore from './stores/loadingGroups.js'

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

  app.relationCollectionsStore = relationCollectionsStore(Actions)

  app.userStore = userStore(Actions)

  app.pathStore = pathStore(Actions)

  app.filterOptionsStore = filterOptionsStore(Actions)

  app.activePathStore = activePathStore(Actions)

  app.activeObjectStore = activeObjectStore(Actions)

  app.loadingGroupsStore = loadingGroupsStore(Actions)

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
