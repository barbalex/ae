/**
 * nodes = nodes in tree view showing taxonomies
 */

import getApiBaseUrl from '../getApiBaseUrl.js'

export const NODES_GET_INITIAL = 'NODES_GET_INITIAL'
export const NODES_GET_INITIAL_SUCCESS = 'NODES_GET_INITIAL_SUCCESS'
export const NODES_GET_INITIAL_ERROR = 'NODES_GET_INITIAL_ERROR'

export const getNodesInitial = () =>
  (dispatch) => {
    dispatch({
      type: NODES_GET_INITIAL
    })
    fetch(`${getApiBaseUrl()}/nodes`)
      .then((nodes) => dispatch({
        type: NODES_GET_INITIAL_SUCCESS,
        nodes
      }))
      .catch((error) => dispatch({
        type: NODES_GET_INITIAL_ERROR,
        error
      }))
  }
