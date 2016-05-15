'use strict'

export default (username) => {
  return new Promise((resolve, reject) => {
    const url = `${window.location.protocol}//${window.location.hostname}:8000/doesuserexist/${username}`
    fetch(url)
      .then((result) => {
        if (result && result.data) {
          resolve(result.data)
        } else {
          resolve(null)
        }
      })
      .catch((error) => reject((error))
    )
  })
}
