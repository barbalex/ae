'use strict'

import app from 'ampersand-app'
import Reflux from 'reflux'
import PouchDB from 'pouchdb'
import _ from 'lodash'
import pouchUrl from './modules/getCouchUrl.js'
import buildHierarchyObjectForFelder from './modules/buildHierarchyObjectForFelder.js'
import buildHierarchyObjectForParent from './modules/buildHierarchyObjectForParent.js'

// Each action is like an event channel for one specific event. Actions are called by components.
// The store is listening to all actions, and the components in turn are listening to the store.
// Thus the flow is: User interaction -> component calls action -> store reacts and triggers -> components update

export default function () {
  // asyncResult creates child actions 'completed' and 'failed'
  let Actions

  Actions = Reflux.createActions({
    loadObjectStore: {children: ['completed', 'failed']},
    loadActiveObjectStore: {children: ['completed', 'failed']}
  })

  Actions.loadObjectStore.listen(function (gruppe) {
    // make shure gruppe was passed
    if (!gruppe) return false
    // problem: this action can get called several times while it is already fetching data
    // > make shure data is only fetched if objectStore is not yet loaded and not loading right now

    console.log('actions loadObjectStore: gruppe:', gruppe)
    // console.log('actions loadObjectStore: window.objectStore.loaded[gruppe]:', window.objectStore.loaded[gruppe])

    // console.log('actions loadObjectStore: app.loadingObjectStore:', app.loadingObjectStore)
    // loadingObjectStore contains an Array of the groups being loaded right now
    app.loadingObjectStore = app.loadObjectStore || []

    if (!window.objectStore.loaded[gruppe] && !_.includes(app.loadingObjectStore, gruppe) && gruppe) {
      let objects = []
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
            objects = result.rows.map(function (row) {
              return row.doc
            })
            // build hierarchy
            return db.query('artendb/dsMetadataNachDsName', { include_docs: true })
          })
          .then(function (result) {
            // extract metadata doc from result
            const dsMetadata = result.rows.map(function (row) {
              return row.doc
            })

            const dsName = objects[0].Taxonomie.Name
            const dsMetadataDoc = _.find(dsMetadata, function (doc) {
              // if Gruppe = LR get dsMetadataDoc of Delarze
              if (objects[0].Gruppe === 'Lebensräume') {
                return doc.Name === 'CH Delarze (2008): Allgemeine Umgebung (Areale)'
              }
              return doc.Name === dsName
            })

            // lookup type
            let hierarchyObject
            if (dsMetadataDoc.HierarchieTyp === 'Felder') hierarchyObject = buildHierarchyObjectForFelder(objects, dsMetadataDoc)
            if (dsMetadataDoc.HierarchieTyp === 'Parent') hierarchyObject = buildHierarchyObjectForParent(objects, dsMetadataDoc)

            Actions.loadObjectStore.completed(gruppe, objects, hierarchyObject, dsMetadata)
          })
          .catch(function (error) {
            app.loadingObjectStore = false
            Actions.loadObjectStore.failed(error)
          })
      })
    }
  })

  Actions.loadActiveObjectStore.listen(function (guid) {

    console.log('actions: loadActiveObjectStore with guid:', guid)

    // check if group is loaded > get object from objectStore
    if (!guid) {
      console.log('actions: loadActiveObjectStore !guid')
      Actions.loadActiveObjectStore.completed({})
    } else {
      console.log('actions: loadActiveObjectStore guid')
      const object = window.objectStore.getItemByGuid(guid)
      if (object) {
        console.log('actions: loadActiveObjectStore object:', object)
        // group is already loaded
        // pass object to activeObjectStore by completing action
        // if object is empty, store will have no item
        // so there is never a failed action
        Actions.loadActiveObjectStore.completed(object)
      } else {
        console.log('actions: loadActiveObjectStore no object, only guid')
        // this group is not loaded yet
        // get Object from couch
        const couchUrl = pouchUrl()
        const db = new PouchDB(couchUrl, function (error, response) {
          if (error) { return console.log('error instantiating remote db: ', error) }
          db.get(guid, { include_docs: true })
            .then(function (object) {
              // dispatch action to load data of this group
              console.log('actions: loadActiveObjectStore: loading objectStore with gruppe:', object.Gruppe)
              Actions.loadObjectStore(object.Gruppe)

              // wait until store changes
              const taxonomieForMetadata = (object.Gruppe === 'Lebensräume' ? 'CH Delarze (2008): Allgemeine Umgebung (Areale)' : object.Taxonomie.Name)

              console.log('actions loadActiveObjectStore: object from couch:', object)

              // check if metadata is here
              const metaData = window.objectStore.getDsMetadata()

              if (metaData && metaData[taxonomieForMetadata]) {

                console.log('actions loadActiveObjectStore: metaDate exists, completing')

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
