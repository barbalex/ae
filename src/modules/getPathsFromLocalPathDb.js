'use strict'

import app from 'ampersand-app'

export default () => {
  return new Promise((resolve, reject) => {
    app.localPathDb.get('aePaths')
      .then((doc) => resolve(doc))
      .catch((error) => {
        if (error.status === 404) {
          // not found > paths not created yet
          // this is expected if docs are not yet locally available
          return resolve(null)
        }
        reject('getPathsFromLocalPathDb: error getting paths from localPathDb:', error)
      })
  })
}
