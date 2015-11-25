'use strict'

import app from 'ampersand-app'
import getObjectFromPath from './getObjectFromPath.js'

export default (path, gruppe, guid) => {
  if (guid) {
    app.Actions.loadActiveObjectStore(guid)
  } else if (path && path.length > 0) {
    app.Actions.loadActivePathStore(path, guid)
    getObjectFromPath(path)
      .then((object) => {
        if (object) app.Actions.loadActiveObjectStore(object._id)
      })
      .catch((error) =>
        app.Actions.showError({title: 'kickOffStores.js: error loading active object store or getting path for path "' + path + '":', msg: error})
      )
  }
  app.loadingGroupsStore.isGroupLoaded(gruppe)
    .then((groupIsLoaded) => {
      if (!groupIsLoaded) app.Actions.loadObjectStore(gruppe)
    })
    .catch((error) =>
      app.Actions.showError({title: 'kickOffStores.js: error getting groups from localGroupsDb:', msg: error})
    )
}
