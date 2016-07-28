/**
 * user = logged in user
 */

import {
  NODES_GET_CHILDREN,
  NODES_GET_CHILDREN_SUCCESS,
  NODES_GET_CHILDREN_ERROR,
  NODES_REMOVE_CHILDREN,
  NODES_GET_FOR_URL,
  NODES_GET_FOR_URL_SUCCESS,
  NODES_GET_FOR_URL_ERROR,
  OBJECT_CHANGE,
  OBJECT_CHANGE_SUCCESS,
  OBJECT_CHANGE_ERROR,
} from '../actions/user'
import buildNodes from '../modules/buildNodes'

const standardState = {
  fetchingNodes: false,
  fetchingObject: false,
  nodes: null,
  object: null,
  error: null,
}

const nodes = (state = standardState, action) => {
  switch (action.type) {
    case NODES_GET_FOR_URL:
      return {
        ...state,
        fetchingNodes: true,
        error: null,
      }
    case NODES_GET_FOR_URL_SUCCESS:
      return {
        ...state,
        fetchingNodes: false,
        nodes: buildNodes(action.nodes),
      }
    case NODES_GET_FOR_URL_ERROR:
      return {
        ...state,
        fetchingNodes: false,
        error: action.error,
      }
    case OBJECT_CHANGE:
      return {
        ...state,
        fetchingObject: true,
        object: null,
      }
    case OBJECT_CHANGE_SUCCESS:
      return {
        ...state,
        fetchingObject: false,
        object: action.object,
      }
    case OBJECT_CHANGE_ERROR:
      return {
        ...state,
        fetchingObject: false,
        error: action.error,
      }
    default:
      return state
  }
}

export default nodes
