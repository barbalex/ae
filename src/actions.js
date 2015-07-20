'use strict'

import app from 'ampersand-app'
import Reflux from 'reflux'
import PouchDB from 'pouchdb'
import pouchdbLoad from 'pouchdb-load'
import _ from 'lodash'
import buildHierarchy from './modules/buildHierarchy.js'
import getGruppen from './modules/gruppen.js'

// initualize pouchdb-load
PouchDB.plugin(pouchdbLoad)

// Each action is like an event channel for one specific event. Actions are called by components.
// The store is listening to all actions, and the components in turn are listening to the store.
// Thus the flow is: User interaction -> component calls action -> store reacts and triggers -> components update

export default function () {
  // asyncResult creates child actions 'completed' and 'failed'
  let Actions

  Actions = Reflux.createActions({
    loadPouch: {children: ['completed', 'failed']},
    loadObjectStore: {children: ['completed', 'failed']},
    loadActiveObjectStore: {children: ['completed', 'failed']},
    loadPathStore: {}
  })

  Actions.loadPouch.listen(function () {
    // get all items
    app.localDb.replicate.from(app.remoteDb)
      .then(function (result) {
        console.log('Actions.loadPouch, replication complete. result:', result)
        Actions.loadPouch.completed()
      })
      .catch(function (error) {
        console.log('Actions.loadPouch, replication error:', error)
      })
  })

  Actions.loadObjectStore.listen(function (gruppe) {
    // make sure gruppe was passed
    if (!gruppe) return false
    // make sure a valid group was passed
    const gruppen = getGruppen()
    const validGroup = _.includes(gruppen, gruppe)
    if (!validGroup) return false

    if (!app.objectStore.isGroupLoaded(gruppe) && !_.includes(app.objectStore.groupsLoading, gruppe) && gruppe) {
      // this group does not exist yet in the store
      let docId = 'ae_' + gruppe.toLowerCase()
      if (gruppe === 'Lebensräume') docId = 'ae_lr'
      if (gruppe === 'Macromycetes') docId = 'ae_pilze'
      const attachmentId = docId + '.txt'
      const url = window.location.protocol + '//' + window.location.hostname + ':5984/artendb/' + docId + '/' + attachmentId
      const qpGruppe = gruppe === 'Lebensräume' ? 'lr' : gruppe
      // get group from remoteDb
      app.localDb.load(url)
        .then(function () {
          return app.localDb.replicate.from(app.remoteDb, {
            filter: 'artendb/gruppe',
            query_params: {gruppe: qpGruppe}
          })
        })
        .then(function () {
          return app.localDb.allDocs({include_docs: true})
        })
        .then(function (result) {
          console.log('actions.loadObjectStore, result', result)
          // extract objects from result
          const itemsArray = result.rows.map(function (row) {
            return row.doc
          })
          // prepare payload and send completed event
          const hierarchy = buildHierarchy(itemsArray)
          const hierarchyOfGruppe = _.find(hierarchy, {'Name': gruppe})
          //   convert items-array to object with keys made of id's
          const items = _.indexBy(itemsArray, '_id')
          const payload = {
            gruppe: gruppe,
            items: items,
            hierarchy: hierarchyOfGruppe
          }
          Actions.loadObjectStore.completed(payload)
        })
        .catch(function (error) {
          Actions.loadObjectStore.failed(error, gruppe)
        })
    }
  })

  Actions.loadActiveObjectStore.listen(function (guid) {
    // check if group is loaded > get object from objectStore
    if (!guid) {
      Actions.loadActiveObjectStore.completed({})
    } else {
      const object = app.objectStore.items[guid]
      if (object) {
        // group is already loaded
        // pass object to activeObjectStore by completing action
        // if object is empty, store will have no item
        // so there is never a failed action
        Actions.loadActiveObjectStore.completed(object)
      } else {
        // this group is not loaded yet
        // get Object from couch
        app.remoteDb.get(guid, { include_docs: true })
          .then(function (object) {
            // dispatch action to load data of this group
            Actions.loadObjectStore(object.Gruppe)
            // wait until store changes
            Actions.loadActiveObjectStore.completed(object)
          })
          .catch(function (error) {
            console.log('error fetching doc from remoteDb with guid ' + guid + ':', error)
          })
      }
    }
  })

  return Actions
}
