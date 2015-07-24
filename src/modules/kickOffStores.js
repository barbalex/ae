'use strict'

import app from 'ampersand-app'

export default function (path, gruppe, guid) {
  if (guid) app.Actions.loadActiveObjectStore(guid)
  if (gruppe) app.Actions.loadObjectStore(gruppe)
  app.Actions.loadActivePathStore(path, guid)
}
