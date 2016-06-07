'use strict'

import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import app from './app'
import groups from './groups'

const rootReducer = combineReducers({
  app,
  groups,
  routing
})

export default rootReducer
