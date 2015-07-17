'use strict'

import app from 'ampersand-app'

export default function (path, gruppe, guid) {
  if (guid) {
    app.Actions.loadActiveObjectStore(guid)
  } else {
    // loadActiveObjectStore loads objectStore too, so don't do it twice
    if (gruppe) app.Actions.loadObjectStore(gruppe)
  }
  app.Actions.loadPathStore(path, guid)
}
