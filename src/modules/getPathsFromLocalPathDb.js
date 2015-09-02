'use strict'

import app from 'ampersand-app'

export default () => {
  return new Promise((resolve, reject) => {
    app.localPathDb.get('aePaths')
      .then((doc) => resolve(doc))
      .catch((error) => reject('getPathsFromLocalPathDb: error getting paths from localPathDb:', error))
  })
}
