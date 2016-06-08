import Reflux from 'reflux'

export default (Actions) => Reflux.createStore({

  listenables: Actions,

  onChangeRebuildingRedundantData(message) {
    this.trigger(message)
  }

})
