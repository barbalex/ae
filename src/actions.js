'use strict'

import Reflux from 'reflux'
import PouchDB from 'pouchdb'
import pouchUrl from './modules/getCouchUrl.js'

  // Each action is like an event channel for one specific event. Actions are called by components.
  // The store is listening to all actions, and the components in turn are listening to the store.
  // Thus the flow is: User interaction -> component calls action -> store reacts and triggers -> components update

export default function () {
  // asyncResult creates child actions 'completed' and 'failed'
  let Actions = Reflux.createActions({
    initializeFaunaStore: {children: ['completed', 'failed']}
  })

  Actions.initializeFaunaStore.listen(function () {
    // get fauna from db
    const db = new PouchDB(pouchUrl(), function (error, response) {
      if (error) { return console.log('error instantiating remote db') }
      db.query('artendb/fauna').then(function (result) {
        Actions.initializeFaunaStore.completed(result)
      }).catch(function (error) {
        Actions.initializeFaunaStore.failed(error)
      })
    })
  })

  Actions.initializeFaunaStore.completed.listen(function (result) {
    console.log('result', result)
  })

  Actions.initializeFaunaStore.failed.listen(function (error) {
    console.log('error', error)
  })

  return Actions
}
