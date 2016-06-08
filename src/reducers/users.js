/**
 * TODO: not sure where a list of users is needed!
 */

import {
  USERS_GET,
  USERS_GET_SUCCESS,
  USERS_GET_ERROR,
} from '../actions/users'

const standardState = {
  getting: false,
  // object
  // keys = names = emails
  // values = user objects received from _users db
  users: [],
  error: null,
}

const users = (state = standardState, action) => {
  switch (action.type) {
    case USERS_GET:
      return {
        ...state,
        getting: true,
        users: [],
        error: null,
      }
    case USERS_GET_SUCCESS:
      return {
        ...state,
        getting: false,
        users: action.users,
      }
    case USERS_GET_ERROR:
      return {
        ...state,
        getting: false,
      }
    default:
      return state
  }
}

export default users

// selectors
export const getUsersNames = (state) => state.users
