'use strict'

import app from 'ampersand-app'

export default (items) => {
  const options = []

  // console.log('buildFilterOptions.js, items received', items)

  items.forEach((object) => {
    const standardtaxonomie = object.Taxonomien.find((taxonomy) => taxonomy.Standardtaxonomie)
    if (standardtaxonomie && standardtaxonomie.Eigenschaften) {
      const eig = standardtaxonomie.Eigenschaften
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

  // console.log('buildFilterOptions.js, options', options)

  // save to db
  app.localFilterOptionsDb.bulkDocs(options)
    .catch((error) => app.Actions.showError({title: 'buildFilterOptions.js: error saving to localFilterOptionsDb:', msg: error}))

  return options
}
