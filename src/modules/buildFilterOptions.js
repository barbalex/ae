'use strict'

import app from 'ampersand-app'
import buildFilterOptionsFromObject from './buildFilterOptionsFromObject.js'

export default (items) => {
  const options = []

  // console.log('buildFilterOptions.js, items received', items)

  items.forEach((object) => {
    let option = buildFilterOptionsFromObject(object)
    if (option) options.push(option)
  })

  // console.log('buildFilterOptions.js, options', options)

  // save to db
  app.localDb.get('_local/filterOptions')
    .then((doc) => {
      doc.filterOptions = options
      return app.localDb.put(doc)
    })
    .catch((error) =>
      app.Actions.showError({title: 'buildFilterOptions.js: error saving to localDb:', msg: error})
    )

  return options
}
