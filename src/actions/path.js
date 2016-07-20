import { browserHistory } from 'react-router'

export const PATH_CHANGE = 'PATH_CHANGE'
export const changePath = ({
  path,
  objectId,
  mainComponent
}) =>
  (dispatch) => {
    dispatch({
      type: PATH_CHANGE,
      path,
      objectId,
      mainComponent
    })
    const url = `/${path.join('/')}${objectId ? `?id=${objectId}` : ''}`
    browserHistory.push(url)
  }

export const PATH_SET = 'PATH_SET'
export const setPath = ({
  path,
  objectId,
  mainComponent
}) =>
  (dispatch) => {
    dispatch({
      type: PATH_SET,
      path,
      objectId,
      mainComponent
    })
  }
