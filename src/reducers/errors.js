import {
  ERROR_ADD,
  ERROR_REMOVE,
  ERROR_REMOVE_ALL,
} from '../actions/errors'

const standardState = {
  errors: []
}

const errors = (state = standardState, action) => {
  switch (action.type) {
    case ERROR_ADD:
      return {
        errors: [...state.errors, action.error]
      }
    case ERROR_REMOVE:
      return {
        errors: state.errors.slice(0, state.errors.length - 1)
      }
    case ERROR_REMOVE_ALL:
      return {
        errors: []
      }
    default:
      return []
  }
}

export default errors
