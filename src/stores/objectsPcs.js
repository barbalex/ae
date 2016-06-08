import app from 'ampersand-app'
import Reflux from 'reflux'
import { forEach, reject as _reject } from 'lodash'
import objectsIdsByPcsName from '../queries/objectsIdsByPcsName.js'
import convertValue from '../modules/convertValue.js'
import sortObjectArrayByName from '../modules/sortObjectArrayByName.js'

export default (Actions) => Reflux.createStore({
  /**
   * used to manipulate property collections in objects
   * when importing and deleting property collections
   */
  listenables: Actions,

  onImportPcs(state) {
    const {
      pcsToImport,
      idsImportIdField,
      name,
      beschreibung,
      datenstand,
      nutzungsbedingungen,
      link,
      orgMitSchreibrecht,
      importiertVon,
      zusammenfassend,
      nameUrsprungsEs
    } = state

    let importingProgress = 0
    // set back deleting progress to close progressbar and deletion examples
    const deletingPcInstancesProgress = null
    const deletingPcProgress = null
    // alert say "Daten werden vorbereitet..."
    this.trigger({
      importingProgress,
      deletingPcInstancesProgress,
      deletingPcProgress
    })

    // loop pcsToImport
    pcsToImport.forEach((pcToImport, index) => {
      // get the object to add it to
      const guid = pcToImport._id
      if (guid) {
        app.objectStore.getObject(guid)
          .then((objectToImportPcInTo) => {
            // build pc
            const pc = {}
            pc.Name = name
            pc.Beschreibung = beschreibung
            pc.Datenstand = datenstand
            pc.Nutzungsbedingungen = nutzungsbedingungen
            if (link) pc.Link = link
            pc['Organisation mit Schreibrecht'] = orgMitSchreibrecht
            pc['importiert von'] = importiertVon
            if (zusammenfassend) pc.zusammenfassend = zusammenfassend
            if (nameUrsprungsEs) pc.Ursprungsdatensammlung = nameUrsprungsEs
            pc.Eigenschaften = {}
            // now add fields of pc
            forEach(pcToImport, (value, field) => {
              // dont import _id, idField or empty fields
              if (
                field !== '_id' &&
                field !== idsImportIdField &&
                value !== '' &&
                value !== null
              ) {
                // convert values / types if necessary
                pc.Eigenschaften[field] = convertValue(value)
              }
            })
            // make sure, Eigenschaftensammlungen exists
            if (!objectToImportPcInTo.Eigenschaftensammlungen) {
              objectToImportPcInTo.Eigenschaftensammlungen = []
            }
            // if a pc with this name existed already, remove it
            objectToImportPcInTo.Eigenschaftensammlungen = _reject(
              objectToImportPcInTo.Eigenschaftensammlungen,
              (es) => es.name === name
            )
            objectToImportPcInTo.Eigenschaftensammlungen.push(pc)
            objectToImportPcInTo.Eigenschaftensammlungen = sortObjectArrayByName(objectToImportPcInTo.Eigenschaftensammlungen)
            // write to db
            return app.localDb.put(objectToImportPcInTo)
          })
          .then(() => {
            importingProgress = Math.round((index + 1) / pcsToImport.length * 100)
            let state = { importingProgress }
            if (importingProgress === 100) {
              // reset pcsRemoved to show button to remove again
              const pcsRemoved = false
              state = Object.assign(state, { pcsRemoved })
              /**
               * update nameBestehend
               * goal is to update the list of pcs and therewith the dropdown lists in nameBestehend and ursprungsEs
               * we could do it by querying the db again with app.Actions.queryPropertyCollections()
               * but this is 1. very slow so happens too late and 2. uses lots of ressources
               * so we build a new pc
               * and add it to the propertyCollectionsStore
               * propertyCollectionsStore triggers new pcs and lists get refreshed
               */
              const pc = {
                name,
                combining: zusammenfassend,
                organization: orgMitSchreibrecht,
                fields: {
                  Beschreibung: beschreibung,
                  Datenstand: datenstand,
                  Nutzungsbedingungen: nutzungsbedingungen,
                  Link: link,
                  'Organisation mit Schreibrecht': orgMitSchreibrecht,
                  'importiert von': importiertVon
                },
                count: 0
              }
              app.propertyCollectionsStore.savePc(pc)
            }
            this.trigger(state)
          })
          .catch((error) =>
            addError({
              title: 'Fehler beim Importieren:',
              msg: error
            })
          )
      }
    })
    app.fieldsStore.emptyFields()
  },

  onDeletePcByName(name, offlineIndexes) {
    /**
     * gets name of pc
     * removes pc's with this name from all objects
     * is listened to by importPc.js
     * returns: idsOfAeObjects, deletingPcProgress
     * if a callback is passed, it is executed at the end
     */
    let idsOfAeObjects = []
    let deletingPcProgress = null
    const nameBestehend = name
    this.trigger({
      idsOfAeObjects,
      deletingPcProgress,
      nameBestehend
    })
    objectsIdsByPcsName(name, offlineIndexes)
      .then((ids) => {
        idsOfAeObjects = ids
        ids.forEach((id, index) => {
          app.objectStore.getObject(id)
            .then((doc) => {
              doc.Eigenschaftensammlungen = _reject(
                doc.Eigenschaftensammlungen,
                (es) => es.Name === name
              )
              return app.localDb.put(doc)
            })
            .then(() => {
              deletingPcProgress = Math.round((index + 1) / ids.length * 100)
              if (deletingPcProgress === 100) {
                app.propertyCollectionsStore.removePcByName(name)
              }
              this.trigger({ idsOfAeObjects, deletingPcProgress })
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

  onDeletePcInstances(name, idsOfAeObjects) {
    idsOfAeObjects.forEach((guid, index) => {
      app.objectStore.getObject(guid)
        .then((doc) => {
          doc.Eigenschaftensammlungen = _reject(
            doc.Eigenschaftensammlungen,
            (es) => es.Name === name
          )
          return app.localDb.put(doc)
        })
        .then(() => {
          const deletingPcInstancesProgress = Math.round((index + 1) / idsOfAeObjects.length * 100)
          let pcsRemoved = false
          if (deletingPcInstancesProgress === 100) {
            pcsRemoved = true
          }
          this.trigger({ deletingPcInstancesProgress, pcsRemoved })
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
