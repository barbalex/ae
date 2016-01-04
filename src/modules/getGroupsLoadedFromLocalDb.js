'use strict'

import app from 'ampersand-app'

export default () => {
  return new Promise((resolve, reject) => {
    app.localDb.get('_local/groupsLoaded')
      .then((doc) => resolve(doc.groupsLoaded))
      .catch((error) => reject('getGroupsLoadedFromLocalDb: error getting groups doc from localDb:', error))
  })
}