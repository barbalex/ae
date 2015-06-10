'use strict'

import Reflux from 'reflux'
import _ from 'underscore'

export default function (Actions) {
  window.faunaStore = Reflux.createStore({
    listenables: Actions,

    items: {},

    loaded: false,

    get (guid) {
      return this.items[guid]
    },

    onLoadFaunaStoreCompleted (items) {
      if (items instanceof Array) {
        // loaded all items
        items = _.indexBy(items, '_id')
        this.loaded = true
      }
      assign(this.items, items)
      this.trigger(this.items)
    }
  })
}
