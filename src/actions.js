'use strict'

import app from 'ampersand-app'
import Reflux from 'reflux'
import PouchDB from 'pouchdb'
import _ from 'lodash'
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
    // make shure gruppe was passed
    if (!gruppe) return false
    // problem: this action can get called several times while it is already fetching data
    // > make shure data is only fetched if objectStore is not yet loaded and not loading right now

    // console.log('actions loadObjectStore: gruppe:', gruppe)
    // console.log('actions loadObjectStore: window.objectStore.loaded[gruppe]:', window.objectStore.loaded[gruppe])

    // console.log('actions loadObjectStore: app.loadingObjectStore:', app.loadingObjectStore)
    // loadingObjectStore contains an Array of the groups being loaded right now
    app.loadingObjectStore = app.loadObjectStore || []

    if (!window.objectStore.loaded[gruppe] && !_.includes(app.loadingObjectStore, gruppe) && gruppe) {
      let objects = []
      app.loadingObjectStore.push(gruppe)
      const viewName = 'artendb/' + gruppe.toLowerCase() + 'NachName'
      // get fauna from db
      const db = new PouchDB(pouchUrl(), function (error, response) {
        if (error) { return console.log('error instantiating remote db') }
        // get fauna from db
        db.query(viewName, { include_docs: true })
          .then(function (result) {
            // extract objects from result
            objects = result.rows.map(function (row) {
              return row.doc
            })
            // build hierarchy
            const dsName = objects[0].Taxonomie.Name
            return db.query('artendb/dsMetadataNachDsName', { key: dsName, include_docs: true })
          })
          .then(function (result) {
            // extract metadata doc from result
            const doc = result.rows.map(function (row) {
              return row.doc
            })[0]

            // console.log('actions dsMetatata doc:', doc)

            // lookup type
            let hierarchyObject
            if (doc.HierarchieTyp === 'Felder') hierarchyObject = buildHierarchyObjectForFelder(objects, doc)
            if (doc.HierarchieTyp === 'Parent') { /* TODO */ }

            // console.log('actions.js: hierarchyObject:', hierarchyObject)
            // console.log('actions.js: gruppe:', gruppe)
            // console.log('actions.js: objects:', objects)

            Actions.loadObjectStore.completed(gruppe, objects, hierarchyObject)
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
