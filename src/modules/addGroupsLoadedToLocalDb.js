/*
 * adds the groups passed to localDb
 * makes shure a group is icluded only once
 * returns the groups loaded
 */

'use strict'

import app from 'ampersand-app'
import { union } from 'lodash'

export default (groups) => new Promise((resolve, reject) => {
  let groupsLoaded = []
  app.localDb.get('_local/groupsLoaded')
    .then((doc) => {
      // make shure a group is not included more than once
      groupsLoaded = union(doc.groupsLoaded, groups)
      doc.groupsLoaded = groupsLoaded
      return app.localDb.put(doc)
    })
    .then(() => resolve(groupsLoaded))
    .catch((error) =>
      reject(`addGroupsLoadedToLocalDb: error getting or putting groups "${groups}" from localDb:`, error)
    )
})
