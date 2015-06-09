'use strict'

import Reflux from 'reflux'

export default function (Actions) {
  return Reflux.createStore({
    listenables: Actions,

    onInitializeFaunaStoreCompleted (data) {
      console.log('faunaStore got data:', data)
      this.trigger(data)
    }
  })
}
