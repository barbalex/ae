'use strict'

import app from 'ampersand-app'
import Reflux from 'reflux'
import { map } from 'lodash'

export default (Actions) => Reflux.createStore({
  /**
   * used to cache users names
   */
  listenables: Actions,

  userNames: [],

  onGetUsers() {
    if (this.userNames.length > 0) {
      this.trigger(this.userNames)
    }
    app.remoteUsersDb.allDocs({ include_docs: true })
      .then((result) => {
        const users = result.rows.map((row) =>
          row.doc
        )
        const userNames = map(users, 'name')
        this.userNames = userNames
        this.trigger(this.userNames)
      })
      .catch((error) =>
        app.Actions.showError({
          title: 'error fetching organizations from remoteDb:',
          msg: error
        })
      )
  }
})
