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
        app.Actions.showError({title: 'kickOffStores.js: error loading active object store or getting path for guid ' + guid + ':', msg: error})
      })
  } else if (path && path.length > 0) {
    app.Actions.loadActivePathStore(path, guid)
      .then(function () {
        return getObjectFromPath(path)
      })
      .then(function (object) {
        return app.Actions.loadActiveObjectStore(object._id)
      })
      .catch(function (error) {
        app.Actions.showError({title: 'kickOffStores.js: error loading active object store or getting path for path "' + path + '":', msg: error})
      })
  }
  app.loadingGroupsStore.isGroupLoaded(gruppe)
    .then(function (groupIsLoaded) {
      if (!groupIsLoaded) app.Actions.loadObjectStore(gruppe)
    })
    .catch(function (error) {
      app.Actions.showError({title: 'kickOffStores.js: error getting groups from localGroupsDb:', msg: error})
    })
}
