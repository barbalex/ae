/*
 * loads a group if it is not listed in aeGroupsDb
 */

'use strict'

import app from 'ampersand-app'
import PouchDB from 'pouchdb'
import _ from 'lodash'
import getCouchUrl from './getCouchUrl.js'

export default function (gruppe) {
  return new Promise(function (resolve, reject) {
    app.objectStore.isGroupLoaded(gruppe)
      .then(function (groupIsLoaded) {
        if (!groupIsLoaded) {
          // this group does not exist yet in the store
          const gruppeString = gruppe === 'Lebensräume' ? 'lr' : (gruppe === 'Macromycetes' ? 'pilze' : gruppe.toLowerCase())
          app.remoteDb.get('ae-' + gruppeString)
            .then(function (doc) {
              return _.keys(doc._attachments)
            })
            .then(function (attachments) {
              // sort attachments so the one with the last docs is loaded last
              // reaseon: trying to write the checkpoint for the last docs
              // unfortunately does not work
              attachments.sort()
              let series = PouchDB.utils.Promise.resolve()
              attachments.forEach(function (fileName) {
                series = series.then(function () {
                  const couchUrl = getCouchUrl()  // is: http://localhost:5984/artendb (local dev) or http://arteigenschaften.ch/artendb (production, untested yet)
                  const loadUrl = couchUrl + '/ae-' + gruppeString + '/' + fileName
                  return app.localDb.load(loadUrl, {proxy: couchUrl})
                  // TODO: looks like no checkpoint is set, so following replication takes forever
                })
              })
              series.then(function () {
                resolve(true)
              })
              .catch(function (error) {
                reject('loadGroupFromRemote.js: error loading group' + gruppe + 'from remoteDb:', error)
              })
            })
            .catch(function (error) {
              reject('loadGroupFromRemote.js: error loading group' + gruppe + 'from remoteDb:', error)
            })
        } else {
          resolve(true)
        }
      })
      .catch(function (error) {
        reject('loadGroupFromRemote.js, error getting isGroupLoaded for group ' + gruppe + ': ' + error)
      })
  })
}
