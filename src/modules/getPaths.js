'use strict'

import app from 'ampersand-app'

export default function () {
  return new Promise(function (resolve, reject) {
    app.localPathDb.get('aePaths')
      .then(function (paths) {
        resolve(paths)
      })
      .catch(function (error) {
        reject('getPaths: error getting paths from localPathDb:', error)
      })
  })
}
