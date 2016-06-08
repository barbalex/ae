import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import app from './app'
import user from './user'
import users, * as fromUsers from './users'
import path from './path'
import groups from './groups'

const rootReducer = combineReducers({
  app,
  user,
  users,
  path,
  groups,
  routing
})

export default rootReducer

// selectors:
export const getUsersNames = (state) => fromUsers.getUsersNames(state.users)
