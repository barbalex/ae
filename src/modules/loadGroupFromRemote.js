/*
 * loads a group if it is not listed in aeGroupsDb
 */

'use strict'

import app from 'ampersand-app'
import PouchDB from 'pouchdb'
import { filter } from 'lodash'
import getCouchUrl from './getCouchUrl.js'
import buildHierarchy from './buildHierarchy.js'

export default (gruppe, callback) => {
  return new Promise((resolve, reject) => {
    app.loadingGroupsStore.isGroupLoaded(gruppe)
      .then((groupIsLoaded) => {
        if (!groupIsLoaded) {
          // this group does not exist yet in the store
          const gruppeString = gruppe === 'Lebensräume' ? 'lr' : (gruppe === 'Macromycetes' ? 'pilze' : gruppe.toLowerCase())
          app.remoteDb.get('ae-' + gruppeString)
            .then((doc) => Object.keys(doc._attachments))
            .then((attachments) => {
              // sort attachments so the one with the last docs is loaded last
              // reason: write the checkpoint for the last docs only
              // use attachments.length to show progress bar
              attachments.sort()
              let series = PouchDB.utils.Promise.resolve()
              attachments.forEach((fileName, index) => {
                series = series.then(() => {
                  // couchUrl is: http://localhost:5984/artendb      (local dev)
                  // couchUrl is: http://arteigenschaften.ch/artendb (production, untested yet)
                  const progressPercent = (index + 1) / attachments.length * 100
                  const message = Math.round(progressPercent) + '% Lade ' + gruppe
                  app.Actions.showGroupLoading({
                    group: gruppe,
                    message: message,
                    progressPercent: progressPercent
                  })
                  const couchUrl = getCouchUrl()
                  const loadUrl = couchUrl + '/ae-' + gruppeString + '/' + fileName
                  if (index < attachments.length - 1) {
                    // only write checkpoint when loading last dump
                    return app.localDb.load(loadUrl)
                  }
                  return app.localDb.load(loadUrl, {proxy: couchUrl})
                })
              })
              series
                // turned off because on office computer this crashes!!!
                /*
                .then(() => {
                  // let regular replication catch up if objects have changed since dump was created
                  app.Actions.showGroupLoading({
                    group: gruppe,
                    message: 'Repliziere ' + gruppe + '...'
                  })
                  return app.localDb.replicate.from(app.remoteDb, {
                    filter: (doc) => (doc.Gruppe && doc.Gruppe === gruppe),
                    batch_size: 500
                  })
                })
                */
                .then(() => {
                  app.Actions.showGroupLoading({
                    group: gruppe,
                    message: 'Baue Taxonomie für ' + gruppe + '...'
                  })
                  return app.objectStore.getObjects()
                })
                .then((items) => {
                  // need to build filter options, hierarchy and paths only for groups newly loaded
                  const itemsOfGroup = filter(items, 'Gruppe', gruppe)
                  app.Actions.loadFilterOptionsStore(itemsOfGroup)
                  // build path hash - it helps finding an item by path
                  app.Actions.loadPathStore(itemsOfGroup)
                  // build hierarchy and save to pouch
                  return app.localDb.get('_local/hierarchy')
                    .then((doc) => {
                      const hierarchyOfGroup = buildHierarchy(itemsOfGroup)
                      doc.hierarchy.push(hierarchyOfGroup[0])
                      app.localDb.put(doc)
                    })
                    .catch((error) => console.log('error putting hierarchy', error))
                })
                .then((hierarchy) => {
                  app.Actions.showGroupLoading({
                    group: gruppe,
                    finishedLoading: true
                  })
                  if (callback) callback
                  resolve(true)
                })
                .catch((error) => reject('loadGroupFromRemote.js: error loading group' + gruppe + 'from remoteDb:', error)
              )
            })
            .catch((error) => reject('loadGroupFromRemote.js: error loading group' + gruppe + 'from remoteDb:', error)
          )
        } else {
          resolve(true)
        }
      })
      .catch((error) => reject('loadGroupFromRemote.js, error getting isGroupLoaded for group ' + gruppe + ': ' + error)
    )
  })
}
