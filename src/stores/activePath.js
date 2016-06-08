import Reflux from 'reflux'
import { isEqual } from 'lodash'
import extractInfoFromPath from '../modules/extractInfoFromPath.js'

export default (Actions) => Reflux.createStore({
  /*
   * simple store that keeps the path (=url) as an array
   * components can listen to changes in order to update the path
  */
  listenables: Actions,

  path: [],

  guid: null,

  onLoadActivePath(path, guid) {
    // only change if something has changed
    if (
      this.guid !== guid ||
      !isEqual(this.path, path)
    ) {
      this.guid = guid
      this.path = path
      const { gruppe, mainComponent } = extractInfoFromPath(path)
      this.trigger({
        path,
        guid,
        gruppe,
        mainComponent
      })
    }
  }
})
