import {
  PATH_CHANGE,
  PATH_SET,
} from '../actions/path'

const standardState = {
  path: [],
  objectId: null,
  mainComponent: null
}

const path = (state = standardState, action) => {
  switch (action.type) {
    case PATH_CHANGE:
    case PATH_SET:
      return {
        ...state,
        path: action.path,
        objectId: action.objectId,
        mainComponent: action.mainComponent
      }
    default:
      return state
  }
}

export default path
