'use strict'

import Reflux from 'reflux'

export default function (Actions) {

  window.faunaStore = Reflux.createStore({
    listenables: Actions,

    onInitializeFaunaStoreCompleted (data) {
      // console.log('faunaStore got data:', data)
      this.trigger(data)
    }
  })

  //return Stores
}
