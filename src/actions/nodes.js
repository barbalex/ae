/**
 * nodes = nodes in tree view showing taxonomies
 */

/* eslint no-console:0 */

import { browserHistory } from 'react-router'
import getApiBaseUrl from '../modules/getApiBaseUrl.js'
import isGuid from '../modules/isGuid'
import getUrlParameterByName from '../modules/getUrlParameterByName'

export const PATH_SET = 'PATH_SET'
export const setPath = ({
  path,
  id,
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
      dispatch(nodesActions.nodesGetForUrl({ path, id }))

      // find out type of node
      let type = objectId ? 'object' : 'taxonomy_object'
      if (path.length === 1) {
        type = 'category'
        const id = path[0]
        dispatch(nodesActions.nodesGetForUrl({ type, id }))
      } else if (path.length === 2) {
        type = 'taxonomy'
        // TODO: get nodes
      } else if (objectId) {
        // this is an object node
        const id = objectId
        dispatch(nodesActions.nodesGetForUrl({ type, id }))
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

    if (path.length === 2 && path[0] === 'importieren') {
      if (path[1] === 'eigenschaften') {
        mainComponent = 'importPc'
      } else if (path[1] === 'beziehungen') {
        mainComponent = 'importRc'
      }
    } else if (path.length === 1 && isGuid(path[0])) {
      // this is a path of style /<objectId>
      id = path[0]
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

    const pathEncoded = path.map((n) => encodeURIComponent(n))
    let url = `${getApiBaseUrl()}/node/${pathEncoded}/${id}`
    if (!id) {
      url = `${getApiBaseUrl()}/node/${pathEncoded}`
    }
    fetch(url)
      .then((response) => response.json())
      .then((resp) => {
        dispatch({
          type: NODES_GET_FOR_URL_SUCCESS,
          nodes: resp.nodes,
          object: resp.object,
          urlPath: resp.urlPath,
        })
        setPath()
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
