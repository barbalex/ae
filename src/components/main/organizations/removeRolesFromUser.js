'use strict'

export default (username, roles) => {
  return new Promise((resolve, reject) => {
    const url = `${window.location.protocol}//${window.location.hostname}:8000/removeuserroles/user/${username}/roles/${JSON.stringify(roles)}`
    fetch(url)
      .then(() => resolve(null))
      .catch((error) => reject((error))
    )
  })
}
