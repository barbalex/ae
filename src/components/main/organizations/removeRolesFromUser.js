'use strict'

export default (username, roles) =>
  new Promise((resolve, reject) =>
    fetch(`${window.location.protocol}//${window.location.hostname}:8000/removeuserroles/user/${username}/roles/${JSON.stringify(roles)}`)
      .then(() => resolve(null))
      .catch((error) => reject((error))
    )
  )
