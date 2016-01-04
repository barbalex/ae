'use strict'

import Reflux from 'reflux'
import PouchDB from 'pouchdb'
import pouchdbLoad from 'pouchdb-load'

// initualize pouchdb-load
PouchDB.plugin(pouchdbLoad)

// Each action is like an event channel for one specific event. Actions are called by components.
// The store is listening to all actions, and the components in turn are listening to the store.
// Thus the flow is: User interaction -> component calls action -> store reacts and triggers -> components update

export default () => {
  let Actions = Reflux.createActions([
    'loadPouchFromRemote',
    'loadPouchFromLocal',
    'loadObject',
    'loadActiveObject',
    'loadFilterOptions',
    'changeFilterOptionsForObject',
    'loadPaths',
    'changePathForObject',
    'loadActivePath',
    'login',
    'showGroupLoading',
    'queryTaxonomyCollections',
    'queryPropertyCollections',
    'queryRelationCollections',
    'queryFields',
    'deletePcByName',
    'deleteRcByName',
    'importPcs',
    'importRcs',
    'deletePcInstances',
    'deleteRcInstances',
    'showError',
    'replicateToRemoteDb',
    'replicateFromRemoteDb',
    'buildExportData',
    'getOrganizations',
    'setActiveOrganization',
    'updateActiveOrganization',
    'removeUserFromActiveOrganization',
    'getUsers',
    'getPcsOfOrganization',
    'getRcsOfOrganization',
    'getTcsOfOrganization',
    'saveObject',
    'newObject',
    'deleteObject',
    'updateHierarchyForObject'
  ])

  return Actions
}
