import React from 'react'
import { Router, Route, browserHistory } from 'react-router'
import configureStore from './configureStore.js'
import { Provider } from 'react-redux'
import HomeCt from './components/HomeCt.js'

export default () =>
  <Provider store={configureStore()}>
    <Router history={browserHistory}>
      <Route
        path="/"
        component={HomeCt}
      />
      <Route
        path="*"
        component={HomeCt}
      />
      <Route
        path="/**/*"
        component={HomeCt}
      />
    </Router>
  </Provider>
