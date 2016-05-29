'use strict'

import app from 'ampersand-app'
import Router from 'ampersand-router'
import React from 'react'
import ReactDOM from 'react-dom'
import Home from './components/Home.js'
import replaceProblematicPathCharactersFromArray from './modules/replaceProblematicPathCharactersFromArray.js'
import extractInfoFromPath from './modules/extractInfoFromPath.js'

export default Router.extend({
  routes: {
    'index.html?exportieren_fuer_artenlistentool=true': 'exportAlt',
    'exportieren/artenlistentool': 'exportAlt',
    '*path': 'home'
  },

  exportAlt() {
    ReactDOM.render(
      <Home
        gruppe={null}
        guid={null}
        path={['exportieren', 'artenlistentool']}
        mainComponent={'exportAlt'}
        email={null}
      />,
      document.getElementById('root')
    )
  },

  // all object paths depend on data i.e. are unpredictable
  // that is why there is only one route and it is analysed with a series of if's
  home(pathName) {
    // this is the entry point of the application
    // > read props from url
    let path = pathName ? pathName.split('/') : []
    path = replaceProblematicPathCharactersFromArray(path)

    app.userStore.getLogin()
      .then((login) => {
        const { email } = login
        const {
          mainComponent,
          gruppe,
          guid
        } = extractInfoFromPath(path)

        ReactDOM.render(
          <Home
            gruppe={gruppe}
            guid={guid}
            path={path}
            mainComponent={mainComponent}
            email={email}
          />,
          document.getElementById('root')
        )
      })
      .catch((error) =>
        app.Actions.showError({
          title: 'router.js: error during routing:',
          msg: error
        })
      )
  }
})
