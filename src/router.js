'use strict'

import app from 'ampersand-app'
import Router from 'ampersand-router'
import React from 'react'
import ReactDOM from 'react-dom'
import Home from './components/home.js'
import getUrlParameterByName from './modules/getUrlParameterByName.js'
import isGuid from './modules/isGuid.js'
import replaceProblematicPathCharactersFromArray from './modules/replaceProblematicPathCharactersFromArray.js'

export default Router.extend({
  routes: {
    'index.html?exportieren_fuer_artenlistentool=true': 'exportAlt',
    '*path': 'home'
  },

  exportAlt () {
    ReactDOM.render(
      <Home
        gruppe={null}
        guid={null}
        path={['exportieren', 'artenlistentool']}
        mainComponent={'exportAlt'}
        email={null} />,
      document.getElementById('root')
    )
  },

  // all object paths depend on data i.e. are unpredictable
  // that is why there is only one route and it is analysed with a series of if's
  home (pathName) {
    // this is the entry point of the application
    // > read props from url
    let path = pathName ? pathName.split('/') : []
    path = replaceProblematicPathCharactersFromArray(path)

    // a regular url consists of hierarchy names
    // followed by ?id=<guid> if an object is shown
    let guid = getUrlParameterByName('id')
    let gruppe = null
    let mainComponent = null

    app.loginStore.getLogin()
      .then((login) => {
        const email = login.email

        if (path.length === 2 && path[0] === 'importieren') {
          if (path[1] === 'eigenschaften') {
            mainComponent = 'importPc'
            gruppe = null
          } else if (path[1] === 'beziehungen') {
            mainComponent = 'importPc'
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

        ReactDOM.render(
          <Home
            gruppe={gruppe}
            guid={guid}
            path={path}
            mainComponent={mainComponent}
            email={email} />,
          document.getElementById('root')
        )
      })
      .catch((error) => app.Actions.showError({title: 'router.js: error during routing:', msg: error}))
  }
})
