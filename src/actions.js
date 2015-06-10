'use strict'

import Reflux from 'reflux'
import PouchDB from 'pouchdb'
import pouchUrl from './modules/getCouchUrl.js'

// Each action is like an event channel for one specific event. Actions are called by components.
// The store is listening to all actions, and the components in turn are listening to the store.
// Thus the flow is: User interaction -> component calls action -> store reacts and triggers -> components update

export default function () {
  // asyncResult creates child actions 'completed' and 'failed'
  let Actions

  Actions = Reflux.createActions({
    loadFaunaStore: {children: ['completed', 'failed']},
    showObject: {children: ['completed', 'failed']}
  })

  Actions.loadFaunaStore.listen(function () {
    // get fauna from db
    const db = new PouchDB(pouchUrl(), function (error, response) {
      if (error) { return console.log('error instantiating remote db') }
      db.query('artendb/faunaNachName', { include_docs: true }).then(function (result) {
        const docs = result.rows.map(function (row) {
          return row.doc
        })
        Actions.loadFaunaStore.completed(docs)
      }).catch(function (error) {
        Actions.loadFaunaStore.failed(error)
      })
    })
  })

  Actions.showObject = Reflux.createAction()

  Actions.showObject.listen(function (object) {
    console.log('actions: showObject with object:', object)
    // get the object
  })

  return Actions
}
