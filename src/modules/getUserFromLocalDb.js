import refreshUserRoles from './refreshUserRoles.js'

export default (localDb) =>
  new Promise((resolve, reject) => {
    if (!localDb) {
      reject('getUserFromLocalDb.js: no localDb passed')
    }
    localDb.get('_local/user')
      .then((user) => {
        refreshUserRoles(user.name)
        resolve(user)
      })
      .catch((error) =>
        reject('getUserFromLocalDb.js, error getting user from localDb:', error)
      )
  })
