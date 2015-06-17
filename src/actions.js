'use strict'

import app from 'ampersand-app'
import Reflux from 'reflux'
import PouchDB from 'pouchdb'
import pouchUrl from './modules/getCouchUrl.js'
import buildHierarchyObjectForFelder from './modules/buildHierarchyObjectForFelder.js'

// Each action is like an event channel for one specific event. Actions are called by components.
// The store is listening to all actions, and the components in turn are listening to the store.
// Thus the flow is: User interaction -> component calls action -> store reacts and triggers -> components update

export default function () {
  // asyncResult creates child actions 'completed' and 'failed'
  let Actions

  Actions = Reflux.createActions({
    loadObjectStore: {children: ['completed', 'failed']},
    showObject: {children: ['completed', 'failed']}
  })

  Actions.loadObjectStore.listen(function (gruppe) {
    // problem: this action can get called several times while it is already fetching data
    // > make shure data is only fetched if objectStore is not yet loaded and not loading right now
    if (!window.objectStore.loaded && !app.loadingObjectStore && gruppe) {
      let objects = []
      app.loadingObjectStore = true
      // get fauna from db
      const db = new PouchDB(pouchUrl(), function (error, response) {
        if (error) { return console.log('error instantiating remote db') }
        // get fauna from db
        db.query('artendb/faunaNachName', { include_docs: true })
          .then(function (result) {
            // extract objects from result
            app.loadingObjectStore = false
            objects = result.rows.map(function (row) {
              return row.doc
            })

            // build hierarchy
            const object0 = objects[0]
            const Gruppe = object0.Gruppe
            const dsName = object0.Taxonomie.Name
            const dsMetadataId = (Gruppe + '_' + dsName).replace(':', '_').replace(' ', '_')

            return db.get(dsMetadataId, { include_docs: true })
          })
          .then(function (doc) {

            // lookup type
            let hierarchyObject
            if (doc.HierarchieTyp === 'Felder') hierarchyObject = buildHierarchyObjectForFelder(objects, doc)
            if (doc.HierarchieTyp === 'Parent') { /* TODO */ }

            Actions.loadObjectStore.completed(objects, hierarchyObject, gruppe)
          })
          .catch(function (error) {
            app.loadingObjectStore = false
            Actions.loadObjectStore.failed(error)
          })
      })
    }
  })

  Actions.showObject = Reflux.createAction()

  // not needed but for testing useful:
  Actions.showObject.listen(function (object) {
    console.log('actions: showObject with object:', object)
  })

  return Actions
}
