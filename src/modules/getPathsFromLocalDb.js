import app from 'ampersand-app'

export default () => new Promise((resolve, reject) => {
  app.localDb.get('_local/paths')
    .then((doc) => resolve(doc.paths))
    .catch((error) => {
      if (error.status === 404) {
        // not found > paths not created yet
        // this is expected if docs are not yet locally available
        return resolve(null)
      }
      reject('getPathsFromLocalDb: error getting paths from localDb:', error)
    })
})
