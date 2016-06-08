/**
 * user = logged in user
 */

import getUserFromLocalDb from '../modules/getUserFromLocalDb'
import getUserRoles from '../modules/getUserRoles'

export const USER_GET = 'USER_GET'
export const USER_GET_SUCCESS = 'USER_GET_SUCCESS'
export const USER_GET_ERROR = 'USER_GET_ERROR'
export const USER_GET_ROLES = 'USER_GET_ROLES'
export const USER_GET_ROLES_SUCCESS = 'USER_GET_ROLES_SUCCESS'
export const USER_GET_ROLES_ERROR = 'USER_GET_ROLES_ERROR'

export const getUser = () =>
  (dispatch, getState) => {
    dispatch({
      type: USER_GET
    })
    const { app } = getState()
    getUserFromLocalDb(app.localDb)
      .then((user) => dispatch({
        type: USER_GET_SUCCESS,
        user
      }))
      .catch((error) => dispatch({
        type: USER_GET_ERROR,
        error
      }))
  }

export const getRoles = () =>
  (dispatch, getState) => {
    dispatch({
      type: USER_GET_ROLES
    })
    const { user } = getState()
    getUserRoles(user.name)
      .then((roles) => dispatch({
        type: USER_GET_ROLES_SUCCESS,
        roles
      }))
      .catch((error) => dispatch({
        type: USER_GET_ROLES_ERROR,
        error
      }))
  }
