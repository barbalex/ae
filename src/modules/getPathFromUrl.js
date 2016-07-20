/**
 * receives location from this.props.location
 * returns path, guid and mainComponent
 */

import getUrlParameterByName from './getUrlParameterByName'

export default (location) => {
  const {
    pathname,
    search,
  } = location
  console.log('getPathFromUrl.js, pathname:', `'${pathname}'`)
  const pathEncoded = pathname === '/' ? [] : pathname.split('/').slice(1)
  const path = pathEncoded.map((p) => decodeURIComponent(p))
  const objectId = getUrlParameterByName('id', search) || null
  console.log('getPathFromUrl.js, path:', path)
  console.log('getPathFromUrl.js, objectId:', objectId)
  let mainComponent = 'object'
  switch (path[0]) {
    case 'importPc':
      mainComponent = 'importPc'
      break
    case 'importRc':
      mainComponent = 'importRc'
      break
    case 'exportieren':
      mainComponent = 'exportieren'
      break
    case 'exportierenAlt':
      mainComponent = 'exportierenAlt'
      break
    case 'organizations':
      mainComponent = 'organizations'
      break
    default:
      mainComponent = 'object'
  }
  return {
    path,
    objectId,
    mainComponent,
  }
}
