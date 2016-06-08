'use strict'

import React from 'react'
import { Router, Route, browserHistory } from 'react-router'
import configureStore from './configureStore.js'
import { Provider } from 'react-redux'
import Home from './containers/Home.js'

export default () =>
  <Provider store={configureStore()}>
    <Router history={browserHistory}>
      <Route
        path="/"
        component={Home}
      />
      <Route
        path="*"
        component={Home}
      />
      <Route
        path="/**/*"
        component={Home}
      />
    </Router>
  </Provider>
