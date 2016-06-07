import {
  PATH_CHANGE
} from '../actions/path'

const standardState = {
  path: [],
  guid: null,
  gruppe: null,
  mainComponent: null
}

const path = (state = standardState, action) => {
  switch (action.type) {
    case PATH_CHANGE:
      return {
        ...state,
        path: action.path,
        guid: action.guid,
        gruppe: action.gruppe,
        mainComponent: action.mainComponent
      }
    default:
      return state
  }
}

export default path
