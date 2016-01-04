'use strict'

import app from 'ampersand-app'

export default () => {
  app.objectStore.getObjects()
    .then((objects) => {
      // TODO: empty filter options
      app.Actions.loadFilterOptions(objects)
      // TODO: empty path
      app.Actions.loadPaths(objects)
    })
    .catch((error) => app.Actions.showError({title: 'Error rebuilding hierarhy:', msg: error}))
}
