import getApiBaseUrl from './getApiBaseUrl'

export default (objectId) =>
  fetch(`${getApiBaseUrl()}/path/${objectId}`)
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.log(error))
