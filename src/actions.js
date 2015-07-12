'use strict'

import app from 'ampersand-app'
import Reflux from 'reflux'
import PouchDB from 'pouchdb'
import _ from 'lodash'
import pouchUrl from './modules/getCouchUrl.js'
import buildHierarchyObjectForGruppe from './modules/buildHierarchyObjectForGruppe'

// Each action is like an event channel for one specific event. Actions are called by components.
// The store is listening to all actions, and the components in turn are listening to the store.
// Thus the flow is: User interaction -> component calls action -> store reacts and triggers -> components update

export default function () {
  // asyncResult creates child actions 'completed' and 'failed'
  let Actions

  Actions = Reflux.createActions({
    loadObjectStore: {children: ['completed', 'failed']},
    loadActiveObjectStore: {children: ['completed', 'failed']},
    loadPathStore: {}
  })

  Actions.loadObjectStore.listen(function (gruppe) {
    // make shure gruppe was passed
    if (!gruppe) return false
    // problem: this action can get called several times while it is already fetching data (TODO: that is probalby not so anymore)
    // > make shure data is only fetched if objectStore is not yet loaded and not loading right now
    // loadingObjectStore contains an Array of the groups being loaded right now
    app.loadingObjectStore = app.loadObjectStore || []

    if (!window.objectStore.loaded[gruppe] && !_.includes(app.loadingObjectStore, gruppe) && gruppe) {
      let itemsArray = []
      app.loadingObjectStore.push(gruppe)
      const viewGruppePrefix = gruppe === 'Lebensräume' ? 'lr' : gruppe.toLowerCase()
      const viewName = 'artendb/' + viewGruppePrefix + 'NachName'
      // get fauna from db
      const db = new PouchDB(pouchUrl(), function (error, response) {
        if (error) { return console.log('error instantiating remote db') }
        // get fauna from db
        db.query(viewName, { include_docs: true })
          .then(function (result) {
            // extract objects from result
            itemsArray = result.rows.map(function (row) {
              return row.doc
            })
            // build hierarchy
            return db.query('artendb/dsMetadataNachDsName', { include_docs: true })
          })
          .then(function (result) {
            // extract metadata doc from result
            const taxMetadataArray = result.rows.map(function (row) {
              return row.doc
            })

            const dsName = itemsArray[0].Taxonomie.Name
            const dsMetadataDoc = _.find(taxMetadataArray, function (doc) {
              // if Gruppe = LR get dsMetadataDoc of Delarze
              if (itemsArray[0].Gruppe === 'Lebensräume') {
                return doc.Name === 'Lebensräume'
              }
              return doc.Name === dsName
            })

            const hierarchy = buildHierarchyObjectForGruppe(itemsArray, gruppe)

            // convert items-array to object with keys made of id's
            const items = _.indexBy(itemsArray, '_id')
            // convert tax-metadata-array to object with keys mado of names
            const taxMetadata = _.indexBy(taxMetadataArray, 'Name')

            const payload = {
              gruppe: gruppe,
              items: items,
              hierarchy: hierarchy,
              taxMetadata: taxMetadata
            }
            // console.log('Actions.loadObjectStore will complete with payload', payload)
            Actions.loadObjectStore.completed(payload)
          })
          .catch(function (error) {
            app.loadingObjectStore = false
            Actions.loadObjectStore.failed(error)
          })
      })
    }
  })

  Actions.loadActiveObjectStore.listen(function (guid) {
    // check if group is loaded > get object from objectStore
    if (!guid) {
      Actions.loadActiveObjectStore.completed({})
    } else {
      const object = window.objectStore.getItem(guid)
      if (object) {
        // group is already loaded
        // pass object to activeObjectStore by completing action
        // if object is empty, store will have no item
        // so there is never a failed action
        Actions.loadActiveObjectStore.completed(object)
      } else {
        // this group is not loaded yet
        // get Object from couch
        const couchUrl = pouchUrl()
        const db = new PouchDB(couchUrl, function (error, response) {
          if (error) { return console.log('error instantiating remote db: ', error) }
          db.get(guid, { include_docs: true })
            .then(function (object) {
              // dispatch action to load data of this group
              Actions.loadObjectStore(object.Gruppe)
              // wait until store changes
              const taxonomieForMetadata = (object.Gruppe === 'Lebensräume' ? 'Lebensräume' : object.Taxonomie.Name)
              // check if metadata is here
              const metaData = window.objectStore.getTaxMetadata()
              if (metaData && metaData[taxonomieForMetadata]) {
                Actions.loadActiveObjectStore.completed(object)
              } else {
                db.query('artendb/dsMetadataNachDsName', { include_docs: true })
                  .then(function (result) {
                    // extract metadata doc from result
                    const metaDataDoc = result.rows.map(function (row) {
                      return row.doc
                    })
                    const metaData = _.indexBy(metaDataDoc, 'Name')
                    Actions.loadActiveObjectStore.completed(object, metaData)
                  })
                  .catch(function (error) {
                    console.log('error fetching metadata:', error)
                  })
              }
            })
            .catch(function (error) {
              console.log('error fetching doc from ' + couchUrl + ' with guid ' + guid + ':', error)
            })
        })
      }
    }
  })

  return Actions
}
