/*
 * momentarily not in use
 */

'use strict'

import app from 'ampersand-app'
import { pluck } from 'lodash'

export default () => {
  return new Promise((resolve, reject) => {
    app.localDb.get('_local/hierarchy')
      .then((doc) =>
        resolve(pluck(doc.hierarchy, 'Name'))
      )
      .catch((error) =>
        reject('getGroupsLoadedFromHierarchy: error getting items from localDb:', error)
      )
  })
}
