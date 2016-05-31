'use strict'

import Reflux from 'reflux'

export default (Actions) => Reflux.createStore({
  /*
   * receives an error object with two keys: title, msg
   * keeps error objects in the array errors
   * deletes errors after a defined time - the time while the error will be shown to the user
   *
   * if a view wants to inform of an error it
   * calls action showError and passes the object
   *
   * the errorStore triggers, passing the errors array
   * ...then triggers again after removing the last error some time later
   *
   * Test: app.Actions.showError({title: 'testTitle', msg: 'testMessage'})
   * template: app.Actions.showError({title: 'title', msg: error})
   */
  listenables: Actions,

  errors: [],

  // this is how long the error will be shown
  duration: 10000,

  onShowError(error) {
    if (!error) {
      // user wants to remove error messages
      this.errors = []
      this.trigger(this.errors)
    } else {
      this.errors.unshift(error)
      this.trigger(this.errors)
      setTimeout(() => {
        this.errors.pop()
        this.trigger(this.errors)
      }, this.duration)
    }
  }
})
