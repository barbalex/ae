import {
  PATH_CHANGE,
  PATH_SET,
} from '../actions/path'

const standardState = {
  path: [],
  objectId: null,
  taxonomyObjectId: null,
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
        taxonomyObjectId: action.taxonomyObjectId,
        mainComponent: action.mainComponent
      }
    default:
      return state
  }
}

export default path
