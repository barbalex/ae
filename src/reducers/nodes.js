/**
 * user = logged in user
 */

import {
  NODE_CHILDREN_ADD,
  NODE_CHILDREN_ADD_SUCCESS,
  NODE_CHILDREN_ADD_ERROR,
  NODE_CHILDREN_REMOVE,
  NODES_GET_FOR_URL,
  NODES_GET_FOR_URL_SUCCESS,
  NODES_GET_FOR_URL_ERROR,
  OBJECT_CHANGE,
  OBJECT_CHANGE_SUCCESS,
  OBJECT_CHANGE_ERROR,
} from '../actions/user'

const standardState = {
  fetchingNodes: false,
  fetchingObject: false,
  nodes: [],
  object: {},
  error: null,
  namePath: [],
  idPath: [],
  mainComponent: null
}

const nodes = (state = standardState, action) => {
  switch (action.type) {
    case NODE_CHILDREN_REMOVE:
      return {
        ...state,
        fetchingNodes: false,
        nodes: [...state.nodes.filter((n) => {
          // root node has no path
          if (!n.path) return true
          // dont remove top level nodes
          if (n.path.length === 1) return true
          return !n.path.includes(action.node.id)
        })],
        namePath: action.namePath,
        idPath: action.idPath,
      }
    case NODE_CHILDREN_ADD_SUCCESS:
      return {
        ...state,
        fetchingNodes: false,
        nodes: state.nodes.concat(action.children),
        namePath: [...state.namePath, action.node.data.name],
        idPath: [...state.idPath, action.node.id],
      }
    case NODES_GET_FOR_URL:
    case NODE_CHILDREN_ADD:
      return {
        ...state,
        fetchingNodes: true,
        error: null,
      }
    case NODES_GET_FOR_URL_SUCCESS:
      return {
        ...state,
        fetchingNodes: false,
        nodes: action.nodes,
        object: action.object || {},
        namePath: action.namePath || [],
        idPath: action.idPath || [],
        mainComponent: action.mainComponent,
      }
    case NODES_GET_FOR_URL_ERROR:
    case NODE_CHILDREN_ADD_ERROR:
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
