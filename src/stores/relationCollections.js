'use strict'

import app from 'ampersand-app'
import Reflux from 'reflux'
import { reject as _reject } from 'lodash'
import queryRcs from '../queries/rcs.js'

export default (Actions) => Reflux.createStore({
  /*
   * queries relation collections
   * keeps last query result in pouch (_local/rcs.rcs) for fast delivery
   * app.js sets default _local/rcs.rcs = [] if not exists on app start
   * rc's are arrays of the form:
   * [collectionType, rcName, combining, organization,
   * {Beschreibung: xxx, Datenstand: xxx, Link: xxx, Nutzungsbedingungen: xxx}, count: xxx]
   *
   * when this store triggers it passes two variables:
   * rcs: the relation collections
   * rcsQuerying: true/false: are rcs being queryied? if true: show warning in symbols
   */
  listenables: Actions,

  rcsQuerying: false,

  getRcs() {
    return new Promise((resolve, reject) => {
      app.localDb.get('_local/rcs')
        .then((doc) => resolve(doc.rcs))
        .catch((error) =>
          reject(`userStore: error getting relation collections from localDb: ${error}`)
        )
    })
  },

  saveRc(rc) {
    let rcs
    app.localDb.get('_local/rcs')
      .then((doc) => {
        doc.rcs.push(rc)
        doc.rcs = doc.rcs.sort((c) => c.name)
        rcs = doc.rcs
        return app.localDb.put(doc)
      })
      .then(() => this.trigger(rcs, this.rcsQuerying))
      .catch((error) =>
        app.Actions.showError({
          title: 'Fehler in relationCollectionsStore, saveRc:',
          msg: error
        })
      )
  },

  saveRcs(rcs) {
    app.localDb.get('_local/rcs')
      .then((doc) => {
        doc.rcs = rcs
        return app.localDb.put(doc)
      })
      .catch((error) =>
        app.Actions.showError({
          title: 'Fehler in relationCollectionsStore, saveRcs:',
          msg: error
        })
      )
  },

  removeRcByName(name) {
    let rcs
    app.localDb.get('_local/rcs')
      .then((doc) => {
        doc.rcs = _reject(doc.rcs, (rc) => rc.name === name)
        rcs = doc.rcs
        return app.localDb.put(doc)
      })
      .then(() => this.trigger(rcs, this.rcsQuerying))
      .catch((error) =>
        app.Actions.showError({
          title: 'Fehler in relationCollectionsStore, removeRcByName:',
          msg: error
        })
      )
  },

  getRcByName(name) {
    return new Promise((resolve, reject) => {
      this.getRcs()
        .then((rcs) => {
          const rc = rcs.find((c) => c.name === name)
          resolve(rc)
        })
        .catch((error) => reject(error))
    })
  },

  onQueryRelationCollections(offlineIndexes) {
    // if rc's exist, send them immediately
    this.rcsQuerying = true
    this.getRcs()
      .then((rcs) => this.trigger(rcs, this.rcsQuerying))
      .catch((error) =>
        app.Actions.showError({
          title: 'relationCollectionsStore, error getting existing rcs:',
          msg: error
        })
      )
    // now fetch up to date rc's
    queryRcs(offlineIndexes)
      .then((rcs) => {
        this.rcsQuerying = false
        this.trigger(rcs, this.rcsQuerying)
        return this.saveRcs(rcs)
      })
      .catch((error) =>
        app.Actions.showError({
          title: 'relationCollectionsStore, error querying up to date rcs:',
          msg: error
        })
      )
  }
})
