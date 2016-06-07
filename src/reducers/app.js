'use strict'

import {
  DBS_INITIALIZE,
  DBS_INITIALIZE_SUCCESS,
  DBS_INITIALIZE_ERROR
} from '../actions/app'

const standardState = {
  initializingDbs: false,
  localDb: null,
  remoteDb: null,
  remoteUsersDb: null,
  error: null
}

const app = (state = standardState, action) => {
  switch (action.type) {
    case DBS_INITIALIZE:
      return {
        initializingDbs: true
      }
    case DBS_INITIALIZE_SUCCESS:
      return {
        initializingDbs: false,
        localDb: action.localDb,
        remoteDb: action.remoteDb,
        remoteUsersDb: action.remoteUsersDb
      }
    case DBS_INITIALIZE_ERROR:
      return {
        initializingDbs: false,
        localDb: null,
        remoteDb: null,
        remoteUsersDb: null,
        error: action.error
      }
    default:
      return state
  }
}

export default app
