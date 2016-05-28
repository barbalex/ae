'use strict'

import app from 'ampersand-app'
import Reflux from 'reflux'

export default (Actions) => Reflux.createStore({

  listenables: Actions,

  onReplicateToRemoteDb() {
    this.trigger('replicating')
    app.localDb.replicate.to(app.remoteDb)
      .then(() => this.trigger('success'))
      .catch((error) =>
        app.Actions.showError({
          title: 'Fehler beim Replizieren:',
          msg: error
        })
      )
  }
})
