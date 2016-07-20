import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import app from './app'
import user from './user'
import errors from './errors'
import users, * as fromUsers from './users'
import path from './path'
import groups from './groups'
import nodes from './nodes'
import object from './object'

const rootReducer = combineReducers({
  app,
  user,
  errors,
  users,
  path,
  groups,
  routing,
  nodes,
  object,
})

export default rootReducer

// selectors:
export const getUsersNames = (state) => fromUsers.getUsersNames(state.users)
