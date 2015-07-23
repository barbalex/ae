'use strict'

import app from 'ampersand-app'

export default function () {
  return new Promise(function (resolve, reject) {
    app.localGroupsDb.get('groups')
      .then(function (doc) {
        resolve(doc.groupsLoaded)
      })
      .catch(function (error) {
        reject('getGroupsLoadedFromLocalGroupsDb: error getting groups doc from localGroupsDb:', error)
      })
  })
}
