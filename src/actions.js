'use strict'

import app from 'ampersand-app'
import Reflux from 'reflux'
import PouchDB from 'pouchdb'
import pouchdbLoad from 'pouchdb-load'
import _ from 'lodash'
// import request from 'superagent'
import getGruppen from './modules/gruppen.js'
import getCouchUrl from './modules/getCouchUrl.js'

// initualize pouchdb-load
PouchDB.plugin(pouchdbLoad)

// Each action is like an event channel for one specific event. Actions are called by components.
// The store is listening to all actions, and the components in turn are listening to the store.
// Thus the flow is: User interaction -> component calls action -> store reacts and triggers -> components update

function objectFilterFunction (doc) {
  if (doc.Typ && doc.Typ === 'Objekt') return true
  return false
}

export default function () {
  let Actions = Reflux.createActions({
    loadPouchFromRemote: {children: ['completed', 'failed']},
    loadPouchFromLocal: {children: ['completed', 'failed']},
    loadObjectStore: {children: ['completed', 'failed']},
    loadActiveObjectStore: {children: ['completed', 'failed']},
    loadFilterOptionsStore: {children: ['completed', 'failed']},
    loadPathStore: {},
    loadActivePathStore: {}
  })

  Actions.loadPouchFromRemote.listen(function () {
    // console.log('Actions.loadPouchFromRemote active')
    // get all items
    const couchUrl = getCouchUrl()
    app.remoteDb.get('ae_objekte', {attachments: true})
      .then(function (doc) {
        // return null
        const attachmentBase64 = doc._attachments['ae_objekte.txt'].data
        const attachment = window.atob(attachmentBase64)
        // console.log('Actions.loadPouchFromRemote, attachment', attachment)
        if (!attachment) return null
        return app.localDb.load(attachment, {
          proxy: couchUrl,
          filter: objectFilterFunction
        })
      })
      .then(function () {
        // let regular replication catch up if objects have changed since dump was created
        return app.localDb.replicate.from(app.remoteDb)
      })
      .then(function () {
        console.log('Actions.loadPouchFromRemote completed')
        Actions.loadPouchFromRemote.completed()
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
    // console.log('Actions.loadObjectStore')
    // make sure gruppe was passed
    if (!gruppe) return false
    // make sure a valid group was passed
    const gruppen = getGruppen()
    const validGroup = _.includes(gruppen, gruppe)
    if (!validGroup) return Actions.loadObjectStore.failed('the group passed is not valid', gruppe)

    app.objectStore.isGroupLoaded(gruppe)
      .then(function (groupIsLoaded) {
        if (!groupIsLoaded) {
          // this group does not exist yet in the store
          const viewGruppePrefix = gruppe === 'Lebensräume' ? 'lr' : gruppe.toLowerCase()
          const viewName = 'artendb/' + viewGruppePrefix + 'NachName'
          // get group from remoteDb
          app.remoteDb.query(viewName, {include_docs: true})
            .then(function (result) {
              // extract objects from result
              const items = result.rows.map(function (row) {
                return row.doc
              })
              // prepare payload and send completed event
              const payload = {
                gruppe: gruppe,
                items: items
              }
              Actions.loadObjectStore.completed(payload)
              Actions.loadFilterOptionsStore(items)
            })
            .catch(function (error) {
              Actions.loadObjectStore.failed(error, gruppe)
            })
        }
      })
      .catch(function (error) {
        const errorMsg = 'Actions.loadObjectStore, error getting isGroupLoaded for group ' + gruppe + ': ' + error
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
