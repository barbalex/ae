'use strict'

import app from 'ampersand-app'
import React from 'react'
import { ListenerMixin } from 'reflux'
import { Accordion, Panel } from 'react-bootstrap'
import _ from 'lodash'
import Panel1 from './panel1/panel1.js'
import Panel2 from './panel2/panel2.js'
import Panel3 from './panel3/panel3.js'
import Panel4 from './panel4/panel4.js'
import ModalTooManyFieldsChosen from './modalTooManyFieldsChosen.js'

export default React.createClass({
  displayName: 'Export',

  mixins: [ListenerMixin],

  propTypes: {
    groupsLoadingObjects: React.PropTypes.array,
    fieldsQuerying: React.PropTypes.bool,
    fieldsQueryingError: React.PropTypes.object,
    errorBuildingExportOptions: React.PropTypes.string,
    taxonomyFields: React.PropTypes.object,
    pcFields: React.PropTypes.object,
    relationFields: React.PropTypes.object,
    groupsLoadedOrLoading: React.PropTypes.array,
    combineTaxonomies: React.PropTypes.bool,
    activePanel: React.PropTypes.number,
    panel1Done: React.PropTypes.bool,
    panel2Done: React.PropTypes.bool,
    panel3Done: React.PropTypes.bool,
    exportOptions: React.PropTypes.object,
    pcs: React.PropTypes.array,
    pcsQuerying: React.PropTypes.bool,
    rcs: React.PropTypes.array,
    rcsQuerying: React.PropTypes.bool,
    offlineIndexes: React.PropTypes.bool,
    onlyObjectsWithCollectionData: React.PropTypes.bool,
    includeDataFromSynonyms: React.PropTypes.bool,
    tooManyFieldsChoosen: React.PropTypes.bool,
    maxNumberOfFieldsToChoose: React.PropTypes.number,
    collectionsWithAllChoosen: React.PropTypes.array,
    oneRowPerRelation: React.PropTypes.bool,
    format: React.PropTypes.string,
    exportObjects: React.PropTypes.array,
    errorBuildingExportData: React.PropTypes.object
  },

  /**
   * exportOptions object:
   * co is: comparison operator
   * {
   *   object: {
   *     _id: {
   *       value: [],
   *       export: ''
   *     },
   *     Gruppen: {
   *       value: [],
   *       export: ''
   *     }
   *   }
   *   cName: {
   *     cType: '',
   *     fName: {
   *       value: '',
   *       co: '',
   *       export: ''
   *     },
   *     ...
   *   },
   *   ...
   * }
   */
  getInitialState () {
    const exportOptions = {
      object: {
        _id: {
          export: true
        },
        Gruppen: {
          value: []
        }
      }
    }
    return {
      errorBuildingExportOptions: null,
      combineTaxonomies: false,
      activePanel: 1,
      panel1Done: null,
      panel2Done: null,
      panel3Done: null,
      /**
       * make sure the user does not choose too many fields
       * this can be too much for exporting, but most of all
       * it is too much for ALT
       */
      tooManyFieldsChoosen: false,
      maxNumberOfFieldsToChoose: 35,
      /**
       * need to be state because field allChoosen needs to be unchecked
       * when a single field in the collection is unchecked
       */
      collectionsWithAllChoosen: [],
      /**
       * now follow the options needed to build the export data
       */
      exportOptions: exportOptions,
      onlyObjectsWithCollectionData: true,
      includeDataFromSynonyms: true,
      /**
       * when relations are choosen there are two possibilities:
       * 1. export one row per relation
       *    in this case make sure only one relation is choosen
       *    this is the standard mode
       * 2. export on row per object
       *    and combine all relations in one field
       *    separated by commas
       */
      oneRowPerRelation: true,
      format: 'xlsx',
      /**
       * this here is to build the export-data
       */
      exportObjects: [],
      errorBuildingExportData: null
    }
  },

  componentDidMount () {
    const { offlineIndexes } = this.props
    // make sure, pcs are queried
    app.Actions.queryPropertyCollections(offlineIndexes)
    app.Actions.queryRelationCollections(offlineIndexes)
    this.listenTo(app.exportDataStore, this.onChangeExportDataStore)
  },

  onChangeExportDataStore ({ exportObjects, errorBuildingExportData }) {
    this.setState({ exportObjects, errorBuildingExportData })
  },

  handleOnSelectPanel (activeKey) {
    // this is the clean way to handle choosing a panel heading
    // but it only works when the user clicks the link in the panel heading
    // console.log('handleOnSelectPanel, activeKey', activeKey)
  },

  onClickPanel (number, event) {
    let { activePanel } = this.state
    // make sure the heading was clicked
    const parent = event.target.parentElement
    const headingWasClicked = _.includes(parent.className, 'panel-title') || _.includes(parent.className, 'panel-heading')
    if (headingWasClicked) {
      // always close panel if it is open
      if (activePanel === number) return this.setState({ activePanel: '' })
      // validate input before opening a panel
      switch (number) {
      case 1:
        this.setState({ activePanel: 1 })
        break
      case 2:
        const isPanel1Done = this.isPanel1Done()
        if (isPanel1Done) this.setState({ activePanel: 2 })
        break
      case 3:
        const isPanel2Done = this.isPanel2Done()
        if (isPanel2Done) this.setState({ activePanel: 3 })
        break
      case 4:
        const isPanel3Done = this.isPanel3Done() || this.isPanel2Done()
        if (isPanel3Done) this.setState({ activePanel: 4 })
        break
      }
    } else {
      event.stopPropagation()
    }
  },

  isPanel1Done () {
    const { exportOptions } = this.state
    const groupsToExport = exportOptions.object.Gruppen.value
    const panel1Done = groupsToExport.length > 0
    let state = { panel1Done }
    if (!panel1Done) state = Object.assign(state, { activePanel: 1 })
    this.setState(state)
    return panel1Done
  },

  isPanel2Done () {
    const panel1Done = this.isPanel1Done()
    const panel2Done = panel1Done
    let state = { panel2Done }
    if (panel1Done && !panel2Done) state = Object.assign(state, { activePanel: 2 })
    this.setState(state)
    return panel2Done
  },

  isPanel3Done () {
    const panel1Done = this.isPanel1Done()
    const panel3Done = panel1Done
    let state = { panel3Done }
    if (panel1Done && !panel3Done) state = Object.assign(state, { activePanel: 3 })
    this.setState(state)
    return panel3Done
  },

  onChangeGroupsToExport (group, checked) {
    let { exportOptions } = this.state
    const { combineTaxonomies } = this.state
    const { offlineIndexes } = this.props
    if (checked) exportOptions.object.Gruppen.value.push(group)
    if (!checked) exportOptions.object.Gruppen.value = _.without(exportOptions.object.Gruppen.value, group)
    const panel1Done = exportOptions.object.Gruppen.value.length > 0
    const panel2Done = exportOptions.object.Gruppen.value.length > 0
    const exportObjects = []
    this.setState({ exportObjects, exportOptions, panel1Done, panel2Done })
    app.Actions.queryFields(exportOptions.object.Gruppen.value, group, combineTaxonomies, offlineIndexes)
    // console.log('exportOptions', exportOptions)
  },

  onChangeCombineTaxonomies (combineTaxonomies) {
    const { exportOptions } = this.state
    const { offlineIndexes } = this.props
    const group = null
    const exportObjects = []
    this.setState({ exportObjects, combineTaxonomies })
    // recalculate taxonomyFields
    const groupsToExport = exportOptions.object.Gruppen.value
    app.Actions.queryFields(groupsToExport, group, combineTaxonomies, offlineIndexes)
  },

  onChangeCoSelect (cName, fName, event) {
    const { exportOptions } = this.state
    const co = event.target.value
    const coPath = `${cName}.${fName}.co`
    _.set(exportOptions, coPath, co)
    const exportObjects = []
    this.setState({ exportObjects, exportOptions })
    // console.log('exportOptions', exportOptions)
  },

  onChangeFilterField (cName, fName, cType, event) {
    let { exportOptions } = this.state
    let value = event.target.value
    const valuePath = `${cName}.${fName}.value`
    // correct a few misleading values
    if (value === 'false') value = false
    if (value === 'true') value = true
    if (value === '') value = null
    _.set(exportOptions, valuePath, value)
    const typePath = `${cName}.cType`
    _.set(exportOptions, typePath, cType)
    const exportObjects = []
    this.setState({ exportObjects, exportOptions })
  },

  onChooseAllOfCollection (pcType, cName, cType, event) {
    let { exportOptions, collectionsWithAllChoosen } = this.state
    const { maxNumberOfFieldsToChoose } = this.state
    const { taxonomyFields, pcFields, relationFields } = this.props
    const choosen = event.target.checked
    // set exportObjects back
    const exportObjects = []
    let state = { exportObjects }
    let fields = taxonomyFields
    if (pcType === 'pc') fields = pcFields
    if (pcType === 'rc') fields = relationFields
    const cNameObject = fields[cName]
    // we do not want the taxonomy field 'Hierarchie'
    if (pcType === 'taxonomy' && cNameObject.Hierarchie) delete cNameObject.Hierarchie

    const numberOfFieldsChoosen = this.fieldsChoosen().length + Object.keys(cNameObject).length
    if (choosen && numberOfFieldsChoosen > maxNumberOfFieldsToChoose) {
      event.preventDefault()
      const tooManyFieldsChoosen = true
      Object.assign(state, { tooManyFieldsChoosen })
    } else {
      Object.keys(cNameObject).forEach((fName) => {
        const valuePath = `${cName}.${fName}.export`
        _.set(exportOptions, valuePath, choosen)
        const typePath = `${cName}.cType`
        _.set(exportOptions, typePath, cType)
      })
      Object.assign(state, { exportOptions })
      if (choosen === false) {
        collectionsWithAllChoosen = _.without(collectionsWithAllChoosen, cName)
        Object.assign(state, { collectionsWithAllChoosen })
      } else {
        collectionsWithAllChoosen = _.union(collectionsWithAllChoosen, [cName])
        Object.assign(state, { collectionsWithAllChoosen })
      }
    }
    this.setState(state)
    console.log('exportOptions', exportOptions)
  },

  onChooseField (cName, fName, cType, event) {
    let { exportOptions, collectionsWithAllChoosen } = this.state
    const { maxNumberOfFieldsToChoose } = this.state
    let choosen = event.target.checked
    // set exportObjects back
    const exportObjects = []
    let state = { exportObjects }
    const numberOfFieldsChoosen = this.fieldsChoosen().length + 1
    if (choosen && numberOfFieldsChoosen > maxNumberOfFieldsToChoose) {
      event.preventDefault()
      const tooManyFieldsChoosen = true
      Object.assign(state, { tooManyFieldsChoosen })
    } else {
      const valuePath = `${cName}.${fName}.export`
      _.set(exportOptions, valuePath, choosen)
      const typePath = `${cName}.cType`
      _.set(exportOptions, typePath, cType)
      Object.assign(state, { exportOptions })
      if (choosen === false && _.includes(collectionsWithAllChoosen, cName)) {
        collectionsWithAllChoosen = _.without(collectionsWithAllChoosen, cName)
        Object.assign(state, { collectionsWithAllChoosen })
      }
    }
    this.setState(state)
    console.log('exportOptions', exportOptions)
  },

  resetTooManyFieldsChoosen () {
    const tooManyFieldsChoosen = false
    this.setState({ tooManyFieldsChoosen })
  },

  fieldsChoosen () {
    const { exportOptions } = this.state
    let fieldsChoosen = []
    Object.keys(exportOptions).forEach((cName) => {
      Object.keys(exportOptions[cName]).forEach((fName) => {
        if (exportOptions[cName][fName].export) {
          const field = { cName, fName }
          fieldsChoosen.push(field)
        }
      })
    })
    return fieldsChoosen
  },

  onChangeOnlyObjectsWithCollectionData (onlyObjectsWithCollectionData) {
    const exportObjects = []
    this.setState({ exportObjects, onlyObjectsWithCollectionData })
  },

  onChangeIncludeDataFromSynonyms (event) {
    const includeDataFromSynonyms = event.target.checked
    const exportObjects = []
    this.setState({ exportObjects, includeDataFromSynonyms })
  },

  onChangeOneRowPerRelation (oneRowPerRelation) {
    const exportObjects = []
    this.setState({ exportObjects, oneRowPerRelation })
  },

  onChangeFormat (format) {
    this.setState({ format })
  },

  render () {
    const { groupsLoadedOrLoading, groupsLoadingObjects, fieldsQuerying, fieldsQueryingError, taxonomyFields, pcFields, relationFields, pcs, pcsQuerying, rcs, rcsQuerying } = this.props
    const { combineTaxonomies, errorBuildingExportOptions, activePanel, panel1Done, exportOptions, onlyObjectsWithCollectionData, includeDataFromSynonyms, tooManyFieldsChoosen, collectionsWithAllChoosen, oneRowPerRelation, format, exportObjects, errorBuildingExportData } = this.state

    return (
      <div id='export' className='formContent'>
        {tooManyFieldsChoosen ?
          <ModalTooManyFieldsChosen
            resetTooManyFieldsChoosen={this.resetTooManyFieldsChoosen} />
          : null
        }
        <h4>Eigenschaften exportieren</h4>
        <Accordion activeKey={activePanel} onSelect={this.handleOnSelectPanel}>
          <Panel collapsible header='1. Gruppe(n) wählen' eventKey={1} onClick={this.onClickPanel.bind(this, 1)}>
            {activePanel === 1 ?
              <Panel1
                groupsLoadingObjects={groupsLoadingObjects}
                fieldsQuerying={fieldsQuerying}
                fieldsQueryingError={fieldsQueryingError}
                errorBuildingExportOptions={errorBuildingExportOptions}
                taxonomyFields={taxonomyFields}
                groupsLoadedOrLoading={groupsLoadedOrLoading}
                combineTaxonomies={combineTaxonomies}
                panel1Done={panel1Done}
                exportOptions={exportOptions}
                pcsQuerying={pcsQuerying}
                rcsQuerying={rcsQuerying}
                onChangeCombineTaxonomies={this.onChangeCombineTaxonomies}
                onChangeGroupsToExport={this.onChangeGroupsToExport} />
              : null
            }
          </Panel>

          <Panel className='exportFields' collapsible header='2. filtern' eventKey={2} onClick={this.onClickPanel.bind(this, 2)}>
            {activePanel === 2 ?
              <Panel2
                groupsLoadingObjects={groupsLoadingObjects}
                taxonomyFields={taxonomyFields}
                pcFields={pcFields}
                relationFields={relationFields}
                groupsLoadedOrLoading={groupsLoadedOrLoading}
                pcs={pcs}
                rcs={rcs}
                exportOptions={exportOptions}
                onlyObjectsWithCollectionData={onlyObjectsWithCollectionData}
                onChangeFilterField={this.onChangeFilterField}
                onChangeCoSelect={this.onChangeCoSelect}
                onChangeOnlyObjectsWithCollectionData={this.onChangeOnlyObjectsWithCollectionData} />
              : null
            }
          </Panel>

          <Panel collapsible header='3. Eigenschaften wählen' eventKey={3} onClick={this.onClickPanel.bind(this, 3)}>
            {activePanel === 3 ?
              <Panel3
                taxonomyFields={taxonomyFields}
                pcFields={pcFields}
                relationFields={relationFields}
                exportOptions={exportOptions}
                pcs={pcs}
                rcs={rcs}
                includeDataFromSynonyms={includeDataFromSynonyms}
                collectionsWithAllChoosen={collectionsWithAllChoosen}
                oneRowPerRelation={oneRowPerRelation}
                onChangeIncludeDataFromSynonyms={this.onChangeIncludeDataFromSynonyms}
                onChooseField={this.onChooseField}
                onChooseAllOfCollection={this.onChooseAllOfCollection}
                onChangeOneRowPerRelation={this.onChangeOneRowPerRelation} />
              : null
            }
          </Panel>

          <Panel collapsible header='4. exportieren' eventKey={4} onClick={this.onClickPanel.bind(this, 4)}>
            {activePanel === 4 ?
              <Panel4
                exportOptions={exportOptions}
                onlyObjectsWithCollectionData={onlyObjectsWithCollectionData}
                includeDataFromSynonyms={includeDataFromSynonyms}
                oneRowPerRelation={oneRowPerRelation}
                combineTaxonomies={combineTaxonomies}
                format={format}
                onChangeFormat={this.onChangeFormat}
                exportObjects={exportObjects}
                errorBuildingExportData={errorBuildingExportData} />
              : null
            }
          </Panel>

        </Accordion>
      </div>
    )
  }
})
