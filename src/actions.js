'use strict'

import Reflux from 'reflux'
import PouchDB from 'pouchdb'
import _ from 'lodash'
import pouchUrl from './modules/getCouchUrl.js'
import buildHierarchyObjectForGruppe from './modules/buildHierarchyObjectForGruppe'
import getGruppen from './modules/gruppen.js'

// Each action is like an event channel for one specific event. Actions are called by components.
// The store is listening to all actions, and the components in turn are listening to the store.
// Thus the flow is: User interaction -> component calls action -> store reacts and triggers -> components update

export default function () {
  // asyncResult creates child actions 'completed' and 'failed'
  let Actions

  Actions = Reflux.createActions({
    loadObjectStore: {children: ['completed', 'failed']},
    loadActiveObjectStore: {children: ['completed', 'failed']},
    loadPathStore: {}
  })

  Actions.loadObjectStore.listen(function (gruppe) {
    // make sure gruppe was passed
    if (!gruppe) return false
    // make sure a valid group was passed
    const gruppen = getGruppen()
    const validGroup = _.includes(gruppen, gruppe)
    if (!validGroup) return false

    if (!window.objectStore.isGroupLoaded(gruppe) && !_.includes(window.objectStore.groupsLoading, gruppe) && gruppe) {
      let itemsArray = []
      const viewGruppePrefix = gruppe === 'Lebensräume' ? 'lr' : gruppe.toLowerCase()
      const viewName = 'artendb/' + viewGruppePrefix + 'NachName'
      // get fauna from db
      const db = new PouchDB(pouchUrl(), function (error, response) {
        if (error) { return console.log('error instantiating remote db') }
        // get fauna from db
        db.query(viewName, { include_docs: true })
          .then(function (result) {
            // extract objects from result
            itemsArray = result.rows.map(function (row) {
              return row.doc
            })
            // prepare payload and send completed event
            const hierarchy = buildHierarchyObjectForGruppe(itemsArray, gruppe)
            //   convert items-array to object with keys made of id's
            const items = _.indexBy(itemsArray, '_id')
            const payload = {
              gruppe: gruppe,
              items: items,
              hierarchy: hierarchy
            }
            Actions.loadObjectStore.completed(payload)
          })
          .catch(function (error) {
            Actions.loadObjectStore.failed(error, gruppe)
          })
      })
    }
  })

  Actions.loadActiveObjectStore.listen(function (guid) {
    console.log('Actions.loadActiveObjectStore, guid', guid)
    // check if group is loaded > get object from objectStore
    if (!guid) {
      Actions.loadActiveObjectStore.completed({})
    } else {
      const object = window.objectStore.items[guid]
      console.log('Actions.loadActiveObjectStore, object', object)
      if (object) {
        // group is already loaded
        // pass object to activeObjectStore by completing action
        // if object is empty, store will have no item
        // so there is never a failed action
        Actions.loadActiveObjectStore.completed(object)
      } else {
        // this group is not loaded yet
        // get Object from couch
        const couchUrl = pouchUrl()
        const db = new PouchDB(couchUrl, function (error, response) {
          if (error) { return console.log('error instantiating remote db: ', error) }
          db.get(guid, { include_docs: true })
            .then(function (object) {
              // dispatch action to load data of this group
              Actions.loadObjectStore(object.Gruppe)
              // wait until store changes
              Actions.loadActiveObjectStore.completed(object)
            })
            .catch(function (error) {
              console.log('error fetching doc from ' + couchUrl + ' with guid ' + guid + ':', error)
            })
        })
      }
    }
  })

  return Actions
}
