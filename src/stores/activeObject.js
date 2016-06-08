import app from 'ampersand-app'
import Reflux from 'reflux'
import { isEqual } from 'lodash'
import getSynonymsOfObject from '../modules/getSynonymsOfObject.js'
import getPathFromGuid from '../modules/getPathFromGuid.js'

export default (Actions) => Reflux.createStore({
  /*
   * keeps the active object (active = is shown)
   * components can listen to changes in order to update it's data
   */
  listenables: Actions,

  loaded: false,

  item: {},

  onLoadActiveObject(guid) {
    // check if group is loaded > get object from objectStore
    if (!guid) {
      this.onLoadActiveObjectCompleted({})
    } else {
      app.objectStore.getObject(guid)
        // group is already loaded
        // pass object to activeObjectStore by completing action
        // if object is empty, store will have no item
        // so there is never a failed action
        .then((object) => this.onLoadActiveObjectCompleted(object))
        .catch(() => {  // eslint-disable-line handle-callback-err
          // this group is not loaded yet
          // get Object from couch
          app.remoteDb.get(guid)
            .then((object) => this.onLoadActiveObjectCompleted(object))
            .catch((error) => app.Actions.showError({
              title: `error fetching doc from remoteDb with guid ${guid}:`,
              msg: error
            }))
        })
    }
  },

  onLoadActiveObjectCompleted(item) {
    // only change if active item has changed
    // turned off because changing lr did not work
    // if (!isEqual(item, this.item)) {
    // item can be an object or {}
    this.item = item
    this.loaded = Object.keys(item).length > 0
    // tell views that data has changed
    this.trigger(item, [])
    // load path for this object...
    if (item && item._id) {
      getPathFromGuid(item._id)
        .then(({ path }) => {
          // ...if it differs from the loaded path
          if (!isEqual(app.activePathStore.path, path)) {
            app.Actions.loadActivePath(path, item._id)
          }
          // now check for synonym objects
          return getSynonymsOfObject(item)
        })
        .then((synonymObjects) => {
          // if they exist: trigger again and pass synonyms
          if (synonymObjects.length > 0) {
            this.trigger(item, synonymObjects)
          }
        })
        .catch((error) =>
          app.Actions.showError({
            title: 'activeObjectStore: error fetching synonyms of object:',
            msg: error
          })
        )
    }
    // }
  }
})
