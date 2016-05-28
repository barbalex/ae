'use strict'

import app from 'ampersand-app'
import Reflux from 'reflux'
import { reject as _reject } from 'lodash'
import queryTcs from '../queries/tcs.js'

export default (Actions) => Reflux.createStore({
  /*
   * queries taxonomy collections
   * keeps last query result in pouch (_local/tcs.tcs) for fast delivery
   * app.js sets default _local/tcs.tcs = [] if not exists on app start
   * tc's are arrays of the form:
   * [group, standardtaxonomy, name, organization,
   * {Beschreibung: xxx, Datenstand: xxx, Link: xxx, Nutzungsbedingungen: xxx}, count: xxx]
   *
   * when this store triggers it passes two variables:
   * tcs: the propberty collections
   * tcsQuerying: true/false: are tcs being queryied? if true: show warning in symbols
   */
  listenables: Actions,

  tcsQuerying: false,

  getTcs() {
    return new Promise((resolve, reject) => {
      app.localDb.get('_local/tcs')
        .then((doc) => resolve(doc.tcs))
        .catch((error) =>
          reject(`Fehler in taxonomyCollectionsStore, getTcs: ${error}`)
        )
    })
  },

  saveTc(tc) {
    let tcs
    app.localDb.get('_local/tcs')
      .then((doc) => {
        doc.tcs.push(tc)
        doc.tcs = doc.tcs.sort((c) => c.name)
        tcs = doc.tcs
        return app.localDb.put(doc)
      })
      .then(() => this.trigger(tcs, this.tcsQuerying))
      .catch((error) =>
        app.Actions.showError({
          title: 'Fehler in taxonomyCollectionsStore, saveTc:',
          msg: error
        })
      )
  },

  saveTcs(tcs) {
    app.localDb.get('_local/tcs')
      .then((doc) => {
        doc.tcs = tcs
        return app.localDb.put(doc)
      })
      .catch((error) =>
        app.Actions.showError({
          title: 'Fehler in taxonomyCollectionsStore, saveTcs:',
          msg: error
        })
      )
  },

  removeTcByName(name) {
    let tcs
    app.localDb.get('_local/tcs')
      .then((doc) => {
        doc.tcs = _reject(doc.tcs, (tc) => tc.name === name)
        tcs = doc.tcs
        return app.localDb.put(doc)
      })
      .then(() => this.trigger(tcs, this.tcsQuerying))
      .catch((error) =>
        app.Actions.showError({
          title: 'Fehler in taxonomyCollectionsStore, removeTcByName:',
          msg: error
        })
      )
  },

  getTcByName(name) {
    return new Promise((resolve, reject) => {
      this.getTcs()
        .then((tcs) => {
          const tc = tcs.find((c) => c.name === name)
          resolve(tc)
        })
        .catch((error) => reject(error))
    })
  },

  onQueryTaxonomyCollections(offlineIndexes) {
    // if tc's exist, send them immediately
    this.tcsQuerying = true
    this.getTcs()
      .then((tcs) => this.trigger(tcs, this.tcsQuerying))
      .catch((error) =>
        app.Actions.showError({
          title: 'taxonomyCollectionsStore, error getting existing tcs:',
          msg: error
        })
      )
    // now fetch up to date tc's
    queryTcs(offlineIndexes)
      .then((tcs) => {
        this.tcsQuerying = false
        this.trigger(tcs, this.tcsQuerying)
        return this.saveTcs(tcs)
      })
      .catch((error) =>
        app.Actions.showError({
          title: 'taxonomyCollectionsStore, error querying up to date tcs:',
          msg: error
        })
      )
  }
})
