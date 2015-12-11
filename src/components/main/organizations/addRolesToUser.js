'use strict'

import axios from 'axios'

export default (username, roles) => {
  return new Promise((resolve, reject) => {
    const url = `${window.location.protocol}//${window.location.hostname}:8080/adduserroles/user/${username}/roles/${roles}`
    axios.post(url)
      .then(() => resolve(null))
      .catch((error) => reject((error))
    )
  })
}
