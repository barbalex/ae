/**
 * nodes = nodes in tree view showing taxonomies
 */

/* eslint no-console:0 */

import { browserHistory } from 'react-router'
import getApiBaseUrl from '../modules/getApiBaseUrl.js'
import isGuid from '../modules/isGuid'
import getUrlParameterByName from '../modules/getUrlParameterByName'
import getNamePathFromNodeAndNodes from '../modules/getNamePathFromNodeAndNodes'

export const NODE_CHILDREN_REMOVE = 'NODE_CHILDREN_REMOVE'
export const nodeChildrenRemove = (node) =>
  (dispatch, getState) => {
    const { nodes } = getState()
    // find index of name in path
    const indexOfNodeInNamePath = nodes.namePath.indexOf(node.data.name)
    nodes.namePath.length = indexOfNodeInNamePath
    nodes.idPath.length = indexOfNodeInNamePath
    // TODO: get object of new active node (Lebensräume)
    // then add id to url if necessary
    const objectId = nodes.idPath[nodes.idPath.length - 1]
    const newUrl = `/${nodes.namePath.join('/')}${node.data.object_id ? `?id=${node.data.object_id}` : ''}`
    browserHistory.push(newUrl)
    dispatch({
      type: NODE_CHILDREN_REMOVE,
      node,
      namePath: nodes.namePath,
      idPath: nodes.idPath,
    })
  }

export const NODE_CHILDREN_ADD = 'NODE_CHILDREN_ADD'
export const NODE_CHILDREN_ADD_SUCCESS = 'NODE_CHILDREN_ADD_SUCCESS'
export const NODE_CHILDREN_ADD_ERROR = 'NODE_CHILDREN_ADD_ERROR'
export const nodeChildrenAdd = (node) =>
  (dispatch, getState) => {
    fetch(`${getApiBaseUrl()}/nodes/${node.data.type}/${node.id}/children`)
      .then((response) => response.json())
      .then((children) => {
        // TODO: if node.data.object_id, fetch object
        const { nodes } = getState()
        // const newPath = nodes.namePath.concat(node.data.name)
        const newPath = getNamePathFromNodeAndNodes(node, nodes.nodes)
        console.log('actions/nodeChildrenAdd, newPath:', newPath)
        const newUrl = `/${newPath.join('/')}${node.data.object_id ? `?id=${node.data.object_id}` : ''}`
        console.log('actions/nodeChildrenAdd, newUrl:', newUrl)
        browserHistory.push(newUrl)
        dispatch({
          type: NODE_CHILDREN_ADD_SUCCESS,
          node,
          children,
        })
      })
      .catch((error) => dispatch({
        type: NODES_GET_FOR_URL_ERROR,
        error
      }))
  }

export const NODES_GET_FOR_URL = 'NODES_GET_FOR_URL'
export const NODES_GET_FOR_URL_SUCCESS = 'NODES_GET_FOR_URL_SUCCESS'
export const NODES_GET_FOR_URL_ERROR = 'NODES_GET_FOR_URL_ERROR'

export const nodesGetForUrl = (location) =>
  (dispatch) => {
    dispatch({
      type: NODES_GET_FOR_URL
    })
    const {
      pathname,
      search,
    } = location
    const pathString = pathname === '/' ? [] : pathname.split('/').slice(1)
    const path = pathString.map((p) => decodeURIComponent(p))
    let id = getUrlParameterByName('id', search)
    let mainComponent = null
    let idPath = false

    if (path.length === 2 && path[0] === 'importieren') {
      if (path[1] === 'eigenschaften') {
        mainComponent = 'importPc'
      } else if (path[1] === 'beziehungen') {
        mainComponent = 'importRc'
      }
    } else if (path.length === 1 && isGuid(path[0])) {
      // this is a path of style /<objectId>
      id = path[0]
      idPath = true
      mainComponent = 'object'
    } else if (path.length === 1 && path[0] === 'exportieren') {
      mainComponent = 'exportieren'
    } else if (path.length === 1 && path[0] === 'index.html') {
      // this is a path of style /index.html?id=<objectId>
      // it was used in a previous app version
      // and is still called by ALT and EvAB
      mainComponent = 'object'
    } else if (path.length === 1 && path[0] === 'organisationen') {
      mainComponent = 'organizations'
    } else if (path.length === 2 && path[0] === 'exportieren' && path[1] === 'artenlistentool') {
      mainComponent = 'exportierenAlt'
    } else if (path[0]) {
      // this would be an object url
      mainComponent = 'object'
    } else {
      // must be home
      mainComponent = 'home'
    }

    const pathEncoded = JSON.stringify(path.map((n) => encodeURIComponent(n)))
    let url = `${getApiBaseUrl()}/node/${pathEncoded}/${id}`
    if (!id || idPath) {
      url = `${getApiBaseUrl()}/node/${pathEncoded}`
    }
    fetch(url)
      .then((response) => response.json())
      .then((resp) => {
        dispatch({
          type: NODES_GET_FOR_URL_SUCCESS,
          nodes: resp.nodes,
          object: resp.object,
          namePath: resp.namePath,
          idPath: resp.idPath,
          mainComponent,
        })
        const newPath = resp.namePath
        const newUrl = `/${newPath.join('/')}${id ? `?id=${id}` : ''}`
        browserHistory.push(newUrl)
      })
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
