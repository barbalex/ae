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
    let guid = null
    let gruppe = null
    let showImportPC = false
    let showImportRC = false

    app.loginStore.getLogin()
      .then(function (login) {
        const email = login.email

        if (path.length === 2 && path[0] === 'importieren') {
          if (path[1] === 'eigenschaften') {
            showImportPC = true
            gruppe = null
          } else if (path[1] === 'beziehungen') {
            showImportPC = true
            gruppe = null
          }
        } else if (path.length === 1 && isGuid(path[0])) {
          // this is a path of style /<guid>
          guid = path[0]
          gruppe = null
        } else if (path.length === 1 && path[0] === 'indexhtml') {
          // this is a path of style /index.html?id=<guid>
          // it was used in a previous app version
          // and is still called by ALT and EvAB
          guid = getUrlParameterByName('id')
          gruppe = null
        } else if (path.length === 1 && path[0] === 'organisationen_und_benutzer') {
          gruppe = null
        } else {
          // this would be some species url
          // or home
          gruppe = path[0] ? path[0] : null
        }

        React.render(
          <Home
            gruppe={gruppe}
            guid={guid}
            path={path}
            showImportPC={showImportPC}
            showImportRC={showImportRC}
            email={email} />,
          document.body
        )
      })
      .catch(function (error) {
        console.log('router.js: error getting login:', error)
      })
  }
})
