import app from 'ampersand-app'
import exportDataStore from './stores/exportData.js'
import changeRebuildingRedundantDataStore from './stores/changeRebuildingRedundantData.js'
import replicateFromRemoteDbStore from './stores/replicateFromRemoteDb.js'
import replicateToRemoteDbStore from './stores/replicateToRemoteDb.js'
import organizationsStore from './stores/organizations.js'
import objectsPcsStore from './stores/objectsPcs.js'
import objectsRcsStore from './stores/objectsRcs.js'
import fieldsStore from './stores/fields.js'
import taxonomyCollectionsStore from './stores/taxonomyCollections.js'
import propertyCollectionsStore from './stores/propertyCollections.js'
import relationCollectionsStore from './stores/relationCollections.js'
import userStore from './stores/user.js'
import pathStore from './stores/path.js'
import filterOptionsStore from './stores/filterOptions.js'
import activePathStore from './stores/activePath.js'
import activeObjectStore from './stores/activeObject.js'
import objectStore from './stores/object.js'

export default (Actions) => {
  app.exportDataStore = exportDataStore(Actions)
  app.changeRebuildingRedundantDataStore = changeRebuildingRedundantDataStore(Actions)
  app.replicateFromRemoteDbStore = replicateFromRemoteDbStore(Actions)
  app.replicateToRemoteDbStore = replicateToRemoteDbStore(Actions)
  app.organizationsStore = organizationsStore(Actions)
  app.objectsPcsStore = objectsPcsStore(Actions)
  app.objectsRcsStore = objectsRcsStore(Actions)
  app.fieldsStore = fieldsStore(Actions)
  app.taxonomyCollectionsStore = taxonomyCollectionsStore(Actions)
  app.propertyCollectionsStore = propertyCollectionsStore(Actions)
  app.relationCollectionsStore = relationCollectionsStore(Actions)
  app.userStore = userStore(Actions)
  app.pathStore = pathStore(Actions)
  app.filterOptionsStore = filterOptionsStore(Actions)
  app.activePathStore = activePathStore(Actions)
  app.activeObjectStore = activeObjectStore(Actions)
  app.objectStore = objectStore(Actions)
}
