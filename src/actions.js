'use strict'

import app from 'ampersand-app'
import Reflux from 'reflux'
import PouchDB from 'pouchdb'
import pouchdbLoad from 'pouchdb-load'
import { difference } from 'lodash'
import getGruppen from './modules/gruppen.js'

// initualize pouchdb-load
PouchDB.plugin(pouchdbLoad)

// Each action is like an event channel for one specific event. Actions are called by components.
// The store is listening to all actions, and the components in turn are listening to the store.
// Thus the flow is: User interaction -> component calls action -> store reacts and triggers -> components update

export default () => {
  let Actions = Reflux.createActions({
    loadPouchFromRemote: {},
    loadPouchFromLocal: {},
    loadObject: {},
    loadActiveObject: {children: ['completed', 'failed']},
    loadFilterOptions: {},
    changeFilterOptionsForObject: {},
    loadPaths: {},
    changePathForObject: {},
    loadActivePath: {},
    login: {},
    showGroupLoading: {},
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
      .catch((error) => app.Actions.showError({
        title: 'Actions.loadPouchFromRemote, error loading groups:',
        msg: error
      }))
  })

  return Actions
}
