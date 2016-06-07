import { browserHistory } from 'react-router'

export const PATH_CHANGE = 'PATH_CHANGE'
export const changePath = ({
  path,
  guid,
  gruppe,
  mainComponent
}) =>
  (dispatch) => {
    dispatch({
      type: PATH_CHANGE,
      path,
      guid,
      gruppe,
      mainComponent
    })
    const url = `/${path.join('/')}${guid ? `?id=${guid}` : ''}`
    browserHistory.push(url)
  }
