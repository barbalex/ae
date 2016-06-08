/**
 * user = logged in user
 */

import {
  USER_GET,
  USER_GET_SUCCESS,
  USER_GET_ERROR,
  USER_GET_ROLES,
  USER_GET_ROLES_SUCCESS,
  USER_GET_ROLES_ERROR,
} from '../actions/user'

const standardState = {
  // whether a login should be started
  logIn: false,
  gettingUser: false,
  gettingUserError: null,
  user: null,
  gettingRoles: false,
  gettingRolesError: null,
}

const user = (state = standardState, action) => {
  switch (action.type) {
    case USER_GET:
      return {
        ...state,
        gettingUser: true,
        user: null,
        gettingUserError: null,
      }
    case USER_GET_SUCCESS:
      return {
        ...state,
        gettingUser: false,
        user: action.user,
      }
    case USER_GET_ERROR:
      return {
        ...state,
        gettingUser: false,
        gettingUserError: action.error,
      }
    case USER_GET_ROLES:
      return {
        ...state,
        gettingRoles: true,
        user: null,
        gettingRolesError: null,
      }
    case USER_GET_ROLES_SUCCESS:
      return {
        ...state,
        gettingRoles: false,
        user: {
          ...user,
          roles: action.roles
        }
      }
    case USER_GET_ROLES_ERROR:
      return {
        ...state,
        gettingRoles: false,
        gettingRolesError: action.error,
      }
    default:
      return state
  }
}

export default user
