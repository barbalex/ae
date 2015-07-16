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
    '*path': 'home'
  },

  home (pathName) {
    // this is the entry point of the application
    // > read props from url
    let path = pathName ? pathName.split('/') : []
    path = replaceProblematicPathCharactersFromArray(path)

    // a regular url consists of hierarchy names
    // followed by ?id=<guid> if an object is shown
    let guid = getUrlParameterByName('id')
    let gruppe = path[0] ? path[0] : null
    let isGuidPath = false

    if (path.length === 1 && isGuid(path[0])) {
      // this is a path of style /<guid>
      isGuidPath = true
      guid = path[0]
      gruppe = null
    }

    if (path.length === 1 && path[0] === 'indexhtml') {
      // this is a path of style /index.html?id=<guid>
      // it was used in a previous app version
      // and is still called by ALT and EvAB
      guid = getUrlParameterByName('id')
      gruppe = null
      isGuidPath = true
    }

    // TODO: load store from pouch
    // that action then kicks off the stores
    app.Actions.loadObjectStoreFromPouch(path, gruppe, guid)

    // THEN - WHEN?
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
