'use strict'

import Reflux from 'reflux'

export default function (Actions) {
  return Reflux.createStore({
    init () {
      this.listenTo(Actions.initializeFaunaStore.completed, this.output)
    },

    output (result) {
      console.log('faunaStore got result:', result)
    }
  })
}
