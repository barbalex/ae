'use strict'

import Reflux from 'reflux'

export default (Actions) => {
  const changeRebuildingRedundantDataStore = Reflux.createStore({

    listenables: Actions,

    onChangeRebuildingRedundantData (message) {
      this.trigger(message)
    }
  })

  return changeRebuildingRedundantDataStore
}
