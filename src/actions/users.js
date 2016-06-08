import getUsersFromRemoteDb from '../modules/getUsersFromRemoteDb'

export const USERS_GET = 'USERS_GET'
export const USERS_GET_SUCCESS = 'USERS_GET_SUCCESS'
export const USERS_GET_ERROR = 'USERS_GET_ERROR'

export const getUsers = () =>
  (dispatch, getState) => {
    dispatch({
      type: USERS_GET
    })
    const { app } = getState()

    getUsersFromRemoteDb(app.remoteUsersDb)
      .then((users) =>
        dispatch({
          type: USERS_GET_SUCCESS,
          users
        })
      )
      .catch((error) => dispatch({
        type: USERS_GET_ERROR,
        error
      }))
  }
