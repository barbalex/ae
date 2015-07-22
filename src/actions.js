'use strict'

import app from 'ampersand-app'
import Reflux from 'reflux'
import PouchDB from 'pouchdb'
import pouchdbLoad from 'pouchdb-load'
import _ from 'lodash'
import request from 'superagent'
import buildHierarchy from './modules/buildHierarchy.js'
import getGruppen from './modules/gruppen.js'
import getCouchUrl from './modules/getCouchUrl.js'

// initualize pouchdb-load
PouchDB.plugin(pouchdbLoad)

// Each action is like an event channel for one specific event. Actions are called by components.
// The store is listening to all actions, and the components in turn are listening to the store.
// Thus the flow is: User interaction -> component calls action -> store reacts and triggers -> components update

function filterFunction (doc) {
  if (doc.Typ && doc.Typ === 'Objekt') return true
  return false
}

export default function () {
  let Actions = Reflux.createActions({
    loadPouch: {children: ['completed', 'failed']},
    loadObjectStore: {children: ['completed', 'failed']},
    loadActiveObjectStore: {children: ['completed', 'failed']},
    loadPathStore: {}
  })

  Actions.loadPouch.listen(function () {
    // get all items
    const couchUrl = getCouchUrl()
    const url = couchUrl + '/ae_objekte/ae_objekte.txt'
    /*request
      .get(url)
      .end(function (error, res) {
        if (error) return console.log('Actions.loadPouch, error loading ' + url + ':', error)
        console.log('Actions.loadPouch, res', res)
        console.log('Actions.loadPouch, res.body', res.body)*/
    app.localDb.load(url, {
      proxy: couchUrl,
      filter: filterFunction
    })
    .then(function () {
      // let regular replication catch up if objects have changed since dump was created
      return app.localDb.replicate.from(app.remoteDb)
    })
    .then(function () {
      Actions.loadPouch.completed()
    })
    .catch(function (error) {
      console.log('Actions.loadPouch, replication error:', error)
    })
      // })
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
          const hierarchy = buildHierarchy(items)
          const hierarchyOfGruppe = _.find(hierarchy, {'Name': gruppe})
          //   convert items-array to object with keys made of id's
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
      const object = app.objectStore.getItem(guid)
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
