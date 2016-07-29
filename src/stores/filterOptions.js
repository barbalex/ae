import app from 'ampersand-app'
import Reflux from 'reflux'
import buildFilterOptions from '../modules/buildFilterOptions.js'
import buildFilterOptionsFromObject from '../modules/buildFilterOptionsFromObject.js'

export default (Actions) => Reflux.createStore({
  /*
   * simple store that keeps an array of filter options
   * because creating them uses a lot of cpu
   * well, they are kept in localDb in _local/filterOptions
  */
  listenables: Actions,

  getOptions() {
    return new Promise((resolve, reject) => {
      app.localDb.get('_local/filterOptions')
        .then((doc) => resolve(doc.filterOptions))
        .catch((error) =>
          reject('filterOptionsStore: error fetching filterOptions from localDb:', error)
        )
    })
  },

  onLoadFilterOptions(newItemsPassed) {
    this.trigger({
      filterOptions: null,
      loading: true
    })
    // get existing filterOptions
    this.getOptions()
      .then((optionsFromPouch) => {
        let filterOptions = optionsFromPouch
        if (newItemsPassed) filterOptions = filterOptions.concat(buildFilterOptions(newItemsPassed))
        const loading = false
        this.trigger({ filterOptions, loading })
      })
      .catch((error) =>
        addError({
          title: 'filterOptionsStore, onLoadFilterOptions: error preparing trigger:',
          msg: error
        })
      )
  },

  onChangeFilterOptionsForObject(object) {
    const option = buildFilterOptionsFromObject(object)
    let options = null
    app.localDb.get('_local/filterOptions')
      .then((doc) => {
        // replace option with new
        doc.filterOptions = doc.filterOptions.filter((op) =>
          op.value !== object.id
        )
        doc.filterOptions.push(option)
        options = doc.filterOptions
        return app.localDb.put(doc)
      })
      .then(() => this.trigger({ options, loading: false }))
      .catch((error) =>
        addError({
          title: 'filterOptionsStore, onChangeFilterOptionsForObject: error preparing trigger:',
          msg: error
        })
      )
  }
})
