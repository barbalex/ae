'use strict'

import app from 'ampersand-app'
import React from 'react'
import { ListenerMixin } from 'reflux'
import { Accordion, Panel } from 'react-bootstrap'
import { without, get, has, set, union } from 'lodash'
import Panel1 from './panel1/panel1.js'
import Panel2 from './panel2/panel2.js'
import Panel3 from './panel3/panel3.js'
import Panel4 from './panel4/panel4.js'
import ModalTooManyFieldsChoosen from './modalTooManyFieldsChoosen.js'
import ModalTooManyRcsChoosen from './modalTooManyRcsChoosen.js'

export default React.createClass({
  displayName: 'Export',

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
    tooManyRcsChoosen: React.PropTypes.bool,
    maxNumberOfFieldsToChoose: React.PropTypes.number,
    collectionsWithAllChoosen: React.PropTypes.array,
    oneRowPerRelation: React.PropTypes.bool,
    format: React.PropTypes.string,
    exportObjects: React.PropTypes.array,
    errorBuildingExportData: React.PropTypes.object
  },

  mixins: [ListenerMixin],

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
  getInitialState() {
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
       * make sure, if user chooses oneRowPerRelation,
       * he chooses fields form no more than one rc
       */
      tooManyRcsChoosen: false,
      /**
       * need to be state because field allChoosen needs to be unchecked
       * when a single field in the collection is unchecked
       */
      collectionsWithAllChoosen: [],
      /**
       * now follow the options needed to build the export data
       */
      exportOptions,
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

  componentDidMount() {
    const { offlineIndexes } = this.props
    // make sure, pcs are queried
    // app.Actions.queryTaxonomyCollections(offlineIndexes)
    app.Actions.queryPropertyCollections(offlineIndexes)
    app.Actions.queryRelationCollections(offlineIndexes)
    this.listenTo(app.exportDataStore, this.onChangeExportDataStore)
  },

  onChangeExportDataStore({ exportObjects, errorBuildingExportData }) {
    this.setState({ exportObjects, errorBuildingExportData })
  },

  handleOnSelectPanel(activeKey) {
    // this is the clean way to handle choosing a panel heading
    // but it only works when the user clicks the link in the panel heading
    // console.log('handleOnSelectPanel, activeKey', activeKey)
  },

  onClickPanel(number, event) {
    const { activePanel } = this.state
    // make sure the heading was clicked
    const parent = event.target.parentElement
    const headingWasClicked = (
      parent.className.includes('panel-title') ||
      parent.className.includes('panel-heading')
    )
    if (headingWasClicked) {
      // always close panel if it is open
      if (activePanel === number) {
        return this.setState({ activePanel: '' })
      }
      // validate input before opening a panel
      switch (number) {
        case 1:
          this.setState({ activePanel: 1 })
          break
        case 2: {
          const isPanel1Done = this.isPanel1Done()
          if (isPanel1Done) {
            this.setState({ activePanel: 2 })
          }
          break
        }
        case 3: {
          const isPanel2Done = this.isPanel2Done()
          if (isPanel2Done) {
            this.setState({ activePanel: 3 })
          }
          break
        }
        case 4: {
          const isPanel3Done = this.isPanel3Done() || this.isPanel2Done()
          if (isPanel3Done) {
            this.setState({ activePanel: 4 })
          }
          break
        }
        default:
          this.setState({ activePanel: 1 })
      }
    } else {
      event.stopPropagation()
    }
  },

  isPanel1Done() {
    const { exportOptions } = this.state
    const groupsToExport = exportOptions.object.Gruppen.value
    const panel1Done = groupsToExport.length > 0
    let state = { panel1Done }
    if (!panel1Done) {
      state = Object.assign(state, { activePanel: 1 })
    }
    this.setState(state)
    return panel1Done
  },

  isPanel2Done() {
    const panel1Done = this.isPanel1Done()
    const panel2Done = panel1Done
    let state = { panel2Done }
    if (panel1Done && !panel2Done) {
      state = Object.assign(state, { activePanel: 2 })
    }
    this.setState(state)
    return panel2Done
  },

  isPanel3Done() {
    const panel1Done = this.isPanel1Done()
    const panel3Done = panel1Done
    let state = { panel3Done }
    if (panel1Done && !panel3Done) {
      state = Object.assign(state, { activePanel: 3 })
    }
    this.setState(state)
    return panel3Done
  },

  onChangeGroupsToExport(group, checked) {
    const { combineTaxonomies, exportOptions } = this.state
    const { offlineIndexes } = this.props
    if (checked) {
      exportOptions.object.Gruppen.value.push(group)
    }
    if (!checked) {
      exportOptions.object.Gruppen.value = without(exportOptions.object.Gruppen.value, group)
    }
    const panel1Done = exportOptions.object.Gruppen.value.length > 0
    const panel2Done = exportOptions.object.Gruppen.value.length > 0
    const exportObjects = []
    this.setState({
      exportObjects,
      exportOptions,
      panel1Done,
      panel2Done
    })
    app.Actions.queryFields(
      exportOptions.object.Gruppen.value,
      group,
      combineTaxonomies,
      offlineIndexes
    )
  },

  onChangeCombineTaxonomies(combineTaxonomies) {
    const { exportOptions } = this.state
    const { offlineIndexes } = this.props
    const group = null
    const exportObjects = []
    // reset possible filters to do with taxonomy from exportOptions
    if (combineTaxonomies) {
      Object.keys(exportOptions).forEach((cName) => {
        if (get(exportOptions, `${cName}.cType`) === 'taxonomy') {
          delete exportOptions[cName]
        }
      })
    } else {
      if (has(exportOptions, 'Taxonomie(n)')) {
        delete exportOptions['Taxonomie(n)']
      }
    }
    this.setState({
      exportObjects,
      exportOptions,
      combineTaxonomies
    })
    // recalculate taxonomyFields
    const groupsToExport = exportOptions.object.Gruppen.value
    app.Actions.queryFields(
      groupsToExport,
      group,
      combineTaxonomies,
      offlineIndexes
    )
  },

  onChangeCoSelect(cName, fName, event) {
    const { exportOptions } = this.state
    const co = event.target.value
    const coPath = `${cName}.${fName}.co`
    set(exportOptions, coPath, co)
    const exportObjects = []
    this.setState({ exportObjects, exportOptions })
  },

  onChangeFilterField(cName, fName, cType, event) {
    const { exportOptions } = this.state
    let value = event.target.value
    const valuePath = `${cName}.${fName}.value`
    // correct a few misleading values
    if (value === 'false') value = false
    if (value === 'true') value = true
    if (value === '') value = null
    set(exportOptions, valuePath, value)
    const typePath = `${cName}.cType`
    set(exportOptions, typePath, cType)
    const exportObjects = []
    this.setState({ exportObjects, exportOptions })
  },

  onChooseAllOfCollection(cName, cType, event) {
    let { collectionsWithAllChoosen } = this.state
    const { exportOptions } = this.state
    const {
      taxonomyFields,
      pcFields,
      relationFields
    } = this.props
    const choosen = event.target.checked
    // set exportObjects back
    const exportObjects = []
    const state = { exportObjects }
    let fields = taxonomyFields
    if (cType === 'pc') fields = pcFields
    if (cType === 'rc') fields = relationFields
    const cNameObject = fields[cName]
    // we do not want the taxonomy field 'Hierarchie'
    if (cType === 'taxonomy' && cNameObject.Hierarchie) {
      delete cNameObject.Hierarchie
    }
    const fieldsNewlyChoosen = Object
      .keys(cNameObject)
      .map((fName) =>
        `${cName}${fName}`
      )
    if (choosen && this.tooManyFieldsChoosen(fieldsNewlyChoosen)) {
      event.preventDefault()
      const tooManyFieldsChoosen = true
      Object.assign(state, { tooManyFieldsChoosen })
    } else if (choosen && this.tooManyRcsChoosen(cName)) {
      event.preventDefault()
      const tooManyRcsChoosen = true
      Object.assign(state, { tooManyRcsChoosen })
    } else {
      Object.keys(cNameObject).forEach((fName) => {
        const valuePath = `${cName}.${fName}.export`
        set(exportOptions, valuePath, choosen)
        const typePath = `${cName}.cType`
        set(exportOptions, typePath, cType)
      })
      Object.assign(state, { exportOptions })
      if (choosen === false) {
        collectionsWithAllChoosen = without(collectionsWithAllChoosen, cName)
        Object.assign(state, { collectionsWithAllChoosen })
      } else {
        collectionsWithAllChoosen = union(collectionsWithAllChoosen, [cName])
        Object.assign(state, { collectionsWithAllChoosen })
      }
    }
    this.setState(state)
  },

  onChooseField(cName, fName, cType, event) {
    let { collectionsWithAllChoosen } = this.state
    const { exportOptions } = this.state
    const choosen = event.target.checked
    // set exportObjects back
    const exportObjects = []
    const state = { exportObjects }
    const fieldNewlyChoosen = `${cName}${fName}`
    if (choosen && this.tooManyFieldsChoosen([fieldNewlyChoosen])) {
      event.preventDefault()
      const tooManyFieldsChoosen = true
      Object.assign(state, { tooManyFieldsChoosen })
    } else if (choosen && this.tooManyRcsChoosen(cName)) {
      event.preventDefault()
      const tooManyRcsChoosen = true
      Object.assign(state, { tooManyRcsChoosen })
    } else {
      const valuePath = `${cName}.${fName}.export`
      set(exportOptions, valuePath, choosen)
      const typePath = `${cName}.cType`
      set(exportOptions, typePath, cType)
      Object.assign(state, { exportOptions })
      if (choosen === false && collectionsWithAllChoosen.includes(cName)) {
        collectionsWithAllChoosen = without(collectionsWithAllChoosen, cName)
        Object.assign(state, { collectionsWithAllChoosen })
      }
    }
    this.setState(state)
  },

  resetTooManyFieldsChoosen() {
    const tooManyFieldsChoosen = false
    this.setState({ tooManyFieldsChoosen })
  },

  tooManyFieldsChoosen(fieldsNewlyChoosen) {
    const { exportOptions, maxNumberOfFieldsToChoose } = this.state
    let fieldsChoosen = fieldsNewlyChoosen
    Object.keys(exportOptions).forEach((cName) => {
      Object.keys(exportOptions[cName]).forEach((fName) => {
        if (exportOptions[cName][fName].export) {
          const field = `${cName}${fName}`
          fieldsChoosen = union(fieldsChoosen, [field])
        }
      })
    })
    return fieldsChoosen.length > maxNumberOfFieldsToChoose
  },

  resetTooManyRcsChoosen() {
    const tooManyRcsChoosen = false
    this.setState({ tooManyRcsChoosen })
  },

  tooManyRcsChoosen(cNameNew, oneRowPerRelationPassed) {
    const { exportOptions } = this.state
    const oneRowPerRelation = oneRowPerRelationPassed || this.state.oneRowPerRelation
    let rcsChoosen = cNameNew ? [cNameNew] : []
    Object.keys(exportOptions).forEach((cName) => {
      const isRc = get(exportOptions, `${cName}.cType`) === 'rc'
      Object.keys(exportOptions[cName]).forEach((fName) => {
        if (exportOptions[cName][fName].export && isRc) {
          rcsChoosen = union(rcsChoosen, [cName])
        }
      })
    })
    rcsChoosen = union(rcsChoosen, [cNameNew])
    return oneRowPerRelation && rcsChoosen.length > 1
  },

  onChangeOnlyObjectsWithCollectionData(onlyObjectsWithCollectionData) {
    const exportObjects = []
    this.setState({ exportObjects, onlyObjectsWithCollectionData })
  },

  onChangeIncludeDataFromSynonyms(event) {
    const includeDataFromSynonyms = event.target.checked
    const exportObjects = []
    this.setState({ exportObjects, includeDataFromSynonyms })
  },

  onChangeOneRowPerRelation(oneRowPerRelation) {
    const { exportOptions } = this.state
    const exportObjects = []
    /**
     * if oneRowPerRelation = true, check in exportOptions if too many rc's were choosen
     * pass oneRowPerRelation because it's state is not yet refreshed
     */
    if (this.tooManyRcsChoosen(null, oneRowPerRelation)) {
      // reset rc settings from exportOptions
      Object.keys(exportOptions).forEach((cName) => {
        if (get(exportOptions, `${cName}.cType`) === 'rc') {
          delete exportOptions[cName]
        }
      })
    }
    this.setState({
      exportObjects,
      oneRowPerRelation,
      exportOptions
    })
  },

  onChangeFormat(format) {
    this.setState({ format })
  },

  render() {
    const {
      groupsLoadedOrLoading,
      groupsLoadingObjects,
      fieldsQuerying,
      fieldsQueryingError,
      taxonomyFields,
      pcFields,
      relationFields,
      pcs,
      pcsQuerying,
      rcs,
      rcsQuerying
    } = this.props
    const {
      combineTaxonomies,
      errorBuildingExportOptions,
      activePanel,
      panel1Done,
      exportOptions,
      onlyObjectsWithCollectionData,
      includeDataFromSynonyms,
      tooManyFieldsChoosen,
      tooManyRcsChoosen,
      collectionsWithAllChoosen,
      oneRowPerRelation,
      format,
      exportObjects,
      errorBuildingExportData
    } = this.state

    return (
      <div
        id="export"
        className="formContent"
      >
        {
          tooManyFieldsChoosen &&
          <ModalTooManyFieldsChoosen
            resetTooManyFieldsChoosen={this.resetTooManyFieldsChoosen}
          />
        }
        {
          tooManyRcsChoosen &&
          <ModalTooManyRcsChoosen
            resetTooManyRcsChoosen={this.resetTooManyRcsChoosen}
          />
        }
        <h4>Eigenschaften exportieren</h4>
        <Accordion
          activeKey={activePanel}
          onSelect={this.handleOnSelectPanel}
        >
          <Panel
            collapsible
            header="1. Gruppe(n) wählen"
            eventKey={1}
            onClick={(event) =>
              this.onClickPanel(1, event)
            }
          >
            {
              activePanel === 1 &&
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
                onChangeGroupsToExport={this.onChangeGroupsToExport}
              />
            }
          </Panel>

          <Panel
            className="exportFields"
            collapsible
            header="2. filtern"
            eventKey={2}
            onClick={(event) =>
              this.onClickPanel(2, event)
            }
          >
            {
              activePanel === 2 &&
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
                onChangeOnlyObjectsWithCollectionData={this.onChangeOnlyObjectsWithCollectionData}
              />
            }
          </Panel>

          <Panel
            collapsible
            header="3. Eigenschaften wählen"
            eventKey={3}
            onClick={(event) =>
              this.onClickPanel(3, event)
            }
          >
            {
              activePanel === 3 &&
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
                onChangeOneRowPerRelation={this.onChangeOneRowPerRelation}
              />
            }
          </Panel>

          <Panel
            collapsible
            header="4. exportieren"
            eventKey={4}
            onClick={(event) =>
              this.onClickPanel(4, event)
            }
          >
            {
              activePanel === 4 &&
              <Panel4
                exportOptions={exportOptions}
                onlyObjectsWithCollectionData={onlyObjectsWithCollectionData}
                includeDataFromSynonyms={includeDataFromSynonyms}
                oneRowPerRelation={oneRowPerRelation}
                combineTaxonomies={combineTaxonomies}
                format={format}
                onChangeFormat={this.onChangeFormat}
                exportObjects={exportObjects}
                errorBuildingExportData={errorBuildingExportData}
              />
            }
          </Panel>

        </Accordion>
      </div>
    )
  }
})
