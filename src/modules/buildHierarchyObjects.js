'use strict'

import _ from 'lodash'
import PouchDB from 'pouchdb'
import pouchUrl from './getCouchUrl.js'

export default function (objects) {
  // get metadata for this taxonomy
  // id = (Gruppe + Name).replace(':', '_').replace(' ', '_')
  const object0 = objects[0]
  const Gruppe = object0.Gruppe
  const dsName = object0.Taxonomie.Name
  const dsMetadataId = (Gruppe + dsName).replace(':', '_').replace(' ', '_')
  const db = new PouchDB(pouchUrl(), function (error, response) {
    if (error) { return console.log('error instantiating remote db') }
    db.get('dsMetadataId', { include_docs: true }).then(function (doc) {
      // lookup type
      switch (doc.HierarchieTyp) {
      case 'Felder'

        break
      case 'Parent'

        break
      }
    }).catch(function (error) {
      console.log('buildHierarchyObjets: error getting Metadata of property collection ' + dsName + ':', error)
    })
  })
}