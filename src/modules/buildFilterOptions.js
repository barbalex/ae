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
  app.localFilterOptionsDb.bulkDocs(options)
    .catch((error) => app.Actions.showError({title: 'buildFilterOptions.js: error saving to localFilterOptionsDb:', msg: error}))

  return options
}
