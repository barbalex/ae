import app from 'ampersand-app'
import buildFilterOptionsFromObject from './buildFilterOptionsFromObject.js'

export default (items) => {
  const options = []

  items.forEach((object) => {
    const option = buildFilterOptionsFromObject(object)
    if (option) options.push(option)
  })

  // console.log('buildFilterOptions.js, options', options)

  // save to db
  app.localDb.get('_local/filterOptions')
    .then((doc) => {
      doc.filterOptions = doc.filterOptions.concat(options)
      return app.localDb.put(doc)
    })
    .catch((error) =>
      app.Actions.showError({
        title: 'buildFilterOptions.js: error saving to localDb:',
        msg: error
      })
    )

  return options
}
