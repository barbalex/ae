'use strict'

import app from 'ampersand-app'

export default function () {
  return new Promise(function (resolve, reject) {
    app.localPathDb.get('aePaths')
      .then(function (doc) {
        resolve(doc)
      })
      .catch(function (error) {
        reject('getPathsFromLocalPathDb: error getting paths from localPathDb:', error)
      })
  })
}
