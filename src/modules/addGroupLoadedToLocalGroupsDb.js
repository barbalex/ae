/*
 * adds the group passed to localGroupsDb
 * makes shure a group is icluded only once
 * returns the groups loaded
 */

'use strict'

import app from 'ampersand-app'
import _ from 'lodash'

export default function (group) {
  return new Promise(function (resolve, reject) {
    let groupsLoaded = []
    app.localGroupsDb.get('groups')
      .then(function (doc) {
        // make shure a group is not included more than once
        groupsLoaded = _.union(doc.groupsLoaded, [group])
        doc.groupsLoaded = groupsLoaded
        return app.localGroupsDb.put(doc)
      })
      .then(function () {
        resolve(groupsLoaded)
      })
      .catch(function (error) {
        reject('addGroupLoadedToLocalGroupsDb: error getting or putting groups doc from localGroupsDb:', error)
      })
  })
}
