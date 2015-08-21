'use strict'

import app from 'ampersand-app'
import getPathFromGuid from './getPathFromGuid.js'
import getObjectFromPath from './getObjectFromPath.js'

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
      .then(function () {
        return getObjectFromPath(path)
      })
      .then(function (object) {
        return app.Actions.loadActiveObjectStore(object._id)
      })
      .catch(function (error) {
        console.log('kickOffStores.js: error loading active object store or getting path for path "' + path + '":', error)
      })
  }
  if (gruppe) app.Actions.loadObjectStore(gruppe)
}
