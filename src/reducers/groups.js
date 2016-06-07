'use strict'

import keyBy from 'lodash/keyBy'
import {
  GROUPS_GET,
  GROUPS_GET_SUCCESS,
  GROUPS_GET_ERROR,
  GROUP_TOGGLE_ACTIVATED
} from '../actions/groups'

const standardState = {
  fetching: false,
  // object, key = group.Name, value: group
  groups: {},
  // this is the Name of the activated group
  activated: null,
  error: null
}

const groups = (state = standardState, action) => {
  switch (action.type) {
    case GROUPS_GET:
      return {
        ...state,
        fetching: true,
        error: null
      }
    case GROUPS_GET_SUCCESS:
      return {
        ...state,
        fetching: false,
        groups: {
          ...state.groups,
          ...keyBy(action.groups, 'Name')
        },
        error: null
      }
    case GROUPS_GET_ERROR:
      return {
        ...state,
        fetching: false,
        error: action.error
      }
    case GROUP_TOGGLE_ACTIVATED:
      return {
        ...state,
        activated: action.activated
      }
    default:
      return state
  }
}

export default groups