import { browserHistory } from 'react-router'
import * as nodesActions from './nodes'
import * as objectActions from './object'

export const PATH_SET = 'PATH_SET'
export const setPath = ({
  path,
  objectId,
  taxonomyObjectId,
  mainComponent,
}) =>
  (dispatch) => {
    console.log('actions/path, path:', path)
    console.log('actions/path, objectId:', objectId)
    console.log('actions/path, taxonomyObjectId:', taxonomyObjectId)
    console.log('actions/path, mainComponent:', mainComponent)
    // get nodes if main Component is 'object'
    if (mainComponent === 'object') {
      // TODO:
      // send url to db
      // receive:
      // - path
      // - nodes

      // find out type of node
      let type = objectId ? 'object' : 'taxonomy_object'
      if (path.length === 1) {
        type = 'category'
        const id = path[0]
        dispatch(nodesActions.nodesGetForNode({ type, id }))
      } else if (path.length === 2) {
        type = 'taxonomy'
        // TODO: get nodes
      } else if (objectId) {
        // this is an object node
        const id = objectId
        dispatch(nodesActions.nodesGetForNode({ type, id }))
      } else {
        // this is a taxonomy_node without object
        // need to get it's id
      }

      const url = `/${path.join('/')}${objectId ? `?id=${objectId}` : ''}`
      browserHistory.push(url)
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
