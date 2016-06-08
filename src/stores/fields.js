import app from 'ampersand-app'
import Reflux from 'reflux'
import {
  map as _map,
  reject as _reject,
  uniq
} from 'lodash'
import queryFieldsOfGroup from '../queries/fieldsOfGroup.js'
import getFieldsForGroupsToExportByCollectionType from '../modules/getFieldsForGroupsToExportByCollectionType.js'

export default (Actions) => Reflux.createStore({
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

  getFields() {
    return new Promise((resolve, reject) => {
      app.localDb.get('_local/fields')
        .then((doc) => resolve(doc.fields))
        .catch((error) => reject(`Fehler in fieldsStore, getFields: ${error}`))
    })
  },

  saveFieldsOfGroup(fields, group) {
    return new Promise((resolve, reject) => {
      let allFields = []
      app.localDb.get('_local/fields')
        .then((doc) => {
          if (doc.fields.length > 0) {
            doc.fields = _reject(doc.fields, (field) =>
              field.group === group
            )
          }
          doc.fields = doc.fields.concat(fields)
          allFields = doc.fields
          return app.localDb.put(doc)
        })
        .then(() => resolve(allFields))
        .catch((error) => reject(error))
    })
  },

  getFieldsOfGroups(groups) {
    return new Promise((resolve, reject) => {
      this.getFields()
        .then((fields) => {
          const groupsFields = fields.filter((field) =>
            groups.includes(field.group)
          )
          resolve(groupsFields)
        })
        .catch((error) => reject(error))
    })
  },

  emptyFields() {
    return new Promise((resolve, reject) => {
      app.localDb.get('_local/fields')
        .then((doc) => {
          doc.fields = []
          return app.localDb.put(doc)
        })
        .then(() => resolve([]))
        .catch((error) => reject(error))
    })
  },

  onQueryFields(
    groupsToExport,
    group,
    combineTaxonomies,
    offlineIndexes
  ) {
    // if fields exist, send them immediately
    let taxonomyFields = {}
    let pcFields = {}
    let relationFields = {}
    let fieldsQuerying = true
    const fieldsQueryingError = null
    // trigger empty fields to make react rebuild panels from scratch so they are correctly sorted
    this.trigger({
      taxonomyFields,
      pcFields,
      relationFields,
      fieldsQuerying,
      fieldsQueryingError
    })
    this.getFields()
      .then((allFields) => {
        if (allFields.length > 0) {
          taxonomyFields = getFieldsForGroupsToExportByCollectionType(
            allFields,
            groupsToExport,
            'taxonomy',
            combineTaxonomies
          )
          pcFields = getFieldsForGroupsToExportByCollectionType(
            allFields,
            groupsToExport,
            'propertyCollection'
          )
          relationFields = getFieldsForGroupsToExportByCollectionType(
            allFields,
            groupsToExport,
            'relation'
          )
        }
        if (!group) {
          // if no group was passed, the zusammenfassen option was changed
          fieldsQuerying = false
          this.trigger({
            taxonomyFields,
            pcFields,
            relationFields,
            fieldsQuerying,
            fieldsQueryingError
          })
        } else {
          // check if group is not in allFields
          // if so: queryFieldsOfGroup
          // only do this if group was passed
          const groupsInAllFields = uniq(_map(allFields, 'group'))
          const fieldsExistForRequestedGroup = groupsInAllFields.includes(group)
          fieldsQuerying = !fieldsExistForRequestedGroup
          this.trigger({
            taxonomyFields,
            pcFields,
            relationFields,
            fieldsQuerying,
            fieldsQueryingError
          })
          if (!fieldsExistForRequestedGroup) {
            // fetch up to date fields for the requested group
            this.queryFieldsOfGroup({
              groupsToExport,
              group,
              combineTaxonomies,
              offlineIndexes
            })
          }
        }
      })
      .catch((error) =>
        app.Actions.showError({
          title: 'fieldsStore, error getting existing fields:',
          msg: error
        })
      )
  },

  queryFieldsOfGroup({
    groupsToExport,
    group,
    combineTaxonomies,
    offlineIndexes
  }) {
    // fetch up to date fields for the requested group
    queryFieldsOfGroup(group, offlineIndexes)
      .then((fieldsOfGroup) =>
        this.saveFieldsOfGroup(fieldsOfGroup, group)
      )
      .then((allFields) => {
        const taxonomyFields = getFieldsForGroupsToExportByCollectionType(
          allFields,
          groupsToExport,
          'taxonomy',
          combineTaxonomies
        )
        const pcFields = getFieldsForGroupsToExportByCollectionType(
          allFields,
          groupsToExport,
          'propertyCollection'
        )
        const relationFields = getFieldsForGroupsToExportByCollectionType(
          allFields,
          groupsToExport,
          'relation'
        )
        const fieldsQuerying = false
        const fieldsQueryingError = null
        return this.trigger({
          taxonomyFields,
          pcFields,
          relationFields,
          fieldsQuerying,
          fieldsQueryingError
        })
      })
      .catch((error) => {
        const taxonomyFields = {}
        const pcFields = {}
        const relationFields = {}
        const fieldsQuerying = false
        const fieldsQueryingError = error
        this.trigger({
          taxonomyFields,
          pcFields,
          relationFields,
          fieldsQuerying,
          fieldsQueryingError
        })
      })
  }
})
