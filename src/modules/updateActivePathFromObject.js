/*
 * gets an object passed
 * generates its path
 * and updates it in activePathStore
 */

'use strict'

import app from 'ampersand-app'
import getPathFromObject from './getPathFromObject.js'

export default (object) => {
  const activePathGuid = app.activePathStore.guid
  if (object._id === activePathGuid) {
    const path = getPathFromObject(object)
    if (path) app.Actions.loadActivePath(path, object._id)
  }
}