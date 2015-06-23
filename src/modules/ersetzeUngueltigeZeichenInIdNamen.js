'use strict'

export default function (idname) {
  return idname.replace(/\s+/g, ' ').replace(/ /g, '').replace(/,/g, '').replace(/\./g, '').replace(/:/g, '').replace(/-/g, '').replace(/\//g, '').replace(/\(/g, '').replace(/\)/g, '').replace(/\&/g, '')
}
