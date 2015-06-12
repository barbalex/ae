'use strict'

import app from 'ampersand-app'
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
    // problem: this action can get called several times while it is already fetching data
    // > make shure data is only fetched if faunaStore is not yet loaded and not loading right now
    if (!window.faunaStore.loaded && !app.loadingFaunaStore) {
      app.loadingFaunaStore = true
      // get fauna from db
      const db = new PouchDB(pouchUrl(), function (error, response) {
        if (error) { return console.log('error instantiating remote db') }
        db.query('artendb/faunaNachName', { include_docs: true }).then(function (result) {
          app.loadingFaunaStore = false
          const docs = result.rows.map(function (row) {
            return row.doc
          })
          Actions.loadFaunaStore.completed(docs)
        }).catch(function (error) {
          app.loadingFaunaStore = false
          Actions.loadFaunaStore.failed(error)
        })
      })
    }
  })

  Actions.showObject = Reflux.createAction()

  // Actions.transition = Reflux.createAction()

  // not needed but for testing useful:
  Actions.showObject.listen(function (object) {
    console.log('actions: showObject with object:', object)
  })

  /*Actions.transition.listen(function (params) {
    console.log('transition with params:', params)
  })*/

  return Actions
}
