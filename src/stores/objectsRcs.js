import app from 'ampersand-app'
import Reflux from 'reflux'
import { forEach, groupBy, reject } from 'lodash'
import objectsIdsByRcsName from '../queries/objectsIdsByRcsName.js'
import convertValue from '../modules/convertValue.js'
import sortObjectArrayByName from '../modules/sortObjectArrayByName.js'
import buildRcFirstLevel from '../modules/buildRcFirstLevel.js'

export default (Actions) => Reflux.createStore({
  /**
   * used to manipulate relation collections in objects
   * when importing and deleting relation collections
   */
  listenables: Actions,

  onImportRcs(state) {
    const {
      idsImportIdField,
      name,
      beschreibung,
      datenstand,
      nutzungsbedingungen,
      link,
      importiertVon,
      orgMitSchreibrecht,
      zusammenfassend,
      nameUrsprungsEs
    } = state
    let { rcsToImport } = state

    let importingProgress = 0
    // set back deleting progress to close progressbar and deletion examples
    const deletingRcInstancesProgress = null
    const deletingRcProgress = null
    // alert say "Daten werden vorbereitet..."
    this.trigger({
      importingProgress,
      deletingRcInstancesProgress,
      deletingRcProgress
    })
    // make sure there are no rcsToImport without id
    rcsToImport = rcsToImport.filter((rcToImport) =>
      !!rcToImport.id
    )
    /**
     * prepare rcsToImport:
     * combine all objects with the same id like this:
     * 1. build an object with keys = id's, values = array of all import-objects with this id
     * 2. loop the keys of this object and combine the import-objects like this:
     * 2.1: use relation description from state
     * 2.2: combine relation partners of all objects in field Beziehungen
     * 2.3: use other properties from any
     */
    const rcs = []
    // 1. build an object with keys = id's, values = array of all import-objects with this id
    const rcsToImportObjects = groupBy(rcsToImport, 'id')
    // 2. loop the keys of this object and combine the import-objects
    forEach(rcsToImportObjects, (rcToImportArray, id) => {
      const rcstoImportObject = rcToImportArray[0]
      // use relation description from state
      const rc = buildRcFirstLevel({
        id,
        name,
        beschreibung,
        datenstand,
        nutzungsbedingungen,
        link,
        importiertVon,
        zusammenfassend,
        nameUrsprungsEs
      })
      // combine relation partners of all objects in field Beziehungen
      rcToImportArray.forEach((rcToImport, index) => {
        const relation = {}
        forEach(rcstoImportObject, (value, field) => {
          if (field === 'rPartners') {
            relation.Beziehungspartner = value
          }
          if (
            field !== 'id' &&
            field !== 'rPartners' &&
            field !== 'Beziehungspartner' &&
            field !== idsImportIdField &&
            value !== '' &&
            value !== null
          ) {
            // use other properties from any
            // this is a property of the relation
            relation[field] = convertValue(value)
          }
        })
        rc.Beziehungen.push(relation)
      })
      rcs.push(rc)
    })

    // loop rcs
    rcs.forEach((rcToImport, index) => {
      app.objectStore.getObject(rcToImport.id)
        .then((objectToImportRcInTo) => {
          // make sure, Beziehungssammlungen exists
          if (!objectToImportRcInTo.Beziehungssammlungen) {
            objectToImportRcInTo.Beziehungssammlungen = []
          }
          // if a rc with this name existed already, remove it
          objectToImportRcInTo.Beziehungssammlungen = reject(
            objectToImportRcInTo.Beziehungssammlungen,
            (bs) => bs.Name === name
          )
          // remove id
          delete rcToImport.id
          objectToImportRcInTo.Beziehungssammlungen.push(rcToImport)
          objectToImportRcInTo.Beziehungssammlungen = sortObjectArrayByName(objectToImportRcInTo.Beziehungssammlungen)
          // write to db
          return app.localDb.put(objectToImportRcInTo)
        })
        .then(() => {
          importingProgress = Math.round((index + 1) / rcs.length * 100)
          let state = { importingProgress }
          if (importingProgress === 100) {
            // reset rcsRemoved to show button to remove again
            const rcsRemoved = false
            state = Object.assign(state, { rcsRemoved })
            /**
             * update nameBestehend
             * goal is to update the list of rcs and therewith the dropdown lists in nameBestehend and ursprungsEs
             * we could do it by querying the db again with app.Actions.queryPropertyCollections()
             * but this is 1. very slow so happens too late and 2. uses lots of ressources
             * so we build a new rc
             * and add it to the relationCollectionsStore
             * relationCollectionsStore triggers new rcs and lists get refreshed
             */
            const rc = {
              name,
              combining: zusammenfassend,
              organization: orgMitSchreibrecht,
              fields: {
                Beschreibung: beschreibung,
                Datenstand: datenstand,
                Nutzungsbedingungen: nutzungsbedingungen,
                Link: link,
                'importiert von': importiertVon,
                'Organisation mit Schreibrecht': orgMitSchreibrecht
              },
              count: 0
            }
            app.relationCollectionsStore.saveRc(rc)
          }
          this.trigger(state)
        })
        .catch((error) =>
          addError({
            title: 'Fehler beim Importieren:',
            msg: error
          })
        )
    })
    app.fieldsStore.emptyFields()
  },

  onDeleteRcByName(name) {
    /**
     * gets name of rc
     * removes rc's with this name from all objects
     * is listened to by importRc.js
     * returns: idsOfAeObjects, deletingRcProgress
     * if a callback is passed, it is executed at the end
     */
    let idsOfAeObjects = []
    let deletingRcProgress = null
    const nameBestehend = name
    this.trigger({ idsOfAeObjects, deletingRcProgress, nameBestehend })
    objectsIdsByRcsName(name)
      .then((ids) => {
        idsOfAeObjects = ids
        ids.forEach((id, index) => {
          app.objectStore.getObject(id)
            .then((doc) => {
              doc.Beziehungssammlungen = reject(
                doc.Beziehungssammlungen,
                (rc) => rc.Name === name
              )
              return app.localDb.put(doc)
            })
            .then(() => {
              deletingRcProgress = Math.round((index + 1) / ids.length * 100)
              if (deletingRcProgress === 100) {
                app.relationCollectionsStore.removeRcByName(name)
              }
              this.trigger({ idsOfAeObjects, deletingRcProgress })
            })
            .catch((error) =>
              addError({
                title: `Fehler: Das Objekt mit der ID ${id} wurde nicht aktualisiert:`,
                msg: error
              })
            )
        })
        app.fieldsStore.emptyFields()
      })
      .catch((error) =>
        addError({
          title: 'Fehler beim Versuch, die Eigenschaften zu löschen:',
          msg: error
        })
      )
  },

  onDeleteRcInstances(name, idsOfAeObjects) {
    idsOfAeObjects.forEach((guid, index) => {
      app.objectStore.getObject(guid)
        .then((doc) => {
          doc.Beziehungssammlungen = reject(
            doc.Beziehungssammlungen,
            (rc) => rc.Name === name
          )
          return app.localDb.put(doc)
        })
        .then(() => {
          const deletingRcInstancesProgress = Math.round((index + 1) / idsOfAeObjects.length * 100)
          let rcsRemoved = false
          if (deletingRcInstancesProgress === 100) {
            rcsRemoved = true
          }
          this.trigger({ deletingRcInstancesProgress, rcsRemoved })
        })
        .catch((error) =>
          addError({
            title: `Fehler: Das Objekt mit der GUID ${guid} wurde nicht aktualisiert:`,
            msg: error
          })
        )
    })
    app.fieldsStore.emptyFields()
  }

})
