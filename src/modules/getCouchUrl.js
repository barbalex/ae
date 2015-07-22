'use strict'

export default function () {
  // in development should return local path
  return window.location.protocol + '//' + window.location.hostname + ':5984/artendb'
}
