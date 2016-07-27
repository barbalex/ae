/**
 * user = logged in user
 */

import {
  NODES_GET_INITIAL,
  NODES_GET_INITIAL_SUCCESS,
  NODES_GET_INITIAL_ERROR,
  NODES_GET_CHILDREN,
  NODES_GET_CHILDREN_SUCCESS,
  NODES_GET_CHILDREN_ERROR,
  NODES_REMOVE_CHILDREN,
  NODES_GET_FOR_NODE,
  NODES_GET_FOR_NODE_SUCCESS,
  NODES_GET_FOR_NODE_ERROR,
} from '../actions/user'
import buildNodes from '../modules/buildNodes'

const standardState = {
  fetchingNodes: false,
  nodes: null,
  error: null,
}

const nodes = (state = standardState, action) => {
  switch (action.type) {
    case NODES_GET_INITIAL:
    case NODES_GET_FOR_NODE:
      return {
        ...state,
        fetchingNodes: true,
        error: null,
      }
    case NODES_GET_INITIAL_SUCCESS:
    case NODES_GET_FOR_NODE_SUCCESS:
      return {
        ...state,
        fetchingNodes: false,
        nodes: buildNodes(action.nodes),
      }
    case NODES_GET_INITIAL_ERROR:
    case NODES_GET_FOR_NODE_ERROR:
      return {
        ...state,
        fetchingNodes: false,
        error: action.error,
      }
    default:
      return state
  }
}

export default nodes
