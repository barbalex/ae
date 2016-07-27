import { browserHistory } from 'react-router'
import * as nodesActions from './nodes'
import * as objectActions from './object'

export const PATH_CHANGE = 'PATH_CHANGE'
export const changePath = ({
  path,
  objectId,
  taxonomyObjectId,
  mainComponent,
}) =>
  (dispatch) => {
    dispatch({
      type: PATH_CHANGE,
      path,
      objectId,
      taxonomyObjectId,
      mainComponent,
    })
    const url = `/${path.join('/')}${objectId ? `?id=${objectId}` : ''}`
    browserHistory.push(url)
  }

export const PATH_SET = 'PATH_SET'
export const setPath = ({
  path,
  objectId,
  taxonomyObjectId,
  mainComponent,
}) =>
  (dispatch) => {
    // get nodes if main Component is 'object'
    if (mainComponent === 'object') {
      // find out type of node
      let type = objectId ? 'object' : 'taxonomy_object'
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
        taxonomyObjectId,
        mainComponent,
      }))
    }
    if (objectId) {
      dispatch(objectActions.objectChange(objectId))
    }
    if (!mainComponent) {
      dispatch(nodesActions.nodesGetInitial())
    }
    dispatch({
      type: PATH_SET,
      path,
      objectId,
      taxonomyObjectId,
      mainComponent,
    })
  }
