'use strict'

import app from 'ampersand-app'
import Reflux from 'reflux'

export default (Actions) => Reflux.createStore({

  listenables: Actions,

  onReplicateFromRemoteDb(thenToRemoteDb) {
    this.trigger('replicating')
    app.localDb.replicate.from(app.remoteDb)
      .then(() => {
        this.trigger('success')
        if (thenToRemoteDb) {
          app.Actions.replicateToRemoteDb()
        }
        app.fieldsStore.emptyFields()
        // TODO: need to rebuild redundant data > listen to change stream?
      })
      .catch((error) =>
        app.Actions.showError({
          title: 'Fehler beim Replizieren:',
          msg: error
        })
      )
  }
})
