'use strict'

import Reflux from 'reflux'

export default function (Actions) {
  window.faunaCollectionStore = Reflux.createStore({
    listenables: Actions,

    onInitializeFaunaCollectionStoreCompleted (data) {
      this.trigger(data)
    }
  })

  window.faunaStore = Reflux.createStore({
    listenables: Actions,


  })
}
