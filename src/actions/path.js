import { browserHistory } from 'react-router'
import * as nodesActions from './nodes'
import * as objectActions from './object'

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
    // get nodes if main Component is 'object'
    if (mainComponent === 'object') {
      // find out type of node
      let type = 'object'
      if (path.length === 1) {
        type = 'category'
      }
      if (path.length === 2) {
        type = 'taxonomy'
      }
      const id = objectId
      dispatch(nodesActions.nodesGetForNode({ type, id }))
      dispatch(changePath({
        path,
        objectId,
        mainComponent
      }))
    }
    if (objectId) {
      dispatch(objectActions.objectChange(objectId))
    }
    dispatch({
      type: PATH_SET,
      path,
      objectId,
      mainComponent
    })
  }
