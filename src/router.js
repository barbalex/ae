'use strict'

import app from 'ampersand-app'
import Router from 'ampersand-router'
import React from 'react'
import Home from './components/home.js'
import getUrlParameterByName from './modules/getUrlParameterByName.js'
import isGuid from './modules/isGuid.js'
import replaceProblematicPathCharactersFromArray from './modules/replaceProblematicPathCharactersFromArray.js'

export default Router.extend({
  routes: {
    '': 'home',
    '*path': 'home'
  },

  home (pathName) {
    // this is the enter point of the application
    // > read state from url
    let path = pathName ? pathName.split('/') : []
    path = replaceProblematicPathCharactersFromArray(path)

    // guidPath is when only a guid is contained in url
    let isGuidPath = path.length === 1 && (isGuid(path[0] || path[0] === 'indexhtml'))
    let guid = isGuidPath ? path[0] : getUrlParameterByName('id')
    let gruppe = isGuidPath ? null : (path[0] ? path[0] : null)

    if (path.length === 1 && path[0] === 'indexhtml') {
      // this is a path of style /index.html?id=xxx
      guid = getUrlParameterByName('id')
      gruppe = null
      isGuidPath = true
    }

    // kick off stores
    if (guid) {
      app.Actions.loadActiveObjectStore(guid)
    } else {
      // loadActiveObjectStore loads objectStore too, so don't do it twice
      if (gruppe) app.Actions.loadObjectStore(gruppe)
    }
    app.Actions.loadPathStore(path, guid)

    React.render(<Home isGuidPath={isGuidPath} gruppe={gruppe} guid={guid} path={path} />, document.body)
  }
})
