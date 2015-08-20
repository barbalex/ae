'use strict'

import app from 'ampersand-app'
import Reflux from 'reflux'
import PouchDB from 'pouchdb'
import pouchdbLoad from 'pouchdb-load'
import _ from 'lodash'
import getGruppen from './modules/gruppen.js'
import loadGroupFromRemote from './modules/loadGroupFromRemote.js'

// initualize pouchdb-load
PouchDB.plugin(pouchdbLoad)

// Each action is like an event channel for one specific event. Actions are called by components.
// The store is listening to all actions, and the components in turn are listening to the store.
// Thus the flow is: User interaction -> component calls action -> store reacts and triggers -> components update

export default function () {
  let Actions = Reflux.createActions({
    loadPouchFromRemote: {children: ['completed', 'failed']},
    loadPouchFromLocal: {children: ['completed', 'failed']},
    loadObjectStore: {children: ['completed', 'failed']},
    loadActiveObjectStore: {children: ['completed', 'failed']},
    loadFilterOptionsStore: {children: ['completed', 'failed']},
    loadPathStore: {},
    loadActivePathStore: {},
    login: {}
  })

  Actions.loadPouchFromRemote.listen(function () {
    const groups = getGruppen()
    let groupsLoading = []
    // get groups already loaded
    app.objectStore.groupsLoaded()
      .then(function (groupsLoaded) {
        groupsLoading = _.difference(groups, groupsLoaded)
        // get all items
        return Promise.all(groupsLoading.map(function (group) {
          return loadGroupFromRemote(group)
        }))
      })
      .then(function () {
        return Actions.loadPouchFromRemote.completed(groupsLoading)
      })
      .catch(function (error) {
        Actions.loadPouchFromRemote.failed('Actions.loadPouchFromRemote, replication error:', error)
      })
  })

  Actions.loadFilterOptionsStore.listen(function (items) {
    Actions.loadFilterOptionsStore.completed(items)
  })

  Actions.loadPouchFromLocal.listen(function (groupsLoadedInPouch) {
    Actions.loadPouchFromLocal.completed(groupsLoadedInPouch)
  })

  Actions.loadObjectStore.listen(function (gruppe) {
    // make sure gruppe was passed
    if (!gruppe) return false
    // make sure a valid group was passed
    const gruppen = getGruppen()
    const validGroup = _.includes(gruppen, gruppe)
    if (!validGroup) return Actions.loadObjectStore.failed('Actions.loadObjectStore: the group passed is not valid', gruppe)

    loadGroupFromRemote(gruppe)
      .then(function () {
        // let regular replication catch up if objects have changed since dump was created
        return app.localDb.replicate.from(app.remoteDb, {
          filter: function (doc) {
            return (doc.Gruppe && doc.Gruppe === gruppe)
          },
          batch_size: 500
        })
      })
      .then(function () {
        return Actions.loadObjectStore.completed(gruppe)
      })
      .catch(function (error) {
        const errorMsg = 'Actions.loadObjectStore, error loading group ' + gruppe + ': ' + error
        Actions.loadObjectStore.failed(errorMsg, gruppe)
      })
  })

  Actions.loadActiveObjectStore.listen(function (guid) {
    // check if group is loaded > get object from objectStore
    if (!guid) {
      Actions.loadActiveObjectStore.completed({})
    } else {
      app.objectStore.getItem(guid)
        .then(function (object) {
          // group is already loaded
          // pass object to activeObjectStore by completing action
          // if object is empty, store will have no item
          // so there is never a failed action
          Actions.loadActiveObjectStore.completed(object)
        })
        .catch(function (error) {
          // this group is not loaded yet
          // get Object from couch
          app.remoteDb.get(guid, { include_docs: true })
            .then(function (object) {
              Actions.loadActiveObjectStore.completed(object)
            })
            .catch(function (error) {
              console.log('error fetching doc from remoteDb with guid ' + guid + ':', error)
            })
        })
    }
  })

  return Actions
}
