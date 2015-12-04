'use strict'

/**
 * gets path
 * returns mainComponent and gruppe
 * for guidPaths also returns guid BUT NOT FOR OTHER OBJECT PATHS
 */

import isGuid from './isGuid.js'
import getUrlParameterByName from './getUrlParameterByName.js'

export default (path) => {
  let mainComponent = null
  let gruppe = null
  let guid  // will be undefined of not defined below

  if (path.length === 2 && path[0] === 'importieren') {
    if (path[1] === 'eigenschaften') {
      mainComponent = 'importPc'
      gruppe = null
    } else if (path[1] === 'beziehungen') {
      mainComponent = 'importRc'
      gruppe = null
    }
  } else if (path.length === 1 && isGuid(path[0])) {
    // this is a path of style /<guid>
    guid = path[0]
    gruppe = null
  } else if (path.length === 1 && path[0] === 'exportieren') {
    // this is a path of style /<guid>
    mainComponent = 'exportieren'
    gruppe = null
  } else if (path.length === 1 && path[0] === 'indexhtml') {
    // this is a path of style /index.html?id=<guid>
    // it was used in a previous app version
    // and is still called by ALT and EvAB
    guid = getUrlParameterByName('id')
    gruppe = null
  } else if (path.length === 1 && path[0] === 'organisationen') {
    mainComponent = 'organizations'
    gruppe = null
  } else if (path.length === 2 && path[0] === 'exportieren' && path[1] === 'artenlistentool') {
    mainComponent = 'exportierenAlt'
  } else if (path[0]) {
    // this would be an object url
    gruppe = path[0]
  } else {
    // must be home
    gruppe = null
  }

  return { mainComponent, gruppe, guid }
}
