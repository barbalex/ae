import app from 'ampersand-app'

export default (guid) => new Promise((resolve, reject) => {
  if (!guid) {
    reject('objectStore, getObject: no guid passed')
  }
  app.remoteDb.get(guid)
    .then((item) => resolve(item))
    .catch((error) =>
      reject('objectStore: error getting item from localDb:', error)
    )
})
