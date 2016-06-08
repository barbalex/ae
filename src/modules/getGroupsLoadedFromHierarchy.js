/*
 * momentarily not in use
 */

import app from 'ampersand-app'
import { map } from 'lodash'

export default () => new Promise((resolve, reject) => {
  app.localDb.get('_local/hierarchy')
    .then((doc) =>
      resolve(map(doc.hierarchy, 'Name'))
    )
    .catch((error) =>
      reject('getGroupsLoadedFromHierarchy: error getting items from localDb:', error)
    )
})
