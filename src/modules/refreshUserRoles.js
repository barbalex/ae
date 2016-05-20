'use strict'

import app from 'ampersand-app'
import getRolesOfUser from '../components/main/organizations/getRolesOfUser.js'

export default (email) => {
  if (email) {
    getRolesOfUser(email)
      .then((roles) => {
        if (roles) {
          app.Actions.login({
            logIn: false,
            email,
            roles
          })
        }
      })
      .catch((error) => app.Actions.showError({
        title: 'Error trying to refresh users roles:',
        msg: error
      }))
  }
}
