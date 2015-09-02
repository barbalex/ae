'use strict'

import app from 'ampersand-app'

export default (items) => {
  const options = []
  // used to use _.map but it returned bad options because in always returns a value
  items.forEach((object) => {
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
    .catch((error) => app.Actions.showError({title: 'buildFilterOptions.js: error saving to localFilterOptionsDb:', msg: error}))

  return options
}
