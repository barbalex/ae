'use strict'

import app from 'ampersand-app'

export default () => {
  return new Promise((resolve, reject) => {
    app.localDb.get('_local/hierarchy')
      .then((doc) => resolve(doc.hierarchy))
      .catch((error) =>
        reject('getHierarchyFromLocalDb.js: error getting items from localHierarchyDb: ' + error)
      )
  })
}
