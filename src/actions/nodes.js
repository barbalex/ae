/**
 * nodes = nodes in tree view showing taxonomies
 */

/* eslint no-console:0 */

import { browserHistory } from 'react-router'
import getApiBaseUrl from '../modules/getApiBaseUrl.js'
import isGuid from '../modules/isGuid'
import getUrlParameterByName from '../modules/getUrlParameterByName'

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
    console.log('actions/node: pathString:', pathString)
    const path = pathString.map((p) => decodeURIComponent(p))
    console.log('actions/node: path:', path)
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

    const pathEncoded = JSON.stringify(path.map((n) => encodeURIComponent(n)))
    console.log('actions/node: pathEncoded:', pathEncoded)
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
          namePath: resp.namePath,
          idPath: resp.idPath,
        })
        const newPath = resp.idPath
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
