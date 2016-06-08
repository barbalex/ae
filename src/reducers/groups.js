import {
  GROUPS_GET,
  GROUPS_GET_SUCCESS,
  GROUPS_GET_ERROR,
  GROUP_TOGGLE_ACTIVE
} from '../actions/groups'

const standardState = {
  getting: false,
  // object, key = group.Name, value: group
  groups: {},
  // this is the Name of the active group
  active: null,
  error: null,
}

const groups = (state = standardState, action) => {
  switch (action.type) {
    case GROUPS_GET:
      return {
        ...state,
        getting: true,
        groups: {},
        error: null,
      }
    case GROUPS_GET_SUCCESS:
      return {
        ...state,
        getting: false,
        groups: action.groups,
      }
    case GROUPS_GET_ERROR:
      return {
        ...state,
        getting: false,
        error: action.error,
      }
    case GROUP_TOGGLE_ACTIVE:
      return {
        ...state,
        active: action.active,
      }
    default:
      return state
  }
}

export default groups
