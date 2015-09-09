'use strict'

import app from 'ampersand-app'

export default function () {
  app.localDb.replicate.to(app.remoteDb)
    .then((result) => {

    })
    .catch((error) => app.Actions.showError({title: 'Fehler in replicateToAe.js:', msg: error})
}
