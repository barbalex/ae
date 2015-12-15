'use strict'

import axios from 'axios'

export default (username) => {
  return new Promise((resolve, reject) => {
    const url = `${window.location.protocol}//${window.location.hostname}:8080/doesuserexist/${username}`
    axios.get(url)
      .then((result) => resolve(result))
      .catch((error) => reject((error))
    )
  })
}