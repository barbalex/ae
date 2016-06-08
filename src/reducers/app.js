'use strict'

import {
  INITIALIZE,
  INITIALIZE_SUCCESS,
  INITIALIZE_ERROR
} from '../actions/app'

const standardState = {
  initializing: false,
  localDb: null,
  remoteDb: null,
  remoteUsersDb: null,
  error: null
}

const app = (state = standardState, action) => {
  switch (action.type) {
    case INITIALIZE:
      return {
        initializing: true
      }
    case INITIALIZE_SUCCESS:
      return {
        initializing: false,
        localDb: action.localDb,
        remoteDb: action.remoteDb,
        remoteUsersDb: action.remoteUsersDb
      }
    case INITIALIZE_ERROR:
      return {
        initializing: false,
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
