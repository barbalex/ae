/**
 * user = logged in user
 */

import {
  OBJECT_CHANGE,
  OBJECT_CHANGE_SUCCESS,
  OBJECT_CHANGE_ERROR,
} from '../actions/object'

const standardState = {
  fetchingId: false,
  id: null,
  error: null,
}

const object = (state = standardState, action) => {
  switch (action.type) {
    case OBJECT_CHANGE:
      return {
        ...state,
        fetchingId: true,
        id: null,
      }
    case OBJECT_CHANGE_SUCCESS:
      return {
        ...state,
        fetchingId: false,
        id: action.id,
      }
    case OBJECT_CHANGE_ERROR:
      return {
        ...state,
        fetchingId: false,
        error: action.error,
      }
    default:
      return state
  }
}

export default object
