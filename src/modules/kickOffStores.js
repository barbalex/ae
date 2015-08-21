'use strict'

import app from 'ampersand-app'
import getPathFromGuid from './getPathFromGuid.js'

export default function (path, gruppe, guid) {
  if (guid) {
    getPathFromGuid(guid)
      .then(function (result) {
        const path = result.path
        return app.Actions.loadActivePathStore(path, guid)
      })
      .then(function () {
        return app.Actions.loadActiveObjectStore(guid)
      })
      .catch(function (error) {
        console.log('kickOffStores.js: error loading active object store or getting path for guid ' + guid + ':', error)
      })
  } else {
    app.Actions.loadActivePathStore(path, guid)
  }
  if (gruppe) app.Actions.loadObjectStore(gruppe)
}
