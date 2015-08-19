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
              // reaseon: write the checkpoint for the last docs only
              attachments.sort()
              console.log('attachments.length', attachments.length)
              let series = PouchDB.utils.Promise.resolve()
              attachments.forEach(function (fileName, index) {
                series = series.then(function () {
                  // couchUrl is: http://localhost:5984/artendb      (local dev)
                  // couchUrl is: http://arteigenschaften.ch/artendb (production, untested yet)
                  const couchUrl = getCouchUrl()
                  const loadUrl = couchUrl + '/ae-' + gruppeString + '/' + fileName
                  if (index < attachments.length - 1) {
                    // only write checkpoint when loading last dump
                    return app.localDb.load(loadUrl)
                  }
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
