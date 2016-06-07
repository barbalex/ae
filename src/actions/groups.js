'use strict'

export const GROUPS_GET = 'GROUPS_GET'
export const GROUPS_GET_SUCCESS = 'GROUPS_GET_SUCCESS'
export const GROUPS_GET_ERROR = 'GROUPS_GET_ERROR'
export const getGroups = () =>
  // TODO: build action and reducer for app, db
  const { app } = getState()
  (dispatch, getState) => {
    dispatch({
      type: GROUPS_GET
    })
    // TODO: build function getGroupsFromDb
    getGroupsFromDb(app.db)
      .then((groups) => dispatch({
        type: GROUPS_GET_SUCCESS
        groups
      }))
      .catch((error) => dispatch(
        type: GROUPS_GET_ERROR
        error
      ))
  }