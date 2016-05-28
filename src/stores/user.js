'use strict'

import app from 'ampersand-app'
import Reflux from 'reflux'
import refreshUserRoles from '../modules/refreshUserRoles.js'

export default (Actions) => Reflux.createStore({
  /*
   * contains email and roles of logged in user
   * well, it is saved in pouch as local doc _local/login
   * and contains "logIn" bool which states if user needs to log in
   * app.js sets default _local/login if not exists on app start
   */
  listenables: Actions,

  getLogin() {
    return new Promise((resolve, reject) => {
      app.localDb.get('_local/login')
        .then((doc) => {
          refreshUserRoles(doc.email)
          resolve(doc)
        })
        .catch((error) =>
          reject(`userStore: error getting login from localDb: ${error}`)
        )
    })
  },

  onLogin({ logIn, email, roles }) {
    app.localDb.get('_local/login')
      .then((doc) => {
        doc.logIn = logIn
        doc.email = email || undefined
        doc.roles = roles || []
        this.trigger({ logIn, email, roles })
        /*
         * need to requery organizations if they have been loaded
         * because isUserAdmin needs to be updated
         */
        if (email && app.organizationsStore.organizations.length > 0) {
          app.Actions.getOrganizations(email)
        }
        return app.localDb.put(doc)
      })
      .catch((error) =>
        app.Actions.showError({
          title: 'userStore: error logging in:',
          msg: error
        })
      )
  }
})
