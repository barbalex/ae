import app from 'ampersand-app'
import Reflux from 'reflux'
import { clone } from 'lodash'
import filterCollections from '../components/main/export/panel4/filterCollections.js'
import addCollectionsOfSynonyms from '../components/main/export/panel4/addCollectionsOfSynonyms.js'
import buildExportObjects from '../components/main/export/panel4/buildExportObjects.js'
import removeCollectionsNotFulfilling from '../components/main/export/panel4/removeCollectionsNotFulfilling.js'

export default (Actions) => Reflux.createStore({
  /**
   * gets exportOptions and all relevant other options
   * fetches all objects
   * filters them according to filter options
   * TODO: builds export objects
   * and returns them
   * or an error
   */

  listenables: Actions,

  onBuildExportData({
    exportOptions,
    onlyObjectsWithCollectionData,
    includeDataFromSynonyms,
    oneRowPerRelation,
    combineTaxonomies
  }) {
    app.objectStore.getObjects()
      .then((objects) => {
        const originalObjects = clone(objects)

        // 1. filter ids
        if (exportOptions.object.id.value) {
          objects = objects.filter((object) =>
            exportOptions.object.id.value.includes(object.id)
          )
        }
        // 2. filter groups
        const groups = exportOptions.object.Gruppen.value
        objects = objects.filter((object) =>
          groups.includes(object.Gruppe)
        )

        // 3. add missing pc's and rc's of synonyms if applicable
        if (includeDataFromSynonyms) {
          objects = addCollectionsOfSynonyms(originalObjects, objects)
        }

        // 4. filter for each taxonomy, pc or rc value choosen
        // combines taxonomies if applicable
        if (onlyObjectsWithCollectionData) {
          objects = filterCollections(
            exportOptions,
            objects,
            combineTaxonomies,
            onlyObjectsWithCollectionData
          )
        } else {
          objects = removeCollectionsNotFulfilling(exportOptions, objects)
        }

        // 5. build fields
        const exportObjects = buildExportObjects(
          exportOptions,
          objects,
          combineTaxonomies,
          oneRowPerRelation,
          onlyObjectsWithCollectionData
        )

        // 6. tell the view
        const errorBuildingExportData = null
        this.trigger({ exportObjects, errorBuildingExportData })
      })
      .catch((errorBuildingExportData) => {
        const exportObjects = []
        this.trigger({ exportObjects, errorBuildingExportData })
      })
  }
})
