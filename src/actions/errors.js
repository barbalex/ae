export const ERROR_ADD = 'ERROR_ADD'
export const ERROR_REMOVE = 'ERROR_REMOVE'
export const ERROR_REMOVE_ALL = 'ERROR_REMOVE_ALL'

export const addError = (error) =>
  (dispatch) => {
    dispatch({
      type: ERROR_ADD,
      error
    })
    setTimeout(() =>
      dispatch(errorRemove()), 10000
    )
  }

const errorRemove = () => ({
  type: ERROR_REMOVE
})

export const errorRemoveAll = () => ({
  type: ERROR_REMOVE_ALL
})
