'use strict'

/**
 * rebuilds from objects derived data in _local docs
 * based on objects
 */

import app from 'ampersand-app'
import { pluck } from 'lodash'
import buildHierarchy from './buildHierarchy.js'

export default () => {
  let objects = []
  let hierarchy
  // 1. get objects from localDb

  console.log('rebuilding redundant data')
  app.Actions.changeRebuildingRedundantData('baue redundante Daten: lade Daten')

  app.objectStore.getObjects()
    .then((items) => {
      console.log('got items')
      objects = items
      return app.localDb.get('_local/hierarchy')
    })
    // 2. update hierarchy
    .then((doc) => {
      app.Actions.changeRebuildingRedundantData('baue redundante Daten: Taxonomie-Baum')
      doc.hierarchy = buildHierarchy(objects)
      hierarchy = doc.hierarchy
      console.log('rebuildRedundantData.js, hierarchy', hierarchy)
      return app.localDb.put(doc)
    })
    // 3. update groups loaded
    .then(() => app.localDb.get('_local/groupsLoaded'))
    .then((doc) => {
      doc.groupsLoaded = pluck(hierarchy, 'Name')
      return app.localDb.put(doc)
    })
    // 4. update filter options
    .then(() => app.localDb.get('_local/filterOptions'))
    .then((doc) => {
      app.Actions.changeRebuildingRedundantData('baue redundante Daten: Suchbegriffe')
      doc.filterOptions = []
      return app.localDb.put(doc)
    })
    .then(() => app.Actions.loadFilterOptions(objects))
    // update paths
    .then(() => app.localDb.get('_local/paths'))
    .then((doc) => {
      app.Actions.changeRebuildingRedundantData('baue redundante Daten: URL-Pfade')
      doc.paths = {}
      return app.localDb.put(doc)
    })
    .then(() => app.Actions.loadPaths(objects))
    .then(() => app.Actions.changeRebuildingRedundantData(null))
    .catch((error) => app.Actions.showError({title: 'Error rebuilding hierarhy:', msg: error}))
}
