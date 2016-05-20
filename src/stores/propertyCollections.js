'use strict'

import app from 'ampersand-app'
import Reflux from 'reflux'
import { reject as _reject } from 'lodash'
import queryPcs from '../queries/pcs.js'

export default (Actions) => {
  const propertyCollectionsStore = Reflux.createStore({
    /*
     * queries property collections
     * keeps last query result in pouch (_local/pcs.pcs) for fast delivery
     * app.js sets default _local/pcs.pcs = [] if not exists on app start
     * pc's are arrays of the form:
     * [collectionType, pcName, combining, organization,
     * {Beschreibung: xxx, Datenstand: xxx, Link: xxx, Nutzungsbedingungen: xxx}, count: xxx]
     *
     * when this store triggers it passes two variables:
     * pcs: the propberty collections
     * pcsQuerying: true/false: are pcs being queryied? if true: show warning in symbols
     */
    listenables: Actions,

    pcsQuerying: false,

    getPcs() {
      return new Promise((resolve, reject) => {
        app.localDb.get('_local/pcs')
          .then((doc) => resolve(doc.pcs))
          .catch((error) =>
            reject(`Fehler in propertyCollectionsStore, getPcs: ${error}`)
          )
      })
    },

    savePc(pc) {
      let pcs
      app.localDb.get('_local/pcs')
        .then((doc) => {
          doc.pcs.push(pc)
          doc.pcs = doc.pcs.sort((c) => c.name)
          pcs = doc.pcs
          return app.localDb.put(doc)
        })
        .then(() => this.trigger(pcs, this.pcsQuerying))
        .catch((error) =>
          app.Actions.showError({
            title: 'Fehler in propertyCollectionsStore, savePc:',
            msg: error
          })
        )
    },

    savePcs(pcs) {
      app.localDb.get('_local/pcs')
        .then((doc) => {
          doc.pcs = pcs
          return app.localDb.put(doc)
        })
        .catch((error) =>
          app.Actions.showError({
            title: 'Fehler in propertyCollectionsStore, savePcs:',
            msg: error
          })
        )
    },

    removePcByName(name) {
      let pcs
      app.localDb.get('_local/pcs')
        .then((doc) => {
          doc.pcs = _reject(doc.pcs, (pc) => pc.name === name)
          pcs = doc.pcs
          return app.localDb.put(doc)
        })
        .then(() => this.trigger(pcs, this.pcsQuerying))
        .catch((error) =>
          app.Actions.showError({
            title: 'Fehler in propertyCollectionsStore, removePcByName:',
            msg: error
          })
        )
    },

    getPcByName(name) {
      return new Promise((resolve, reject) => {
        this.getPcs()
          .then((pcs) => {
            const pc = pcs.find((c) => c.name === name)
            resolve(pc)
          })
          .catch((error) => reject(error))
      })
    },

    onQueryPropertyCollections(offlineIndexes) {
      // if pc's exist, send them immediately
      this.pcsQuerying = true
      this.getPcs()
        .then((pcs) => this.trigger(pcs, this.pcsQuerying))
        .catch((error) =>
          app.Actions.showError({
            title: 'propertyCollectionsStore, error getting existing pcs:',
            msg: error
          })
        )
      // now fetch up to date pc's
      queryPcs(offlineIndexes)
        .then((pcs) => {
          this.pcsQuerying = false
          this.trigger(pcs, this.pcsQuerying)
          return this.savePcs(pcs)
        })
        .catch((error) =>
          app.Actions.showError({
            title: 'propertyCollectionsStore, error querying up to date pcs:',
            msg: error
          })
        )
    }
  })
  return propertyCollectionsStore
}
