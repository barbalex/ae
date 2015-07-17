'use strict'

import PouchDB from 'pouchdb'

export default function (itemsArray) {
  const db = new PouchDB('ae', function (error) {
    if (error) return console.log('error opening pouch ae:', error)
    console.log('writeObjectStoreToPouch.js: itemsArray:', itemsArray)
    db.bulkDocs(itemsArray)
      .then(function (result) {
        console.log('writeObjectStoreToPouch.js: result from writing objects to pouch:', result)
      })
      .catch(function (error) {
        console.log('error writing objects to pouch:', error)
      })
  })
}
