'use strict'

import app from 'ampersand-app'

export default () => {
  let objects = []
  app.objectStore.getObjects()
    .then((items) => {
      objects = items
      return true
    })
    .then(() => app.localDb.get('_local/groupsLoaded'))
    .then((doc) => {
      doc.hierarchy = []
      return app.localDb.put(doc)
    })
    .then(() => {
      // TODO: empty filter options
      app.Actions.loadFilterOptions(objects)
      // TODO: empty path
      app.Actions.loadPaths(objects)
    })
    .catch((error) => app.Actions.showError({title: 'Error rebuilding hierarhy:', msg: error}))
}
