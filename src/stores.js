'use strict'

import Reflux from 'reflux'

export default function (Actions) {
  let Stores = {}

  Stores.faunaStore = Reflux.createStore({
    listenables: Actions,

    onInitializeFaunaStoreCompleted (data) {
      // console.log('faunaStore got data:', data)
      this.trigger(data)
    }
  })

  console.log('stores.js: Stores:', Stores)

  return Stores
}
