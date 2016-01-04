'use strict'

import app from 'ampersand-app'
import Reflux from 'reflux'
import { clone, difference, forEach, get, groupBy, isEqual, pluck, reject, union, uniq, without } from 'lodash'
import getGroupsLoadedFromLocalDb from './modules/getGroupsLoadedFromLocalDb.js'
import getItemsFromLocalDb from './modules/getItemsFromLocalDb.js'
import getItemFromLocalDb from './modules/getItemFromLocalDb.js'
import getItemFromRemoteDb from './modules/getItemFromRemoteDb.js'
import getHierarchyFromLocalDb from './modules/getHierarchyFromLocalDb.js'
import addPathsFromItemsToLocalDb from './modules/addPathsFromItemsToLocalDb.js'
import buildFilterOptions from './modules/buildFilterOptions.js'
import getSynonymsOfObject from './modules/getSynonymsOfObject.js'
import addGroupsLoadedToLocalDb from './modules/addGroupsLoadedToLocalDb.js'
import getGruppen from './modules/gruppen.js'
import loadGroupFromRemote from './modules/loadGroupFromRemote.js'
import queryTcs from './queries/tcs.js'
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
import refreshUserRoles from './modules/refreshUserRoles.js'
import changePathOfObjectInLocalDb from './modules/changePathOfObjectInLocalDb.js'
import buildFilterOptionsFromObject from './modules/buildFilterOptionsFromObject.js'
import updateActivePathFromObject from './modules/updateActivePathFromObject.js'

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
      app.objectStore.getObjects()
        .then((objects) => {
          // console.log('objects.length', objects.length)
          // console.log('exportDataStore, onBuildExportData: exportOptions', exportOptions)
          const originalObjects = clone(objects)

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

  app.replicateFromRemoteDbStore = Reflux.createStore({

    listenables: Actions,

    onReplicateFromRemoteDb () {
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

  app.replicateToRemoteDbStore = Reflux.createStore({

    listenables: Actions,

    onReplicateToRemoteDb () {
      this.trigger('replicating')
      app.localDb.replicate.to(app.remoteDb)
        .then((result) => this.trigger('success'))
        .catch((error) => {
          console.log('replicateToRemoteDbStore, error', error)
          this.trigger('error')
        })  // eslint-disable-line handle-callback-err
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
          const userNames = pluck(users, 'name')
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

    tcsOfActiveOrganization: [],

    pcsOfActiveOrganization: [],

    rcsOfActiveOrganization: [],

    userIsAdminInOrgs: [],

    userIsEsWriterInOrgs: [],

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
          const organizations = result.rows.map((row) => row.doc)
          this.organizations = organizations
          // is user admin in orgs?
          const orgsWhereUserIsAdmin = organizations.filter((org) => org.orgAdmins.includes(email))
          this.userIsAdminInOrgs = pluck(orgsWhereUserIsAdmin, 'Name')
          // set activeOrganization if user is logged in and only admin in one organization
          if (this.userIsAdminInOrgs.length === 1) {
            this.activeOrganizationName = this.userIsAdminInOrgs[0]
            app.Actions.getTcsOfOrganization(this.activeOrganizationName)
            app.Actions.getPcsOfOrganization(this.activeOrganizationName)
            app.Actions.getRcsOfOrganization(this.activeOrganizationName)
          }
          // is user es-writer in orgs?
          let orgsWhereUserIsEsWriter = organizations.filter((org) => org.esWriters.includes(email))
          orgsWhereUserIsEsWriter = union(orgsWhereUserIsEsWriter, orgsWhereUserIsAdmin)
          this.userIsEsWriterInOrgs = pluck(orgsWhereUserIsEsWriter, 'Name')
          // is user lr-writer in orgs?
          let orgsWhereUserLrEsWriter = organizations.filter((org) => org.lrWriters.includes(email))
          orgsWhereUserLrEsWriter = union(orgsWhereUserLrEsWriter, orgsWhereUserIsAdmin)
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

    onGetTcsOfOrganization (orgName) {
      app.taxonomyCollectionsStore.getTcs()
        .then((tcs) => {
          this.tcsOfActiveOrganization = tcs.filter((tc) => tc.organization === orgName)
          this.triggerMe()
        })
        .catch((error) =>
          app.Actions.showError({title: 'organizationsStore, error getting existing tcs of ' + orgName + ':', msg: error})
        )
    },

    onGetPcsOfOrganization (orgName) {
      app.propertyCollectionsStore.getPcs()
        .then((pcs) => {
          this.pcsOfActiveOrganization = pcs.filter((pc) => pc.organization === orgName)
          this.triggerMe()
        })
        .catch((error) =>
          app.Actions.showError({title: 'organizationsStore, error getting existing pcs of ' + orgName + ':', msg: error})
        )
    },

    onGetRcsOfOrganization (orgName) {
      app.relationCollectionsStore.getRcs()
        .then((rcs) => {
          this.rcsOfActiveOrganization = rcs.filter((pc) => pc.organization === orgName)
          this.triggerMe()
        })
        .catch((error) =>
          app.Actions.showError({title: 'organizationsStore, error getting existing rcs of ' + orgName + ':', msg: error})
        )
    },

    triggerMe () {
      const organizations = this.organizations
      const activeOrganization = this.getActiveOrganization()
      const userIsAdminInOrgs = this.userIsAdminInOrgs
      const userIsEsWriterInOrgs = this.userIsEsWriterInOrgs
      const tcsOfActiveOrganization = this.tcsOfActiveOrganization
      const pcsOfActiveOrganization = this.pcsOfActiveOrganization
      const rcsOfActiveOrganization = this.rcsOfActiveOrganization
      this.trigger({ organizations, activeOrganization, userIsAdminInOrgs, userIsEsWriterInOrgs, tcsOfActiveOrganization, pcsOfActiveOrganization, rcsOfActiveOrganization })
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
          app.objectStore.getObject(guid)
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
              forEach(pcToImport, (value, field) => {
                // dont import _id, idField or empty fields
                if (field !== '_id' && field !== idsImportIdField && value !== '' && value !== null) {
                  // convert values / types if necessary
                  pc.Eigenschaften[field] = convertValue(value)
                }
              })
              // make sure, Eigenschaftensammlungen exists
              if (!objectToImportPcInTo.Eigenschaftensammlungen) objectToImportPcInTo.Eigenschaftensammlungen = []
              // if a pc with this name existed already, remove it
              objectToImportPcInTo.Eigenschaftensammlungen = reject(objectToImportPcInTo.Eigenschaftensammlungen, (es) => es.name === name)
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
            app.objectStore.getObject(id)
              .then((doc) => {
                doc.Eigenschaftensammlungen = reject(doc.Eigenschaftensammlungen, (es) => es.Name === name)
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
        app.objectStore.getObject(guid)
          .then((doc) => {
            doc.Eigenschaftensammlungen = reject(doc.Eigenschaftensammlungen, (es) => es.Name === name)
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
      const { idsImportIdField, name, beschreibung, datenstand, nutzungsbedingungen, link, importiertVon, orgMitSchreibrecht, zusammenfassend, nameUrsprungsEs } = state
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
      let rcsToImportObjects = groupBy(rcsToImport, '_id')
      // 2. loop the keys of this object and combine the import-objects
      forEach(rcsToImportObjects, (rcToImportArray, id) => {
        const rcstoImportObject = rcToImportArray[0]
        // use relation description from state
        let rc = buildRcFirstLevel({ id, name, beschreibung, datenstand, nutzungsbedingungen, link, importiertVon, zusammenfassend, nameUrsprungsEs })
        // combine relation partners of all objects in field Beziehungen
        rcToImportArray.forEach((rcToImport, index) => {
          let relation = {}
          forEach(rcstoImportObject, (value, field) => {
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
        app.objectStore.getObject(rcToImport._id)
          .then((objectToImportRcInTo) => {
            // make sure, Beziehungssammlungen exists
            if (!objectToImportRcInTo.Beziehungssammlungen) objectToImportRcInTo.Beziehungssammlungen = []
            // if a rc with this name existed already, remove it
            objectToImportRcInTo.Beziehungssammlungen = reject(objectToImportRcInTo.Beziehungssammlungen, (bs) => bs.Name === name)
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
            app.objectStore.getObject(id)
              .then((doc) => {
                doc.Beziehungssammlungen = reject(doc.Beziehungssammlungen, (rc) => rc.Name === name)
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
        app.objectStore.getObject(guid)
          .then((doc) => {
            doc.Beziehungssammlungen = reject(doc.Beziehungssammlungen, (rc) => rc.Name === name)
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
            doc.fields = reject(doc.fields, (field) => field.group === group)
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
            const groupsInAllFields = uniq(pluck(allFields, 'group'))
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

  app.taxonomyCollectionsStore = Reflux.createStore({
    /*
     * queries taxonomy collections
     * keeps last query result in pouch (_local/tcs.tcs) for fast delivery
     * app.js sets default _local/tcs.tcs = [] if not exists on app start
     * tc's are arrays of the form:
     * [group, standardtaxonomy, name, organization, {Beschreibung: xxx, Datenstand: xxx, Link: xxx, Nutzungsbedingungen: xxx}, count: xxx]
     *
     * when this store triggers it passes two variables:
     * tcs: the propberty collections
     * tcsQuerying: true/false: are tcs being queryied? if true: show warning in symbols
     */
    listenables: Actions,

    tcsQuerying: false,

    getTcs () {
      return new Promise((resolve, reject) => {
        app.localDb.get('_local/tcs', { include_docs: true })
          .then((doc) => resolve(doc.tcs))
          .catch((error) =>
            reject('Fehler in taxonomyCollectionsStore, getTcs: ' + error)
          )
      })
    },

    saveTc (tc) {
      let tcs
      app.localDb.get('_local/tcs', { include_docs: true })
        .then((doc) => {
          doc.tcs.push(tc)
          doc.tcs = doc.tcs.sort((tc) => tc.name)
          tcs = doc.tcs
          return app.localDb.put(doc)
        })
        .then(() => this.trigger(tcs, this.tcsQuerying))
        .catch((error) =>
          app.Actions.showError({title: 'Fehler in taxonomyCollectionsStore, saveTc:', msg: error})
        )
    },

    saveTcs (tcs) {
      app.localDb.get('_local/tcs', { include_docs: true })
        .then((doc) => {
          doc.tcs = tcs
          return app.localDb.put(doc)
        })
        .catch((error) =>
          app.Actions.showError({title: 'Fehler in taxonomyCollectionsStore, saveTcs:', msg: error})
        )
    },

    removeTcByName (name) {
      let tcs
      app.localDb.get('_local/tcs', { include_docs: true })
        .then((doc) => {
          doc.tcs = reject(doc.tcs, (tc) => tc.name === name)
          tcs = doc.tcs
          return app.localDb.put(doc)
        })
        .then(() => this.trigger(tcs, this.tcsQuerying))
        .catch((error) =>
          app.Actions.showError({title: 'Fehler in taxonomyCollectionsStore, removeTcByName:', msg: error})
        )
    },

    getTcByName (name) {
      return new Promise((resolve, reject) => {
        this.getTcs()
          .then((tcs) => {
            const tc = tcs.find((tc) => tc.name === name)
            resolve(tc)
          })
          .catch((error) => reject(error))
      })
    },

    onQueryTaxonomyCollections (offlineIndexes) {
      // if tc's exist, send them immediately
      this.tcsQuerying = true
      this.getTcs()
        .then((tcs) => this.trigger(tcs, this.tcsQuerying))
        .catch((error) =>
          app.Actions.showError({title: 'taxonomyCollectionsStore, error getting existing tcs:', msg: error})
        )
      // now fetch up to date tc's
      queryTcs(offlineIndexes)
        .then((tcs) => {
          this.tcsQuerying = false
          this.trigger(tcs, this.tcsQuerying)
          return this.saveTcs(tcs)
        })
        .catch((error) =>
          app.Actions.showError({title: 'taxonomyCollectionsStore, error querying up to date tcs:', msg: error})
        )
    }
  })

  app.propertyCollectionsStore = Reflux.createStore({
    /*
     * queries property collections
     * keeps last query result in pouch (_local/pcs.pcs) for fast delivery
     * app.js sets default _local/pcs.pcs = [] if not exists on app start
     * pc's are arrays of the form:
     * [collectionType, pcName, combining, organization, {Beschreibung: xxx, Datenstand: xxx, Link: xxx, Nutzungsbedingungen: xxx}, count: xxx]
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
          doc.pcs = reject(doc.pcs, (pc) => pc.name === name)
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
     * [collectionType, rcName, combining, organization, {Beschreibung: xxx, Datenstand: xxx, Link: xxx, Nutzungsbedingungen: xxx}, count: xxx]
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
          doc.rcs = reject(doc.rcs, (rc) => rc.name === name)
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
          .then((doc) => {
            refreshUserRoles(doc.email)
            resolve(doc)
          })
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
          /*
           * need to requery organizations if they have been loaded
           * because isUserAdmin needs to be updated
           */
          if (email && app.organizationsStore.organizations.length > 0) app.Actions.getOrganizations(email)
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
     * well, they are kept in the pouch in localDb
     */
    listenables: Actions,

    onLoadPaths (newItemsPassed) {
      // get existing paths
      addPathsFromItemsToLocalDb(newItemsPassed)
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
     * well, they are kept in localDb in _local/filterOptions
    */
    listenables: Actions,

    getOptions () {
      return new Promise((resolve, reject) => {
        app.localDb.get('_local/filterOptions')
          .then((doc) => resolve(doc.filterOptions))
          .catch((error) =>
            reject('filterOptionsStore: error fetching filterOptions from localDb:', error)
          )
      })
    },

    onLoadFilterOptions (newItemsPassed) {
      this.trigger({
        filterOptions: null,
        loading: true
      })
      // get existing filterOptions
      this.getOptions()
        .then((optionsFromPouch) => {
          let filterOptions = optionsFromPouch
          if (newItemsPassed) filterOptions = filterOptions.concat(buildFilterOptions(newItemsPassed))
          const loading = false
          this.trigger({ filterOptions, loading })
        })
        .catch((error) =>
          app.Actions.showError({title: 'filterOptionsStore: error preparing trigger:', msg: error})
        )
    },

    onChangeFilterOptionsForObject (object) {
      const option = buildFilterOptionsFromObject(object)
      let options = null
      app.localDb.get('_local/filterOptions')
        .then((doc) => {
          // replace option with new
          doc.filterOptions = doc.filterOptions.filter((op) => op.value !== object._id)
          doc.filterOptions.push(option)
          options = doc.filterOptions
          return app.localDb.put(doc)
        })
        .then(() => this.trigger({ options: options, loading: false }))
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

    onLoadActivePath (path, guid) {
      // only change if something has changed
      if (this.guid !== guid || !isEqual(this.path, path)) {
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

    onLoadActiveObject (guid) {
      // check if group is loaded > get object from objectStore
      if (!guid) {
        this.onLoadActiveObjectCompleted({})
      } else {
        app.objectStore.getObject(guid)
          // group is already loaded
          // pass object to activeObjectStore by completing action
          // if object is empty, store will have no item
          // so there is never a failed action
          .then((object) => this.onLoadActiveObjectCompleted(object))
          .catch((error) => {  // eslint-disable-line handle-callback-err
            // this group is not loaded yet
            // get Object from couch
            app.remoteDb.get(guid, { include_docs: true })
              .then((object) => this.onLoadActiveObjectCompleted(object))
              .catch((error) => app.Actions.showError({
                title: 'error fetching doc from remoteDb with guid ' + guid + ':',
                msg: error
              }))
          })
      }
    },

    onLoadActiveObjectCompleted (item) {
      // console.log('activeObjectStore, onLoadActiveObjectCompleted, item', item)
      // only change if active item has changed
      if (!isEqual(item, this.item)) {
        // item can be an object or {}
        this.item = item
        this.loaded = Object.keys(item).length > 0
        // tell views that data has changed
        this.trigger(item, [])
        // load path for this object...
        // console.log('activeObjectStore, onLoadActiveObjectCompleted,  will call getPathFromGuid with guid', item._id)
        if (item && item._id) {
          getPathFromGuid(item._id)
            .then(({ path, url }) => {
              // ...if it differs from the loaded path
              if (!isEqual(app.activePathStore.path, path)) app.Actions.loadActivePath(path, item._id)
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
        getGroupsLoadedFromLocalDb()
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
      // otherwise 5 addGroupsLoadedToLocalDb calls occur at the same moment...
      const { group, allGroups, finishedLoading } = objectPassed
      const gruppen = getGruppen()

      getGroupsLoadedFromLocalDb()
        .then((groupsLoaded) => {
          // if an object with this group is contained in groupsLoading, remove it
          if (allGroups) {
            this.groupsLoading = []
          } else {
            this.groupsLoading = reject(this.groupsLoading, (groupObject) => groupObject.group === group)
          }
          // add the passed object, if it is not yet loaded
          if (!finishedLoading) {
            // add it to the beginning of the array
            this.groupsLoading.unshift(objectPassed)
          }
          groupsLoaded = allGroups ? gruppen : union(groupsLoaded, [group])
          if (finishedLoading) {
            // remove this group from groupsLoading
            this.groupsLoading = without(this.groupsLoading, group)
            // load next group if on is queued
            if (this.groupsLoading.length > 0) {
              // get group of last element
              const nextGroup = this.groupsLoading[this.groupsLoading.length - 1].group
              // load if
              loadGroupFromRemote(nextGroup)
                .then(() => app.objectStore.getHierarchy())
                .catch((error) => {
                  const errorMsg = 'Actions.loadObject, error loading group ' + nextGroup + ': ' + error
                  app.objectStore.onLoadObjectFailed(errorMsg, nextGroup)
                })
            }
            // write change to groups loaded to localDb
            const groupsToPass = allGroups ? gruppen : [group]
            addGroupsLoadedToLocalDb(groupsToPass)
              .catch((error) =>
                app.Actions.showError({title: 'loadingGroupsStore, onShowGroupLoading, error adding group(s) to localDb:', msg: error})
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
          app.Actions.showError({title: 'loadingGroupsStore, onShowGroupLoading, error getting groups loaded from localDb:', msg: error})
        )
    }
  })

  app.objectStore = Reflux.createStore({
    /*
     * keeps an array of objects, of hierarchy objects and of groups loaded (i.e. their names)
     * they are managed with the same store (but different databases)
     * because they depend on each other / always change together
     *
     * objects are kept in the pouch in localDb,
     * hierarchies in localDb,
     * groups in localDb
    */
    listenables: Actions,

    // getObjects and getObject get Object(s) from pouch if loaded
    getObjects () {
      return getItemsFromLocalDb()
    },

    getObject (guid) {
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
            reject('objectStore, getObject: error getting item from guid' + guid + ': ', error)
          )
      })
    },

    onSaveObject (object, oldObject) {
      /**
       * 1. write object to localDb
       * 2. update object rev
       * 3. if object is active: update activeObjectStore
       * 4. replace path in pathStore
       * 5. replace path in activePathStore
       * 5. replace filter options in filterOptionsStore
       * 6. update hierarchy
       * 7. replicate changes to remoteDb
       */

      // 1. write object to localDb
      app.localDb.put(object)
        .then((result) => {
          // 2. update object rev
          object._rev = result.rev
          // 3. if object is active: update activeObjectStore
          const objectIsActive = app.activeObjectStore.item && app.activeObjectStore.item._id && app.activeObjectStore.item._id === object._id
          if (objectIsActive) app.Actions.loadActiveObject(object._id)
          // 4. replace path in pathStore
          changePathOfObjectInLocalDb(object)
          updateActivePathFromObject(object)
          // 5. replace filter options in filterOptionsStore
          app.Actions.changeFilterOptionsForObject(object)
          // 6. update hierarchy
          this.updateHierarchyForObject(object)
          // 7. replicate changes to remoteDb
          app.Actions.replicateToRemoteDb()
        })
        .catch((error) => {
          app.Actions.showError({ title: 'objectStore: error saving object:', msg: error })
        })
    },

    getHierarchy () {
      getHierarchyFromLocalDb()
        .then((hierarchy) => this.trigger(hierarchy))
        .catch((error) =>
          app.Actions.showError({title: 'objectStore, error getting hierarchy:', msg: error})
        )
    },

    updateHierarchieInChildObject (guid, index, name) {
      this.getObject(guid)
        .then((object) => {
          const taxonomies = object.Taxonomien
          if (taxonomies) {
            const taxonomy = taxonomies.find((taxonomy) => taxonomy.Standardtaxonomie)
            if (taxonomy) {
              const hierarchy = get(taxonomy, 'Eigenschaften.Hierarchie')
              if (hierarchy && hierarchy.length && hierarchy.length > 0 && hierarchy[index] && hierarchy[index].Name) {
                hierarchy[index].Name = name
                return app.localDb.put(object)
              }
            }
          }
        })
        .catch((error) => app.Actions.showError({ title: 'objectStore: error updating hierarchy in child object:', msg: error }))
    },

    updateChildrensPath (child, index, name) {
      // 1. update path of child
      child.path[index] = name
      // 2. update Hierarchie in child object
      if (child.GUID) this.updateHierarchieInChildObject(child.GUID, index - 1, name)
      // 3. update it's children
      const children = child.children
      if (children && children.length && children.length > 0) {
        children.forEach((child) => this.updateChildrensPath(child, index, name))
      }
    },

    updateHierarchyForObject (object) {
      // if lr need to update names in child lr's hierarchies
      // idea: use _local/hierarchy and follow its hierarchy down
      // then change _local/hierarchy AND the objects themselves
      const taxonomies = object.Taxonomien
      const group = object.Gruppe

      if (group && taxonomies) {
        const taxonomy = taxonomies.find((taxonomy) => taxonomy.Standardtaxonomie)
        if (taxonomy) {
          const objectHierarchy = get(taxonomy, 'Eigenschaften.Hierarchie')
          if (objectHierarchy && objectHierarchy.length && objectHierarchy.length > 0) {
            const objectHierarchyObject = objectHierarchy[objectHierarchy.length - 1]
            if (objectHierarchyObject && objectHierarchyObject.Name && objectHierarchyObject.GUID) {
              let globalHierarchy
              app.localDb.get('_local/hierarchy')
                .then((doc) => {
                  globalHierarchy = doc.hierarchy
                  // drill down to this object's hierarchy
                  const gruppeHierarchy = globalHierarchy.find((h) => h.Name === group)
                  let hierarchyPart = gruppeHierarchy
                  objectHierarchy.forEach((hO, index) => {
                    if (hO.GUID) {
                      hierarchyPart = hierarchyPart.children.find((child) => child.GUID === hO.GUID)
                    } else {
                      // non-LR: upper hierarchy levels have no guid
                      hierarchyPart = hierarchyPart.children.find((child) => child.Name === hO.Name)
                    }
                  })
                  // update Name
                  hierarchyPart.Name = objectHierarchyObject.Name
                  // now update path Name in all childrens hierarchy objects
                  let children = hierarchyPart.children
                  if (children && children.length && children.length > 0) {
                    children.forEach((child) =>
                      this.updateChildrensPath(child, objectHierarchy.length, objectHierarchyObject.Name)
                    )
                  }
                  // save doc
                  return app.localDb.put(doc)
                })
                .then(() => this.trigger(globalHierarchy))
                .catch((error) =>
                  reject('objectStore: error updating hierarchy for object: ' + error)
                )
            }
          }
        }
      }
    },

    onLoadPouchFromLocal (groupsLoadedInPouch) {
      Actions.loadFilterOptions()
      this.getHierarchy()
    },

    onLoadPouchFromRemote () {
      const groups = getGruppen()
      let groupsLoading = []
      // get groups already loaded
      app.loadingGroupsStore.groupsLoaded()
        .then((groupsLoaded) => {
          groupsLoading = difference(groups, groupsLoaded)
          // load all groups not yet loaded
          groupsLoading.forEach((group) => Actions.loadObject(group))
        })
        .catch((error) => app.Actions.showError({
          title: 'Actions.loadPouchFromRemote, error loading groups:',
          msg: error
        }))
    },

    onLoadObject (gruppe) {
      // make sure gruppe was passed
      if (!gruppe) return false
      // make sure a valid group was passed
      const gruppen = getGruppen()
      const validGroup = gruppen.includes(gruppe)
      if (!validGroup) return this.onLoadObjectFailed('Actions.loadObject: the group passed is not valid', gruppe)

      // app.loadingGroupsStore.groupsLoading is a task list that is worked off one by one
      // if a loadGroupFromRemote call is started while the last is still active, bad things happen
      // > add this group to the tasklist
      const groupsLoadingObject = {
        group: gruppe,
        message: 'Werde ' + gruppe + ' laden...'
      }
      app.loadingGroupsStore.groupsLoading.unshift(groupsLoadingObject)
      // check if there are groups loading now
      // if yes: when finished, loadGroupFromRemote will begin loading the next group in the queue
      if (app.loadingGroupsStore.groupsLoading.length === 1) {
        // o.k., no other group is being loaded - go on
        loadGroupFromRemote(gruppe)
          .then(() => this.getHierarchy())
          .catch((error) => {
            const errorMsg = 'Actions.loadObject, error loading group ' + gruppe + ': ' + error
            this.onLoadObjectFailed(errorMsg, gruppe)
          })
      }
    },

    onLoadObjectFailed (error, gruppe) {
      // remove loading indicator
      Actions.showGroupLoading({
        group: gruppe,
        finishedLoading: true
      })
      app.Actions.showError({title: 'objectStore: loading items failed with error:', msg: error})
    }
  })
}
