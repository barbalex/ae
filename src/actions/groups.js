import getGroupsFromRemoteDb from '../modules/getGroupsFromRemoteDb'

export const GROUPS_GET = 'GROUPS_GET'
export const GROUPS_GET_SUCCESS = 'GROUPS_GET_SUCCESS'
export const GROUPS_GET_ERROR = 'GROUPS_GET_ERROR'
export const GROUP_TOGGLE_ACTIVE = 'GROUP_TOGGLE_ACTIVE'

export const getGroups = () =>
  (dispatch, getState) => {
    dispatch({
      type: GROUPS_GET
    })
    const { app } = getState()
    getGroupsFromRemoteDb(app.remoteDb)
      .then((groups) => dispatch({
        type: GROUPS_GET_SUCCESS,
        groups
      }))
      .catch((error) => dispatch({
        type: GROUPS_GET_ERROR,
        error
      }))
  }

export const groupToggleActivated = (name) => ({
  type: GROUP_TOGGLE_ACTIVE,
  active: name
})
