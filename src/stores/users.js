'use strict'

import app from 'ampersand-app'
import Reflux from 'reflux'
import { pluck } from 'lodash'

export default (Actions) => {
  const usersStore = Reflux.createStore({
    /**
     * used to cache users names
     */
    listenables: Actions,

    userNames: [],

    onGetUsers () {
      if (this.userNames.length > 0) this.trigger(this.userNames)
      app.remoteUsersDb.allDocs({ include_docs: true })
        .then((result) => {
          const users = result.rows.map((row) => row.doc)
          const userNames = pluck(users, 'name')
          this.userNames = userNames
          this.trigger(this.userNames)
        })
        .catch((error) =>
          app.Actions.showError({title: 'error fetching organizations from remoteDb:', msg: error})
        )
    }
  })
  return usersStore
}
