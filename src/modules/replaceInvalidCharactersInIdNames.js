'use strict'

export default (idname) =>
  idname.replace(/\s+/g, ' ').replace(/ /g, '').replace(/,/g, '').replace(/\./g, '').replace(/:/g, '').replace(/-/g, '').replace(/\//g, '').replace(/\(/g, '').replace(/\)/g, '').replace(/\&/g, '')
