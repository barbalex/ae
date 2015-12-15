'use strict'

import axios from 'axios'

export default (username) => {
  return new Promise((resolve, reject) => {
    const url = `${window.location.protocol}//${window.location.hostname}:8080/userroles/${username}`
    axios.get(url)
      .then((roles) => resolve(roles))
      .catch((error) => reject((error))
    )
  })
}