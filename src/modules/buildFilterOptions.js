'use strict'

import app from 'ampersand-app'
import _ from 'lodash'

export default function (items) {
  const options = []
  // used to use _.map but it returned bad options because in always returns a value
  _.forEach(items, function (object) {
    if (object.Taxonomie && object.Taxonomie.Eigenschaften) {
      const eig = object.Taxonomie.Eigenschaften
      if (eig['Artname vollständig']) {
        // this is a species object
        options.push({
          'value': object._id,
          'label': eig['Artname vollständig']
        })
      }
      if (eig.Einheit) {
        // this is an lr object
        // top level has no label
        options.push({
          'value': object._id,
          'label': eig.Label ? eig.Label + ': ' + eig.Einheit : eig.Einheit
        })
      }
    }
  })

  // save to db
  app.localFilterOptionsDb.bulkDocs(options)
    .then(function () {
      console.log('buildFilterOptions.js: options saved to localFilterOptionsDb')
    })
    .catch(function (error) {
      console.log('buildFilterOptions.js: error saving to localFilterOptionsDb:', error)
    })

  return options
}
