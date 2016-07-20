import getApiBaseUrl from '../modules/getApiBaseUrl'

export const OBJECT_CHANGE = 'OBJECT_CHANGE'
export const OBJECT_CHANGE_SUCCESS = 'OBJECT_CHANGE_SUCCESS'
export const OBJECT_CHANGE_ERROR = 'OBJECT_CHANGE_ERROR'
export const objectChange = ({
  id,
}) =>
  (dispatch) => {
    dispatch({
      type: OBJECT_CHANGE,
    })
    if (id) {
      fetch(`${getApiBaseUrl()}/object/${id}`)
        .then((response) => response.json())
        .then((object) => dispatch({
          type: OBJECT_CHANGE_SUCCESS,
          object
        }))
        .catch((error) => dispatch({
          type: OBJECT_CHANGE_ERROR,
          error
        }))
    } else {
      dispatch({
        type: OBJECT_CHANGE_SUCCESS,
        id: null,
      })
    }
  }
