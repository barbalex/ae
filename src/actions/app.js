import app from 'ampersand-app'
import PouchDB from 'pouchdb'
import pouchdbUpsert from 'pouchdb-upsert'
import pouchdbAuthentication from 'pouchdb-authentication'
import pouchUrl from '../modules/getCouchUrl.js'
import * as userActions from './user'

/**
 * set up pouchdb plugins
 */
PouchDB.plugin(pouchdbUpsert)
PouchDB.plugin(pouchdbAuthentication)
/**
 * enable pouch inspector in chrome
 * (https://chrome.google.com/webstore/detail/pouchdb-inspector/hbhhpaojmpfimakffndmpmpndcmonkfa)
 */
window.PouchDB = PouchDB

export const INITIALIZE = 'INITIALIZE'
export const INITIALIZE_SUCCESS = 'INITIALIZE_SUCCESS'
export const INITIALIZE_ERROR = 'INITIALIZE_ERROR'

export const initializeApp = () =>
  (dispatch) => {
    let localDb
    let remoteDb
    let remoteUsersDb
    dispatch(userActions.getUser())
    dispatch({
      type: INITIALIZE
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
    // keep the old store working for a while
    .then(() => {
      app.extend({
        localDb,
        remoteDb,
        remoteUsersDb
      })
    })
    .then(() => Promise.all([
      /**
       * initiate login data if necessary
       * by adding a local document to pouch
       * local documents are not replicated
       */
      localDb.putIfNotExists({
        _id: '_local/user',
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
        type: INITIALIZE_SUCCESS,
        localDb,
        remoteDb,
        remoteUsersDb
      }))
      .catch((error) => dispatch({
        type: INITIALIZE_ERROR,
        error
      }))
    ]))
  }
