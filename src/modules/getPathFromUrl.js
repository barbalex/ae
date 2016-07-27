/**
 * receives location from this.props.location
 * returns path, guid and mainComponent
 */

import isGuid from './isGuid'
import getUrlParameterByName from './getUrlParameterByName'
import getPathFromObjectId from './getPathFromObjectId'

export default (location) =>
  new Promise((resolve) => {
    const {
      pathname,
      search,
    } = location
    let replacePathFromObjectTaxonomy = false
    const pathEncoded = pathname === '/' ? [] : pathname.split('/').slice(1)
    const path = pathEncoded.map((p) => decodeURIComponent(p))
    let objectId = getUrlParameterByName('id', search)
    let mainComponent = null
    if (path.length === 2 && path[0] === 'importieren') {
      if (path[1] === 'eigenschaften') {
        mainComponent = 'importPc'
      } else if (path[1] === 'beziehungen') {
        mainComponent = 'importRc'
      }
    } else if (path.length === 1 && isGuid(path[0])) {
      // this is a path of style /<objectId>
      objectId = path[0]
      mainComponent = 'object'
      // need to replace path from objectId
      replacePathFromObjectTaxonomy = true
    } else if (path.length === 1 && path[0] === 'exportieren') {
      mainComponent = 'exportieren'
    } else if (path.length === 1 && path[0] === 'index.html') {
      // this is a path of style /index.html?id=<objectId>
      // it was used in a previous app version
      // and is still called by ALT and EvAB
      mainComponent = 'object'
      // need to set replace path from objectId
      replacePathFromObjectTaxonomy = true
    } else if (path.length === 1 && path[0] === 'organisationen') {
      mainComponent = 'organizations'
    } else if (path.length === 2 && path[0] === 'exportieren' && path[1] === 'artenlistentool') {
      mainComponent = 'exportierenAlt'
    } else if (path[0]) {
      // this would be an object url
      mainComponent = 'object'
    } else {
      // must be home
    }

    if (replacePathFromObjectTaxonomy) {
      getPathFromObjectId(objectId)
        .then((pathFromObjectId) =>
          resolve({
            path: pathFromObjectId,
            objectId,
            mainComponent,
          })
        )
        .catch((error) => console.log(error))
    } else {
      resolve({
        path,
        objectId,
        mainComponent,
      })
    }
  })
