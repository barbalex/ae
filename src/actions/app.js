'use strict'

import PouchDB from 'pouchdb'
import pouchdbUpsert from 'pouchdb-upsert'
import pouchdbAuthentication from 'pouchdb-authentication'
import pouchUrl from '../modules/getCouchUrl.js'

/**
 * set up pouchdb plugins
 */
PouchDB.plugin(pouchdbUpsert)
PouchDB.plugin(pouchdbAuthentication)

export const DBS_INITIALIZE = 'DBS_INITIALIZE'
export const DBS_INITIALIZE_SUCCESS = 'DBS_INITIALIZE_SUCCESS'
export const DBS_INITIALIZE_ERROR = 'DBS_INITIALIZE_ERROR'

export const initializeDbs = () =>
  (dispatch) => {
    let localDb
    let remoteDb
    let remoteUsersDb

    dispatch({
      type: DBS_INITIALIZE
    })
    /**
     * get path to remote _users db
     */
    const remoteDbUrl = pouchUrl()
    const remoteUsersDbUrl = remoteDbUrl
      .replace('/ae', '/_users')
      .replace('/artendb', '/_users')
    /**
     * pouchdb keeps setting a lot of listeners which makes browsers show warnings in the console
     * up the number of listeners to reduce the number of console warnings
     */
    PouchDB.setMaxListeners(80)
    /**
     * set up all the needed databases in parallel
     * in chrome these can be looked at using pouch inspector
     * (https://chrome.google.com/webstore/detail/pouchdb-inspector/hbhhpaojmpfimakffndmpmpndcmonkfa)
     */
    Promise.all([
      localDb = new PouchDB('ae'),
      remoteDb = new PouchDB(pouchUrl()),
      remoteUsersDb = new PouchDB(remoteUsersDbUrl)
    ])
    .then(() => Promise.all([
      /**
       * initiate login data if necessary
       * by adding a local document to pouch
       * local documents are not replicated
       */
      localDb.putIfNotExists({
        _id: '_local/login',
        logIn: false,
        email: null
      }),
      // initiate tcs data if necessary
      localDb.putIfNotExists({
        _id: '_local/tcs',
        tcs: []
      }),
      // initiate pcs data if necessary
      localDb.putIfNotExists({
        _id: '_local/pcs',
        pcs: []
      }),
      // initiate rcs data if necessary
      localDb.putIfNotExists({
        _id: '_local/rcs',
        rcs: []
      }),
      // initiate fields data if necessary
      localDb.putIfNotExists({
        _id: '_local/fields',
        fields: []
      })
      .then(() => dispatch({
        type: DBS_INITIALIZE_SUCCESS,
        localDb,
        remoteDb,
        remoteUsersDb
      }))
      .catch((error) => dispatch({
        type: DBS_INITIALIZE_ERROR,
        error
      }))
    ]))
  }
