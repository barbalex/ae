'use strict'

import app from 'ampersand-app'
import Reflux from 'reflux'
import _ from 'lodash'
import getGroupsLoadedFromLocalGroupsDb from './modules/getGroupsLoadedFromLocalGroupsDb.js'
import getItemsFromLocalDb from './modules/getItemsFromLocalDb.js'
import getItemFromLocalDb from './modules/getItemFromLocalDb.js'
import getItemFromRemoteDb from './modules/getItemFromRemoteDb.js'
import getHierarchyFromLocalHierarchyDb from './modules/getHierarchyFromLocalHierarchyDb.js'
import addPathsFromItemsToLocalPathDb from './modules/addPathsFromItemsToLocalPathDb.js'
import buildFilterOptions from './modules/buildFilterOptions.js'
import getSynonymsOfObject from './modules/getSynonymsOfObject.js'
import addGroupsLoadedToLocalGroupsDb from './modules/addGroupsLoadedToLocalGroupsDb.js'
import getGruppen from './modules/gruppen.js'
import loadGroupFromRemote from './modules/loadGroupFromRemote.js'
import queryPcs from './queries/pcs.js'
import queryRcs from './queries/rcs.js'
import queryFieldsOfGroup from './queries/fieldsOfGroup.js'
import objectsIdsByPcsName from './queries/objectsIdsByPcsName.js'
import objectsIdsByRcsName from './queries/objectsIdsByRcsName.js'
import convertValue from './modules/convertValue.js'
import sortObjectArrayByName from './modules/sortObjectArrayByName.js'
import buildRcFirstLevel from './modules/buildRcFirstLevel.js'
import getFieldsForGroupsToExportByCollectionType from './modules/getFieldsForGroupsToExportByCollectionType.js'
import filterCollections from './components/main/export/panel4/filterCollections.js'
import addCollectionsOfSynonyms from './components/main/export/panel4/addCollectionsOfSynonyms.js'
import buildExportObjects from './components/main/export/panel4/buildExportObjects.js'
import removeCollectionsNotFulfilling from './components/main/export/panel4/removeCollectionsNotFulfilling.js'
import getPathFromGuid from './modules/getPathFromGuid.js'
import extractInfoFromPath from './modules/extractInfoFromPath.js'
import removeRolesFromUser from './components/main/organizations/removeRolesFromUser.js'
import getRoleFromOrgField from './components/main/organizations/getRoleFromOrgField.js'

export default (Actions) => {
  app.exportDataStore = Reflux.createStore({
    /**
     * gets exportOptions and all relevant other options
     * fetches all objects
     * filters them according to filter options
     * TODO: builds export objects
     * and returns them
     * or an error
     */

    listenables: Actions,

    onBuildExportData ({ exportOptions, onlyObjectsWithCollectionData, includeDataFromSynonyms, oneRowPerRelation, combineTaxonomies }) {
      app.objectStore.getItems()
        .then((objects) => {
          // console.log('objects.length', objects.length)
          // console.log('exportDataStore, onBuildExportData: exportOptions', exportOptions)
          const originalObjects = _.clone(objects)

          // 1. filter ids
          if (exportOptions.object._id.value) {
            objects = objects.filter((object) => exportOptions.object._id.value.includes(object._id))
          }
          // 2. filter groups
          const groups = exportOptions.object.Gruppen.value
          objects = objects.filter((object) => groups.includes(object.Gruppe))
          // console.log('objects.length after filtering for group', objects.length)

          // 3. add missing pc's and rc's of synonyms if applicable
          if (includeDataFromSynonyms) {
            objects = addCollectionsOfSynonyms(originalObjects, objects)
          }

          // 4. filter for each taxonomy, pc or rc value choosen
          // combines taxonomies if applicable
          if (onlyObjectsWithCollectionData) {
            objects = filterCollections(exportOptions, objects, combineTaxonomies, onlyObjectsWithCollectionData)
          } else {
            objects = removeCollectionsNotFulfilling(exportOptions, objects)
          }

          // 5. build fields
          const exportObjects = buildExportObjects(exportOptions, objects, combineTaxonomies, oneRowPerRelation, onlyObjectsWithCollectionData)
          // console.log('exportDataStore, onBuildExportData: exportObjects', exportObjects)

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

  app.replicateFromAeStore = Reflux.createStore({

    listenables: Actions,

    onReplicateFromAe () {
      this.trigger('replicating')
      const options = {
        filter: (doc) => doc.Gruppe,
        batch_size: 500
      }
      app.localDb.replicate.from(app.remoteDb, options)
        .then((result) => {
          this.trigger('success')
          app.fieldsStore.emptyFields()
        })
        .catch((error) => this.trigger('error')) // eslint-disable-line handle-callback-err
    }
  })

  app.replicateToAeStore = Reflux.createStore({

    listenables: Actions,

    onReplicateToAe () {
      this.trigger('replicating')
      app.localDb.replicate.to(app.remoteDb)
        .then((result) => this.trigger('success'))
        .catch((error) => this.trigger('error'))  // eslint-disable-line handle-callback-err
    }
  })

  app.errorStore = Reflux.createStore({
    /*
     * receives an error object with two keys: title, msg
     * keeps error objects in the array errors
     * deletes errors after a defined time - the time while the error will be shown to the user
     *
     * if a view wants to inform of an error it
     * calls action showError and passes the object
     *
     * the errorStore triggers, passing the errors array
     * ...then triggers again after removing the last error some time later
     *
     * Test: app.Actions.showError({title: 'testTitle', msg: 'testMessage'})
     * template: app.Actions.showError({title: 'title', msg: error})
     */
    listenables: Actions,

    errors: [],

    // this is how long the error will be shown
    duration: 10000,

    onShowError (error) {
      if (!error) {
        // user wants to remove error messages
        this.errors = []
        this.trigger(this.errors)
      } else {
        this.errors.unshift(error)
        this.trigger(this.errors)
        setTimeout(() => {
          this.errors.pop()
          this.trigger(this.errors)
        }, this.duration)
      }
    }
  })

  app.usersStore = Reflux.createStore({
    /**
     * used to cache users names
     */
    listenables: Actions,

    userNames: [],

    onGetUsers () {
      if (this.userNames.length > 0) this.trigger(this.userNames)
      app.remoteUsersDb.allDocs({ include_docs: true })
        .then((result) => {
          console.log('usersStore, onGetUsers, result', result)
          const users = result.rows.map((row) => row.doc)
          const userNames = _.pluck(users, 'name')
          this.userNames = userNames
          this.trigger(this.userNames)
        })
        .catch((error) => app.Actions.showError({title: 'error fetching organizations from remoteDb:', msg: error}))
    }
  })

  app.organizationsStore = Reflux.createStore({
    /**
     * used to manage organizations or rather: writers and admins of organizations
     */
    listenables: Actions,

    organizations: [],

    lastOrganizations: [],

    activeOrganizationName: null,

    userIsAdminInOrgs: [],

    userIsEsWriterInOrgs: [],

    userIsLrWriterInOrgs: [],

    getActiveOrganization () {
      return this.organizations.find((org) => org.Name === this.activeOrganizationName)
    },

    updateOrganizationByName (name, organization) {
      const index = this.organizations.findIndex((org) => org.Name === name)
      this.lastOrganizations = this.organizations
      this.organizations[index] = organization
      // optimistically update ui
      this.triggerMe()
      app.remoteDb.put(organization)
        .then((result) => {
          // update rev in cache
          organization._rev = result.rev
          this.organizations[index] = organization
          this.triggerMe()
        })
        .catch((error) => {
          app.Actions.showError({title: 'error updating esWriter in remoteDb:', msg: error.message})
          // roll back change in cache
          this.organizations = this.lastOrganizations
        })
    },

    onGetOrganizations (email) {
      // send cached organizations first
      if (this.organizations.length > 0) this.triggerMe()
      app.remoteDb.query('organizations', { include_docs: true })
        .then((result) => {
          this.userIsAdminInOrgs = []
          this.userIsEsWriterInOrgs = []
          this.userIsLrWriterInOrgs = []
          const organizations = result.rows.map((row) => row.doc)
          this.organizations = organizations
          // is user admin in orgs?
          const orgsWhereUserIsAdmin = organizations.filter((org) => org.orgAdmins.includes(email))
          this.userIsAdminInOrgs = _.pluck(orgsWhereUserIsAdmin, 'Name')
          // set activeOrganization if user is logged in and only admin in one organization
          if (this.userIsAdminInOrgs.length === 1) this.activeOrganizationName = this.userIsAdminInOrgs[0]
          // is user es-writer in orgs?
          let orgsWhereUserIsEsWriter = organizations.filter((org) => org.esWriters.includes(email))
          orgsWhereUserIsEsWriter = _.union(orgsWhereUserIsEsWriter, orgsWhereUserIsAdmin)
          this.userIsEsWriterInOrgs = _.pluck(orgsWhereUserIsEsWriter, 'Name')
          // is user lr-writer in orgs?
          let orgsWhereUserLrEsWriter = organizations.filter((org) => org.lrWriters.includes(email))
          orgsWhereUserLrEsWriter = _.union(orgsWhereUserLrEsWriter, orgsWhereUserIsAdmin)
          this.userIsLrWriterInOrgs = _.pluck(orgsWhereUserLrEsWriter, 'Name')
          this.triggerMe()
        })
        .catch((error) => app.Actions.showError({title: 'error fetching organizations from remoteDb:', msg: error}))
    },

    onUpdateActiveOrganization (name, organization) {
      this.updateOrganizationByName(name, organization)
    },

    onSetActiveOrganization (name) {
      this.activeOrganizationName = name
      this.triggerMe()
    },

    onRemoveUserFromActiveOrganization (user, userFieldName) {
      let activeOrganization = this.getActiveOrganization()
      if (activeOrganization[userFieldName]) {
        let roles = []
        const role = getRoleFromOrgField(activeOrganization, userFieldName)
        roles.push(role)
        removeRolesFromUser(user, roles)
          .then(() => {
            activeOrganization[userFieldName] = activeOrganization[userFieldName].filter((esW) => esW !== user)
            this.updateOrganizationByName(activeOrganization.Name, activeOrganization)
          })
          .catch((error) => {
            // TODO
          })
      } else {
        // TODO
      }
    },

    triggerMe () {
      const organizations = this.organizations
      const activeOrganization = this.getActiveOrganization()
      const userIsAdminInOrgs = this.userIsAdminInOrgs
      const userIsEsWriterInOrgs = this.userIsEsWriterInOrgs
      const userIsLrWriterInOrgs = this.userIsLrWriterInOrgs
      this.trigger({ organizations, activeOrganization, userIsAdminInOrgs, userIsEsWriterInOrgs, userIsLrWriterInOrgs })
    }
  })

  app.objectsPcsStore = Reflux.createStore({
    /**
     * used to manipulate property collections in objects
     * when importing and deleting property collections
     */
    listenables: Actions,

    onImportPcs (state) {
      const { pcsToImport, idsImportIdField, name, beschreibung, datenstand, nutzungsbedingungen, link, orgMitSchreibrecht, importiertVon, zusammenfassend, nameUrsprungsEs } = state

      let importingProgress = 0
      // set back deleting progress to close progressbar and deletion examples
      const deletingPcInstancesProgress = null
      const deletingPcProgress = null
      // alert say "Daten werden vorbereitet..."
      this.trigger({ importingProgress, deletingPcInstancesProgress, deletingPcProgress })

      // loop pcsToImport
      pcsToImport.forEach((pcToImport, index) => {
        // get the object to add it to
        const guid = pcToImport._id
        if (guid) {
          app.objectStore.getItem(guid)
            .then((objectToImportPcInTo) => {
              // build pc
              let pc = {}
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
              _.forEach(pcToImport, (value, field) => {
                // dont import _id, idField or empty fields
                if (field !== '_id' && field !== idsImportIdField && value !== '' && value !== null) {
                  // convert values / types if necessary
                  pc.Eigenschaften[field] = convertValue(value)
                }
              })
              // make sure, Eigenschaftensammlungen exists
              if (!objectToImportPcInTo.Eigenschaftensammlungen) objectToImportPcInTo.Eigenschaftensammlungen = []
              // if a pc with this name existed already, remove it
              objectToImportPcInTo.Eigenschaftensammlungen = _.reject(objectToImportPcInTo.Eigenschaftensammlungen, (es) => es.name === name)
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
                  name: name,
                  combining: zusammenfassend,
                  importedBy: importiertVon,
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
            .catch((error) => app.Actions.showError({title: 'Fehler beim Importieren:', msg: error}))
        }
      })
      app.fieldsStore.emptyFields()
    },

    onDeletePcByName (name, offlineIndexes) {
      /**
       * gets name of pc
       * removes pc's with this name from all objects
       * is listened to by importPc.js
       * returns: idsOfAeObjects, deletingPcProgress
       * if a callback is passed, it is executed at the end
       */
      let idsOfAeObjects = []
      let deletingPcProgress = null
      let nameBestehend = name
      this.trigger({ idsOfAeObjects, deletingPcProgress, nameBestehend })
      objectsIdsByPcsName(name, offlineIndexes)
        .then((ids) => {
          idsOfAeObjects = ids
          ids.forEach((id, index) => {
            app.objectStore.getItem(id)
              .then((doc) => {
                doc.Eigenschaftensammlungen = _.reject(doc.Eigenschaftensammlungen, (es) => es.Name === name)
                return app.localDb.put(doc)
              })
              .then(() => {
                deletingPcProgress = Math.round((index + 1) / ids.length * 100)
                if (deletingPcProgress === 100) app.propertyCollectionsStore.removePcByName(name)
                this.trigger({ idsOfAeObjects, deletingPcProgress })
              })
              .catch((error) => app.Actions.showError({title: `Fehler: Das Objekt mit der ID ${id} wurde nicht aktualisiert:`, msg: error}))
          })
          app.fieldsStore.emptyFields()
        })
        .catch((error) => app.Actions.showError({title: 'Fehler beim Versuch, die Eigenschaften zu löschen:', msg: error}))
    },

    onDeletePcInstances (name, idsOfAeObjects) {
      idsOfAeObjects.forEach((guid, index) => {
        app.objectStore.getItem(guid)
          .then((doc) => {
            doc.Eigenschaftensammlungen = _.reject(doc.Eigenschaftensammlungen, (es) => es.Name === name)
            return app.localDb.put(doc)
          })
          .then(() => {
            const deletingPcInstancesProgress = Math.round((index + 1) / idsOfAeObjects.length * 100)
            let pcsRemoved = false
            if (deletingPcInstancesProgress === 100) pcsRemoved = true
            this.trigger({ deletingPcInstancesProgress, pcsRemoved })
          })
          .catch((error) => app.Actions.showError({title: `Fehler: Das Objekt mit der GUID ${guid} wurde nicht aktualisiert:`, msg: error}))
      })
      app.fieldsStore.emptyFields()
    }

  })

  app.objectsRcsStore = Reflux.createStore({
    /**
     * used to manipulate relation collections in objects
     * when importing and deleting relation collections
     */
    listenables: Actions,

    onImportRcs (state) {
      const { idsImportIdField, name, beschreibung, datenstand, nutzungsbedingungen, link, importiertVon, zusammenfassend, nameUrsprungsEs } = state
      let { rcsToImport } = state

      let importingProgress = 0
      // set back deleting progress to close progressbar and deletion examples
      const deletingRcInstancesProgress = null
      const deletingRcProgress = null
      // alert say "Daten werden vorbereitet..."
      this.trigger({ importingProgress, deletingRcInstancesProgress, deletingRcProgress })
      // make sure there are no rcsToImport without _id
      rcsToImport = rcsToImport.filter((rcToImport) => !!rcToImport._id)
      /**
       * prepare rcsToImport:
       * combine all objects with the same _id like this:
       * 1. build an object with keys = _id's, values = array of all import-objects with this _id
       * 2. loop the keys of this object and combine the import-objects like this:
       * 2.1: use relation description from state
       * 2.2: combine relation partners of all objects in field Beziehungen
       * 2.3: use other properties from any
       */
      let rcs = []
      // 1. build an object with keys = _id's, values = array of all import-objects with this _id
      let rcsToImportObjects = _.groupBy(rcsToImport, '_id')
      // 2. loop the keys of this object and combine the import-objects
      _.forEach(rcsToImportObjects, (rcToImportArray, id) => {
        const rcstoImportObject = rcToImportArray[0]
        // use relation description from state
        let rc = buildRcFirstLevel({ id, name, beschreibung, datenstand, nutzungsbedingungen, link, importiertVon, zusammenfassend, nameUrsprungsEs })
        // combine relation partners of all objects in field Beziehungen
        rcToImportArray.forEach((rcToImport, index) => {
          let relation = {}
          _.forEach(rcstoImportObject, (value, field) => {
            if (field === 'rPartners') {
              relation.Beziehungspartner = value
            }
            if (field !== '_id' && field !== 'rPartners' && field !== 'Beziehungspartner' && field !== idsImportIdField && value !== '' && value !== null) {
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
        app.objectStore.getItem(rcToImport._id)
          .then((objectToImportRcInTo) => {
            // make sure, Beziehungssammlungen exists
            if (!objectToImportRcInTo.Beziehungssammlungen) objectToImportRcInTo.Beziehungssammlungen = []
            // if a rc with this name existed already, remove it
            objectToImportRcInTo.Beziehungssammlungen = _.reject(objectToImportRcInTo.Beziehungssammlungen, (bs) => bs.Name === name)
            // remove _id
            delete rcToImport._id
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
                name: name,
                combining: zusammenfassend,
                importedBy: importiertVon,
                fields: {
                  Beschreibung: beschreibung,
                  Datenstand: datenstand,
                  Nutzungsbedingungen: nutzungsbedingungen,
                  Link: link,
                  'importiert von': importiertVon
                },
                count: 0
              }
              app.relationCollectionsStore.saveRc(rc)
            }
            this.trigger(state)
          })
          .catch((error) => app.Actions.showError({title: 'Fehler beim Importieren:', msg: error}))
      })
      app.fieldsStore.emptyFields()
    },

    onDeleteRcByName (name, offlineIndexes) {
      /**
       * gets name of rc
       * removes rc's with this name from all objects
       * is listened to by importRc.js
       * returns: idsOfAeObjects, deletingRcProgress
       * if a callback is passed, it is executed at the end
       */
      let idsOfAeObjects = []
      let deletingRcProgress = null
      let nameBestehend = name
      this.trigger({ idsOfAeObjects, deletingRcProgress, nameBestehend })
      objectsIdsByRcsName(name, offlineIndexes)
        .then((ids) => {
          idsOfAeObjects = ids
          ids.forEach((id, index) => {
            app.objectStore.getItem(id)
              .then((doc) => {
                doc.Beziehungssammlungen = _.reject(doc.Beziehungssammlungen, (rc) => rc.Name === name)
                return app.localDb.put(doc)
              })
              .then(() => {
                deletingRcProgress = Math.round((index + 1) / ids.length * 100)
                if (deletingRcProgress === 100) app.relationCollectionsStore.removeRcByName(name)
                this.trigger({ idsOfAeObjects, deletingRcProgress })
              })
              .catch((error) => app.Actions.showError({title: `Fehler: Das Objekt mit der ID ${id} wurde nicht aktualisiert:`, msg: error}))
          })
          app.fieldsStore.emptyFields()
        })
        .catch((error) => app.Actions.showError({title: 'Fehler beim Versuch, die Eigenschaften zu löschen:', msg: error}))
    },

    onDeleteRcInstances (name, idsOfAeObjects) {
      idsOfAeObjects.forEach((guid, index) => {
        app.objectStore.getItem(guid)
          .then((doc) => {
            doc.Beziehungssammlungen = _.reject(doc.Beziehungssammlungen, (rc) => rc.Name === name)
            return app.localDb.put(doc)
          })
          .then(() => {
            const deletingRcInstancesProgress = Math.round((index + 1) / idsOfAeObjects.length * 100)
            let rcsRemoved = false
            if (deletingRcInstancesProgress === 100) rcsRemoved = true
            this.trigger({ deletingRcInstancesProgress, rcsRemoved })
          })
          .catch((error) => app.Actions.showError({title: `Fehler: Das Objekt mit der GUID ${guid} wurde nicht aktualisiert:`, msg: error}))
      })
      app.fieldsStore.emptyFields()
    }

  })

  app.fieldsStore = Reflux.createStore({
    /*
     * queries fields
     * keeps last query result in pouch (_local/fields.fields) for fast delivery
     * app.js sets default _local/fields.fields = [] if not exists on app start
     * fields's are arrays of objects of the form:
     * key: doc.Gruppe, 'Datensammlung', datensammlung.Name, feldname, typeof feldwert
     * value: _count
     *
     * when this store triggers it passes two variables:
     * fields: the fields
     * fieldsQuerying: true/false: are fields being queryied? if true: show warning in symbols
     */
    listenables: Actions,

    getFields () {
      return new Promise((resolve, reject) => {
        app.localDb.get('_local/fields', { include_docs: true })
          .then((doc) => resolve(doc.fields))
          .catch((error) => reject('Fehler in fieldsStore, getFields: ' + error))
      })
    },

    saveFieldsOfGroup (fields, group) {
      return new Promise((resolve, reject) => {
        let allFields = []
        app.localDb.get('_local/fields', { include_docs: true })
          .then((doc) => {
            doc.fields = _.reject(doc.fields, (field) => field.group === group)
            doc.fields = doc.fields.concat(fields)
            allFields = doc.fields
            return app.localDb.put(doc)
          })
          .then(() => resolve(allFields))
          .catch((error) => reject(error))
      })
    },

    getFieldsOfGroups (groups) {
      return new Promise((resolve, reject) => {
        this.getFields()
          .then((fields) => {
            const groupsFields = fields.filter((field) => groups.includes(field.group))
            resolve(groupsFields)
          })
          .catch((error) => reject(error))
      })
    },

    emptyFields () {
      return new Promise((resolve, reject) => {
        app.localDb.get('_local/fields', { include_docs: true })
          .then((doc) => {
            doc.fields = []
            return app.localDb.put(doc)
          })
          .then(() => resolve([]))
          .catch((error) => reject(error))
      })
    },

    onQueryFields (groupsToExport, group, combineTaxonomies, offlineIndexes) {
      // if fields exist, send them immediately
      let taxonomyFields = {}
      let pcFields = {}
      let relationFields = {}
      let fieldsQuerying = true
      let fieldsQueryingError = null
      // trigger empty fields to make react rebuild panels from scratch so they are correctly sorted
      this.trigger({ taxonomyFields, pcFields, relationFields, fieldsQuerying, fieldsQueryingError })
      this.getFields()
        .then((allFields) => {
          taxonomyFields = getFieldsForGroupsToExportByCollectionType(allFields, groupsToExport, 'taxonomy', combineTaxonomies)
          pcFields = getFieldsForGroupsToExportByCollectionType(allFields, groupsToExport, 'propertyCollection')
          relationFields = getFieldsForGroupsToExportByCollectionType(allFields, groupsToExport, 'relation')
          if (!group) {
            // if no group was passed, the zusammenfassen option was changed
            fieldsQuerying = false
            this.trigger({ taxonomyFields, pcFields, relationFields, fieldsQuerying, fieldsQueryingError })
          } else {
            // check if group is not in allFields
            // if so: queryFieldsOfGroup
            // only do this if group was passed
            const groupsInAllFields = _.uniq(_.pluck(allFields, 'group'))
            const fieldsExistForRequestedGroup = groupsInAllFields.includes(group)
            fieldsQuerying = !fieldsExistForRequestedGroup
            this.trigger({ taxonomyFields, pcFields, relationFields, fieldsQuerying, fieldsQueryingError })
            if (!fieldsExistForRequestedGroup) {
              // fetch up to date fields for the requested group
              queryFieldsOfGroup(group, offlineIndexes)
                .then((fieldsOfGroup) => this.saveFieldsOfGroup(fieldsOfGroup, group))
                .then((allFields) => {
                  taxonomyFields = getFieldsForGroupsToExportByCollectionType(allFields, groupsToExport, 'taxonomy', combineTaxonomies)
                  pcFields = getFieldsForGroupsToExportByCollectionType(allFields, groupsToExport, 'propertyCollection')
                  relationFields = getFieldsForGroupsToExportByCollectionType(allFields, groupsToExport, 'relation')
                  fieldsQuerying = false
                  return this.trigger({ taxonomyFields, pcFields, relationFields, fieldsQuerying, fieldsQueryingError })
                })
                .catch((error) => {
                  taxonomyFields = {}
                  pcFields = {}
                  relationFields = {}
                  fieldsQuerying = false
                  fieldsQueryingError = error
                  this.trigger({ taxonomyFields, pcFields, relationFields, fieldsQuerying, fieldsQueryingError })
                })
            }
          }
        })
        .catch((error) =>
          app.Actions.showError({title: 'fieldsStore, error getting existing fields:', msg: error})
        )
    }
  })

  app.propertyCollectionsStore = Reflux.createStore({
    /*
     * queries property collections
     * keeps last query result in pouch (_local/pcs.pcs) for fast delivery
     * app.js sets default _local/pcs.pcs = [] if not exists on app start
     * pc's are arrays of the form:
     * [collectionType, pcName, combining, importedBy, {Beschreibung: xxx, Datenstand: xxx, Link: xxx, Nutzungsbedingungen: xxx}, count: xxx]
     *
     * when this store triggers it passes two variables:
     * pcs: the propberty collections
     * pcsQuerying: true/false: are pcs being queryied? if true: show warning in symbols
     */
    listenables: Actions,

    pcsQuerying: false,

    getPcs () {
      return new Promise((resolve, reject) => {
        app.localDb.get('_local/pcs', { include_docs: true })
          .then((doc) => resolve(doc.pcs))
          .catch((error) =>
            reject('Fehler in propertyCollectionsStore, getPcs: ' + error)
          )
      })
    },

    savePc (pc) {
      let pcs
      app.localDb.get('_local/pcs', { include_docs: true })
        .then((doc) => {
          doc.pcs.push(pc)
          doc.pcs = doc.pcs.sort((pc) => pc.name)
          pcs = doc.pcs
          return app.localDb.put(doc)
        })
        .then(() => this.trigger(pcs, this.pcsQuerying))
        .catch((error) =>
          app.Actions.showError({title: 'Fehler in propertyCollectionsStore, savePc:', msg: error})
        )
    },

    savePcs (pcs) {
      app.localDb.get('_local/pcs', { include_docs: true })
        .then((doc) => {
          doc.pcs = pcs
          return app.localDb.put(doc)
        })
        .catch((error) =>
          app.Actions.showError({title: 'Fehler in propertyCollectionsStore, savePcs:', msg: error})
        )
    },

    removePcByName (name) {
      let pcs
      app.localDb.get('_local/pcs', { include_docs: true })
        .then((doc) => {
          doc.pcs = _.reject(doc.pcs, (pc) => pc.name === name)
          pcs = doc.pcs
          return app.localDb.put(doc)
        })
        .then(() => this.trigger(pcs, this.pcsQuerying))
        .catch((error) =>
          app.Actions.showError({title: 'Fehler in propertyCollectionsStore, removePcByName:', msg: error})
        )
    },

    getPcByName (name) {
      return new Promise((resolve, reject) => {
        this.getPcs()
          .then((pcs) => {
            const pc = pcs.find((pc) => pc.name === name)
            resolve(pc)
          })
          .catch((error) => reject(error))
      })
    },

    getPcsOfOrganization (orgName) {
      return new Promise((resolve, reject) => {
        this.getPcs()
          .then((pcs) => {
            const pcsOfOrg = pcs.filter((pc) => pc['Organisation mit Schreibrecht'] === orgName)
            resolve(pcsOfOrg)
          })
          .catch((error) => reject(error))
      })
    },

    onQueryPropertyCollections (offlineIndexes) {
      // if pc's exist, send them immediately
      this.pcsQuerying = true
      this.getPcs()
        .then((pcs) => this.trigger(pcs, this.pcsQuerying))
        .catch((error) =>
          app.Actions.showError({title: 'propertyCollectionsStore, error getting existing pcs:', msg: error})
        )
      // now fetch up to date pc's
      queryPcs(offlineIndexes)
        .then((pcs) => {
          this.pcsQuerying = false
          // email has empty values. Set default
          pcs.forEach((pc) => pc.importedBy = pc.importedBy || 'alex@gabriel-software.ch')
          this.trigger(pcs, this.pcsQuerying)
          return this.savePcs(pcs)
        })
        .catch((error) =>
          app.Actions.showError({title: 'propertyCollectionsStore, error querying up to date pcs:', msg: error})
        )
    }
  })

  app.relationCollectionsStore = Reflux.createStore({
    /*
     * queries relation collections
     * keeps last query result in pouch (_local/rcs.rcs) for fast delivery
     * app.js sets default _local/rcs.rcs = [] if not exists on app start
     * rc's are arrays of the form:
     * [collectionType, rcName, combining, importedBy, {Beschreibung: xxx, Datenstand: xxx, Link: xxx, Nutzungsbedingungen: xxx}, count: xxx]
     *
     * when this store triggers it passes two variables:
     * rcs: the relation collections
     * rcsQuerying: true/false: are rcs being queryied? if true: show warning in symbols
     */
    listenables: Actions,

    rcsQuerying: false,

    getRcs () {
      return new Promise((resolve, reject) => {
        app.localDb.get('_local/rcs', { include_docs: true })
          .then((doc) => resolve(doc.rcs))
          .catch((error) =>
            reject('userStore: error getting relation collections from localDb: ' + error)
          )
      })
    },

    saveRc (rc) {
      let rcs
      app.localDb.get('_local/rcs', { include_docs: true })
        .then((doc) => {
          doc.rcs.push(rc)
          doc.rcs = doc.rcs.sort((rc) => rc.name)
          rcs = doc.rcs
          return app.localDb.put(doc)
        })
        .then(() => this.trigger(rcs, this.rcsQuerying))
        .catch((error) =>
          app.Actions.showError({title: 'Fehler in relationCollectionsStore, saveRc:', msg: error})
        )
    },

    saveRcs (rcs) {
      app.localDb.get('_local/rcs', { include_docs: true })
        .then((doc) => {
          doc.rcs = rcs
          return app.localDb.put(doc)
        })
        .catch((error) =>
          app.Actions.showError({title: 'Fehler in relationCollectionsStore, saveRcs:', msg: error})
        )
    },

    removeRcByName (name) {
      let rcs
      app.localDb.get('_local/rcs', { include_docs: true })
        .then((doc) => {
          doc.rcs = _.reject(doc.rcs, (rc) => rc.name === name)
          rcs = doc.rcs
          return app.localDb.put(doc)
        })
        .then(() => this.trigger(rcs, this.rcsQuerying))
        .catch((error) =>
          app.Actions.showError({title: 'Fehler in relationCollectionsStore, removeRcByName:', msg: error})
        )
    },

    getRcByName (name) {
      return new Promise((resolve, reject) => {
        this.getRcs()
          .then((rcs) => {
            const rc = rcs.find((rc) => rc.name === name)
            resolve(rc)
          })
          .catch((error) => reject(error))
      })
    },

    onQueryRelationCollections (offlineIndexes) {
      // if rc's exist, send them immediately
      this.rcsQuerying = true
      this.getRcs()
        .then((rcs) => this.trigger(rcs, this.rcsQuerying))
        .catch((error) =>
          app.Actions.showError({title: 'relationCollectionsStore, error getting existing rcs:', msg: error})
        )
      // now fetch up to date rc's
      queryRcs(offlineIndexes)
        .then((rcs) => {
          this.rcsQuerying = false
          // email has empty values. Set default
          rcs.forEach((rc) => {
            rc.importedBy = rc.importedBy || 'alex@gabriel-software.ch'
          })
          this.trigger(rcs, this.rcsQuerying)
          return this.saveRcs(rcs)
        })
        .catch((error) =>
          app.Actions.showError({title: 'relationCollectionsStore, error querying up to date rcs:', msg: error})
        )
    }
  })

  app.userStore = Reflux.createStore({
    /*
     * contains email and roles of logged in user
     * well, it is saved in pouch as local doc _local/login
     * and contains "logIn" bool which states if user needs to log in
     * app.js sets default _local/login if not exists on app start
     */
    listenables: Actions,

    getLogin () {
      return new Promise((resolve, reject) => {
        app.localDb.get('_local/login', { include_docs: true })
          .then((doc) => resolve(doc))
          .catch((error) =>
            reject('userStore: error getting login from localDb: ' + error)
          )
      })
    },

    onLogin ({ logIn, email, roles }) {
      app.localDb.get('_local/login', { include_docs: true })
        .then((doc) => {
          doc.logIn = logIn
          doc.email = email || undefined
          doc.roles = roles || []
          this.trigger({ logIn, email, roles })
          return app.localDb.put(doc)
        })
        .catch((error) =>
          app.Actions.showError({title: 'userStore: error logging in:', msg: error})
        )
    }
  })

  app.pathStore = Reflux.createStore({
    /*
     * simple store that keeps a hash of paths as keys and guids as values
     * well, they are kept in the pouch in localPathDb
     */
    listenables: Actions,

    onLoadPathStore (newItemsPassed) {
      // get existing paths
      addPathsFromItemsToLocalPathDb(newItemsPassed)
        .then(() => this.trigger(true))
        .catch((error) =>
          app.Actions.showError({title: 'pathStore: error adding paths from passed items:', msg: error})
        )
    }
  })

  app.filterOptionsStore = Reflux.createStore({
    /*
     * simple store that keeps an array of filter options
     * because creating them uses a lot of cpu
     * well, they are kept in the pouch in localFilterOptionsDb
    */
    listenables: Actions,

    getOptions () {
      return new Promise((resolve, reject) => {
        app.localFilterOptionsDb.allDocs({include_docs: true})
          .then((result) => {
            const filterOptions = result.rows.map((row) => row.doc)
            resolve(filterOptions)
          })
          .catch((error) =>
            reject('filterOptionsStore: error fetching filterOptions from localFilterOptionsDb:', error)
          )
      })
    },

    onLoadFilterOptionsStore () {
      const filterOptions = null
      const loading = true
      this.trigger({ filterOptions, loading })
    },

    onLoadFilterOptionsStoreCompleted (newItemsPassed) {
      let filterOptions = []
      // get existing filterOptions
      this.getOptions()
        .then((optionsFromPouch) => {
          filterOptions = filterOptions.concat(optionsFromPouch)
          if (newItemsPassed) filterOptions = filterOptions.concat(buildFilterOptions(newItemsPassed))
          const loading = false
          this.trigger({ filterOptions, loading })
        })
        .catch((error) =>
          app.Actions.showError({title: 'filterOptionsStore: error preparing trigger:', msg: error})
        )
    }
  })

  app.activePathStore = Reflux.createStore({
    /*
     * simple store that keeps the path (=url) as an array
     * components can listen to changes in order to update the path
    */
    listenables: Actions,

    path: [],

    guid: null,

    onLoadActivePathStore (path, guid) {
      // only change if something has changed
      if (this.guid !== guid || !_.isEqual(this.path, path)) {
        this.guid = guid
        this.path = path
        const { gruppe, mainComponent } = extractInfoFromPath(path)
        this.trigger({ path, guid, gruppe, mainComponent })
      }
    }
  })

  app.activeObjectStore = Reflux.createStore({
    /*
     * keeps the active object (active = is shown)
     * components can listen to changes in order to update it's data
     */
    listenables: Actions,

    loaded: false,

    item: {},

    onLoadActiveObjectStoreCompleted (item) {
      // console.log('activeObjectStore, onLoadActiveObjectStoreCompleted, item', item)
      // only change if active item has changed
      if (!_.isEqual(item, this.item)) {
        // item can be an object or {}
        this.item = item
        this.loaded = Object.keys(item).length > 0
        // tell views that data has changed
        this.trigger(item, [])
        // load path for this object...
        // console.log('activeObjectStore, onLoadActiveObjectStoreCompleted,  will call getPathFromGuid with guid', item._id)
        getPathFromGuid(item._id)
          .then(({ path, url }) => {
            // ...if it differs from the loaded path
            if (!_.isEqual(app.activePathStore.path, path)) app.Actions.loadActivePathStore(path, item._id)
            // now check for synonym objects
            return getSynonymsOfObject(item)
          })
          .then((synonymObjects) => {
            // if they exist: trigger again and pass synonyms
            if (synonymObjects.length > 0) this.trigger(item, synonymObjects)
          })
          .catch((error) =>
            app.Actions.showError({title: 'activeObjectStore: error fetching synonyms of object:', msg: error})
          )
      }
    }
  })

  app.loadingGroupsStore = Reflux.createStore({
    /*
     * keeps a list of loading groups
     * {group: 'Fauna', allGroups: false, message: 'Lade Fauna...', progressPercent: 60, finishedLoading: false}
     * loading groups are shown in menu under tree
     * if progressPercent is passed, a progressbar is shown
     * message is Text or label in progressbar
     */
    listenables: Actions,

    groupsLoading: [],

    groupsLoaded () {
      return new Promise((resolve, reject) => {
        getGroupsLoadedFromLocalGroupsDb()
          .then((groupsLoaded) => resolve(groupsLoaded))
          .catch((error) =>
            reject('objectStore, groupsLoaded: error getting groups loaded:', error)
          )
      })
    },

    isGroupLoaded (gruppe) {
      return new Promise((resolve, reject) => {
        this.groupsLoaded()
          .then((groupsLoaded) => {
            const groupIsLoaded = groupsLoaded.includes(gruppe)
            resolve(groupIsLoaded)
          })
          .catch((error) =>
            reject('objectStore, isGroupLoaded: error getting groups loaded:', error)
          )
      })
    },

    onShowGroupLoading (objectPassed) {
      // groups: after loading all groups in parallel from remoteDb
      // need to pass a single action for all
      // otherwise 5 addGroupsLoadedToLocalGroupsDb calls occur at the same moment...
      const { group, allGroups, finishedLoading } = objectPassed
      const gruppen = getGruppen()

      getGroupsLoadedFromLocalGroupsDb()
        .then((groupsLoaded) => {
          // if an object with this group is contained in groupsLoading, remove it
          if (allGroups) {
            this.groupsLoading = []
          } else {
            this.groupsLoading = _.reject(this.groupsLoading, (groupObject) => groupObject.group === group)
          }
          // add the passed object, if it is not yet loaded
          if (!finishedLoading) {
            // add it to the beginning of the array
            this.groupsLoading.unshift(objectPassed)
          }
          groupsLoaded = allGroups ? gruppen : _.union(groupsLoaded, [group])
          if (finishedLoading) {
            // remove this group from groupsLoading
            this.groupsLoading = _.without(this.groupsLoading, group)
            // load next group if on is queued
            if (this.groupsLoading.length > 0) {
              // get group of last element
              const nextGroup = this.groupsLoading[this.groupsLoading.length - 1].group
              // load if
              loadGroupFromRemote(nextGroup)
                .then(() => Actions.loadObjectStore.completed(nextGroup))
                .catch((error) => {
                  const errorMsg = 'Actions.loadObjectStore, error loading group ' + nextGroup + ': ' + error
                  Actions.loadObjectStore.failed(errorMsg, nextGroup)
                })
            }
            // write change to groups loaded to localGroupsDb
            const groupsToPass = allGroups ? gruppen : [group]
            addGroupsLoadedToLocalGroupsDb(groupsToPass)
              .catch((error) =>
                app.Actions.showError({title: 'loadingGroupsStore, onShowGroupLoading, error adding group(s) to localGroupsDb:', msg: error})
              )
          }
          // inform views
          const payload = {
            groupsLoadingObjects: this.groupsLoading,
            groupsLoaded: groupsLoaded
          }
          this.trigger(payload)
        })
        .catch((error) =>
          app.Actions.showError({title: 'loadingGroupsStore, onShowGroupLoading, error getting groups loaded from localGroupsDb:', msg: error})
        )
    }
  })

  app.objectStore = Reflux.createStore({
    /*
     * keeps an array of objects, of hierarchy objects and of groups loaded (i.e. their names)
     * the are managed with the same store (but different databases)
     * because they depend on each other / always change together
     *
     * objects are kept in the pouch in localDb,
     * hierarchies in localHierarchyDb,
     * groups in localGroupsDb
    */
    listenables: Actions,

    // getItems and getItem get Item(s) from pouch if loaded
    getItems () {
      return getItemsFromLocalDb()
    },

    getItem (guid) {
      return new Promise((resolve, reject) => {
        getItemFromLocalDb(guid)
          .then((item) => {
            // if no item is found in localDb, get from remote
            // important on first load of an object url
            // in order for this to work, getItemFromLocalDb returns null when not finding the doc
            if (!item) return getItemFromRemoteDb(guid)
            return item
          })
          .then((item) => resolve(item))
          .catch((error) =>
            reject('objectStore, getItem: error getting item from guid' + guid + ': ', error)
          )
      })
    },

    getHierarchy () {
      return getHierarchyFromLocalHierarchyDb()
    },

    onLoadPouchFromLocalCompleted (groupsLoadedInPouch) {
      Actions.loadFilterOptionsStore()
      this.getHierarchy()
        .then((hierarchy) => this.trigger(hierarchy))
    },

    onLoadPouchFromLocalFailed (error) {
      app.Actions.showError({title: 'objectStore: error loading objectStore from pouch:', msg: error})
    },

    onLoadObjectStore (gruppe) {
      this.getHierarchy()
        // trigger change so components can set loading state
        .then((hierarchy) => this.trigger(hierarchy))
        .catch((error) =>
          app.Actions.showError({title: 'objectStore, onLoadObjectStore, error getting data:', msg: error})
        )
    },

    onLoadObjectStoreCompleted (gruppe) {
      this.getHierarchy()
        .then((hierarchy) => this.trigger(hierarchy))
        .catch((error) =>
          app.Actions.showError({title: 'objectStore, onLoadObjectStore, error getting data:', msg: error})
        )
    },

    onLoadObjectStoreFailed (error, gruppe) {
      // remove loading indicator
      Actions.showGroupLoading({
        group: gruppe,
        finishedLoading: true
      })
      app.Actions.showError({title: 'objectStore: loading items failed with error:', msg: error})
    }
  })
}
