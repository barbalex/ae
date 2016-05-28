'use strict'

import app from 'ampersand-app'
import Reflux from 'reflux'
import addPathsFromItemsToLocalDb from '../modules/addPathsFromItemsToLocalDb.js'

export default (Actions) => Reflux.createStore({
  /*
   * simple store that keeps a hash of paths as keys and guids as values
   * well, they are kept in the pouch in localDb
   */
  listenables: Actions,

  onLoadPaths(newItemsPassed) {
    // get existing paths
    addPathsFromItemsToLocalDb(newItemsPassed)
      .then(() => this.trigger(true))
      .catch((error) =>
        app.Actions.showError({
          title: 'pathStore: error adding paths from passed items:',
          msg: error
        })
      )
  }
})
