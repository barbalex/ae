'use strict'

import app from 'ampersand-app'

export default () => {
  return new Promise((resolve, reject) => {
    app.localGroupsDb.get('groups')
      .then((doc) => resolve(doc.groupsLoaded))
      .catch((error) => reject('getGroupsLoadedFromLocalGroupsDb: error getting groups doc from localGroupsDb:', error))
  })
}
