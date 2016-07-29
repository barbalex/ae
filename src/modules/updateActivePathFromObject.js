/*
 * gets an object passed
 * generates its path
 * and updates it in activePathStore
 */

import app from 'ampersand-app'
import getPathFromObject from './getPathFromObject.js'

export default (object) => {
  const activePathGuid = app.activePathStore.guid
  if (object.id === activePathGuid) {
    const path = getPathFromObject(object)
    if (path) app.Actions.loadActivePath(path, object.id)
  }
}
