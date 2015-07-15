'use strict'

import app from 'ampersand-app'
import Router from 'ampersand-router'
import React from 'react'
import Home from './components/home.js'
import getUrlParameterByName from './modules/getUrlParameterByName.js'
import isGuid from './modules/isGuid.js'

export default Router.extend({
  routes: {
    '': 'home',
    '*path': 'home'
  },

  home (pathName) {
    // this is the enter point of the application
    // > read state from url
    const path = pathName ? pathName.split('/') : []
    // guidPath is when only a guid is contained in url
    const isGuidPath = path.length === 1 && isGuid(path[0])
    const guid = isGuidPath ? path[0] : getUrlParameterByName('id')
    const gruppe = isGuidPath ? null : (path[0] ? path[0] : null)

    // kick off stores
    if (guid) {
      app.Actions.loadActiveObjectStore(guid)
    } else {
      // loadActiveObjectStore loads objectStore too, so don't do it twice
      if (gruppe) app.Actions.loadObjectStore(gruppe)
    }
    app.Actions.loadPathStore(path, guid)

    // TODO: get url and its params and pass them as props
    React.render(<Home isGuidPath={isGuidPath} gruppe={gruppe} guid={guid} path={path} />, document.body)
  }
})
