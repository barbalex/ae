/**
 * nodes = nodes in tree view showing taxonomies
 */

import getApiBaseUrl from '../modules/getApiBaseUrl.js'

export const NODES_GET_FOR_URL = 'NODES_GET_FOR_URL'
export const NODES_GET_FOR_URL_SUCCESS = 'NODES_GET_FOR_URL_SUCCESS'
export const NODES_GET_FOR_URL_ERROR = 'NODES_GET_FOR_URL_ERROR'

export const nodesGetForUrl = ({ path, id }) =>
  (dispatch) => {
    dispatch({
      type: NODES_GET_FOR_URL
    })
    // TODO: url-encode path array elements
    fetch(`${getApiBaseUrl()}/node/${path}/${id}`)
      .then((response) => response.json())
      .then((nodes) => dispatch({
        type: NODES_GET_FOR_URL_SUCCESS,
        nodes
      }))
      .catch((error) => dispatch({
        type: NODES_GET_FOR_URL_ERROR,
        error
      }))
  }

export const OBJECT_CHANGE = 'OBJECT_CHANGE'
export const OBJECT_CHANGE_SUCCESS = 'OBJECT_CHANGE_SUCCESS'
export const OBJECT_CHANGE_ERROR = 'OBJECT_CHANGE_ERROR'
export const objectChange = ({
  id,
}) =>
  (dispatch) => {
    dispatch({
      type: OBJECT_CHANGE,
    })
    if (id) {
      fetch(`${getApiBaseUrl()}/object/${id}`)
        .then((response) => response.json())
        .then((object) => dispatch({
          type: OBJECT_CHANGE_SUCCESS,
          object
        }))
        .catch((error) => dispatch({
          type: OBJECT_CHANGE_ERROR,
          error
        }))
    } else {
      dispatch({
        type: OBJECT_CHANGE_SUCCESS,
        id: null,
      })
    }
  }
