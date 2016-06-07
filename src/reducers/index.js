'use strict'

import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import app from './app'
import path from './path'
import groups from './groups'

const rootReducer = combineReducers({
  app,
  path,
  groups,
  routing
})

export default rootReducer
