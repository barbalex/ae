'use strict'

export default (username) => new Promise((resolve, reject) => {
  const url = `${window.location.protocol}//${window.location.hostname}:8000/userroles/${username}`
  fetch(url)
    .then((result) => resolve(result.data))
    .catch((error) => reject((error))
  )
})
