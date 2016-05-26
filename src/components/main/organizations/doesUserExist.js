'use strict'

export default (username) =>
  new Promise((resolve, reject) =>
    fetch(`${window.location.protocol}//${window.location.hostname}:8000/doesuserexist/${username}`)
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          resolve(data)
        } else {
          resolve(null)
        }
      })
      .catch((error) => reject(error))
  )
