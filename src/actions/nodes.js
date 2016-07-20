/**
 * nodes = nodes in tree view showing taxonomies
 */

import getApiBaseUrl from '../modules/getApiBaseUrl.js'

export const NODES_GET_INITIAL = 'NODES_GET_INITIAL'
export const NODES_GET_INITIAL_SUCCESS = 'NODES_GET_INITIAL_SUCCESS'
export const NODES_GET_INITIAL_ERROR = 'NODES_GET_INITIAL_ERROR'

export const nodesGetInitial = () =>
  (dispatch) => {
    dispatch({
      type: NODES_GET_INITIAL
    })
    fetch(`${getApiBaseUrl()}/nodes`)
      .then((response) => response.json())
      .then((nodes) => dispatch({
        type: NODES_GET_INITIAL_SUCCESS,
        nodes
      }))
      .catch((error) => dispatch({
        type: NODES_GET_INITIAL_ERROR,
        error
      }))
  }

export const NODES_GET_FOR_NODE = 'NODES_GET_FOR_NODE'
export const NODES_GET_FOR_NODE_SUCCESS = 'NODES_GET_FOR_NODE_SUCCESS'
export const NODES_GET_FOR_NODE_ERROR = 'NODES_GET_FOR_NODE_ERROR'

export const nodesGetForNode = ({ type, id }) =>
  (dispatch) => {
    dispatch({
      type: NODES_GET_FOR_NODE
    })
    fetch(`${getApiBaseUrl()}/node?type=${type}&objectId=${id}`)
      .then((response) => response.json())
      .then((nodes) => dispatch({
        type: NODES_GET_FOR_NODE_SUCCESS,
        nodes
      }))
      .catch((error) => dispatch({
        type: NODES_GET_FOR_NODE_ERROR,
        error
      }))
  }
