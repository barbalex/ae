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
  NODE_GET,
  NODE_GET_SUCCESS,
  NODE_GET_ERROR,
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
      return {
        ...state,
        fetchingNodes: true,
        nodes: null,
        error: null,
      }
    case NODES_GET_INITIAL_SUCCESS:
      return {
        ...state,
        fetchingNodes: false,
        nodes: buildNodes(action.nodes),
      }
    case NODES_GET_INITIAL_ERROR:
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
