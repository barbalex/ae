'use strict'

import app from 'ampersand-app'

export default function (itemsArray) {
  app.localDb.bulkDocs(itemsArray)
    .then(function (result) {
      console.log('writeObjectStoreToPouch.js: result from writing objects to pouch:', result)
    })
    .catch(function (error) {
      console.log('error writing objects to pouch:', error)
    })
}
