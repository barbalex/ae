'use strict'

import app from 'ampersand-app'
import Reflux from 'reflux'
import PouchDB from 'pouchdb'
import pouchdbLoad from 'pouchdb-load'
import { difference } from 'lodash'
import getGruppen from './modules/gruppen.js'
import loadGroupFromRemote from './modules/loadGroupFromRemote.js'

// initualize pouchdb-load
PouchDB.plugin(pouchdbLoad)

// Each action is like an event channel for one specific event. Actions are called by components.
// The store is listening to all actions, and the components in turn are listening to the store.
// Thus the flow is: User interaction -> component calls action -> store reacts and triggers -> components update

export default () => {
  let Actions = Reflux.createActions({
    loadPouchFromRemote: {children: ['completed', 'failed']},
    loadPouchFromLocal: {},
    loadObject: {children: ['completed', 'failed']},
    loadActiveObject: {children: ['completed', 'failed']},
    loadFilterOptions: {},
    changeFilterOptionsForObject: {},
    loadPaths: {},
    changePathForObject: {},
    loadActivePath: {},
    login: {},
    showGroupLoading: {},
    showReloadingObjectDerivedData: {},
    queryTaxonomyCollections: {},
    queryPropertyCollections: {},
    queryRelationCollections: {},
    queryFields: {},
    deletePcByName: {},
    deleteRcByName: {},
    importPcs: {},
    importRcs: {},
    deletePcInstances: {},
    deleteRcInstances: {},
    showError: {},
    replicateToRemoteDb: {},
    replicateFromRemoteDb: {},
    buildExportData: {},
    getOrganizations: {},
    setActiveOrganization: {},
    updateActiveOrganization: {},
    removeUserFromActiveOrganization: {},
    getUsers: {},
    getPcsOfOrganization: {},
    getRcsOfOrganization: {},
    getTcsOfOrganization: {},
    saveObject: {},
    newObject: {},
    deleteObject: {},
    updateHierarchyForObject: {}
  })

  Actions.loadPouchFromRemote.listen(() => {
    const groups = getGruppen()
    let groupsLoading = []
    // get groups already loaded
    app.loadingGroupsStore.groupsLoaded()
      .then((groupsLoaded) => {
        groupsLoading = difference(groups, groupsLoaded)
        // load all groups not yet loaded
        groupsLoading.forEach((group) => Actions.loadObject(group))
      })
      .catch((error) => Actions.loadPouchFromRemote.failed('Actions.loadPouchFromRemote, error loading groups:', error))
  })

  Actions.loadObject.listen((gruppe) => {
    // make sure gruppe was passed
    if (!gruppe) return false
    // make sure a valid group was passed
    const gruppen = getGruppen()
    const validGroup = gruppen.includes(gruppe)
    if (!validGroup) return Actions.loadObject.failed('Actions.loadObject: the group passed is not valid', gruppe)

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
        .then(() => Actions.loadObject.completed(gruppe))
        .catch((error) => {
          const errorMsg = 'Actions.loadObject, error loading group ' + gruppe + ': ' + error
          Actions.loadObject.failed(errorMsg, gruppe)
        })
    }
  })

  Actions.loadActiveObject.listen((guid) => {
    // check if group is loaded > get object from objectStore
    if (!guid) {
      Actions.loadActiveObject.completed({})
    } else {
      app.objectStore.getObject(guid)
        // group is already loaded
        // pass object to activeObjectStore by completing action
        // if object is empty, store will have no item
        // so there is never a failed action
        .then((object) => Actions.loadActiveObject.completed(object))
        .catch((error) => {  // eslint-disable-line handle-callback-err
          // this group is not loaded yet
          // get Object from couch
          app.remoteDb.get(guid, { include_docs: true })
            .then((object) => Actions.loadActiveObject.completed(object))
            .catch((error) => app.Actions.showError({
              title: 'error fetching doc from remoteDb with guid ' + guid + ':',
              msg: error
            }))
        })
    }
  })

  return Actions
}
