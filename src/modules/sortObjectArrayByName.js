'use strict'

export default (objectArray) => {
  objectArray.sort((a, b) => {
    const aName = a.Name
    const bName = b.Name
    if (aName && bName) {
      return (aName.toLowerCase() === bName.toLowerCase()) ? 0 : (aName.toLowerCase() > bName.toLowerCase()) ? 1 : -1
    }
    return (aName === bName) ? 0 : (aName > bName) ? 1 : -1
  })
  return objectArray
}
