'use strict'

import { createStore, applyMiddleware } from 'redux'
import { hashHistory } from 'react-router'
import { routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'
import promise from 'redux-promise'
import createLogger from 'redux-logger'
import rootReducer from './reducers'

const router = routerMiddleware(hashHistory)
const middlewares = [thunk, router, promise]

if (process.env.NODE_ENV !== 'production') {
  const logger = createLogger()
  middlewares.push(logger)
}

const enhancer = applyMiddleware(...middlewares)

export default function configureStore() {
  return createStore(rootReducer, enhancer)
}
