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
  const pathEncoded = pathname === '/' ? [] : pathname.split('/').slice(1)
  const path = pathEncoded.map((p) => decodeURIComponent(p))
  const objectId = getUrlParameterByName('id', search)
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
