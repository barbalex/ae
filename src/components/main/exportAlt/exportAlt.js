'use strict'

import app from 'ampersand-app'
import React from 'react'
import { ListenerMixin } from 'reflux'
import { Accordion, Panel } from 'react-bootstrap'
import _ from 'lodash'
import addClass from 'amp-add-class'
import Panel1 from './panel1/panel1.js'
import Panel2 from './panel2/panel2.js'
import ModalTooManyFieldsChoosen from './modalTooManyFieldsChoosen.js'
import ModalTooManyRcsChoosen from './modalTooManyRcsChoosen.js'

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
    tooManyRcsChoosen: React.PropTypes.bool,
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
          value: ['Flora', 'Fauna']
        }
      }
    }
    return {
      errorBuildingExportOptions: null,
      combineTaxonomies: true,
      activePanel: 1,
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
       *  for alt export one row per relation
       */
      oneRowPerRelation: true
    }
  },

  componentDidMount () {
    const { offlineIndexes } = this.props
    const bodyElement = document.body
    addClass(bodyElement, 'force-mobile')
    this.forceUpdate()
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
          this.setState({ activePanel: 2 })
          break
      }
    } else {
      event.stopPropagation()
    }
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

  onChooseAllOfCollection (cName, cType, event) {
    let { exportOptions, collectionsWithAllChoosen } = this.state
    const { taxonomyFields, pcFields, relationFields } = this.props
    const choosen = event.target.checked
    // set exportObjects back
    const exportObjects = []
    let state = { exportObjects }
    let fields = taxonomyFields
    if (cType === 'pc') fields = pcFields
    if (cType === 'rc') fields = relationFields
    const cNameObject = fields[cName]
    // we do not want the taxonomy field 'Hierarchie'
    if (cType === 'taxonomy' && cNameObject.Hierarchie) delete cNameObject.Hierarchie
    const fieldsNewlyChoosen = Object.keys(cNameObject).map((fName) => `${cName}${fName}`)
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
    // console.log('exportOptions', exportOptions)
  },

  onChooseField (cName, fName, cType, event) {
    let { exportOptions, collectionsWithAllChoosen } = this.state
    let choosen = event.target.checked
    // set exportObjects back
    const exportObjects = []
    let state = { exportObjects }
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
      _.set(exportOptions, valuePath, choosen)
      const typePath = `${cName}.cType`
      _.set(exportOptions, typePath, cType)
      Object.assign(state, { exportOptions })
      if (choosen === false && collectionsWithAllChoosen.includes(cName)) {
        collectionsWithAllChoosen = _.without(collectionsWithAllChoosen, cName)
        Object.assign(state, { collectionsWithAllChoosen })
      }
    }
    this.setState(state)
    // console.log('exportOptions', exportOptions)
  },

  resetTooManyFieldsChoosen () {
    const tooManyFieldsChoosen = false
    this.setState({ tooManyFieldsChoosen })
  },

  tooManyFieldsChoosen (fieldsNewlyChoosen) {
    const { exportOptions, maxNumberOfFieldsToChoose } = this.state
    let fieldsChoosen = fieldsNewlyChoosen
    Object.keys(exportOptions).forEach((cName) => {
      Object.keys(exportOptions[cName]).forEach((fName) => {
        if (exportOptions[cName][fName].export) {
          const field = `${cName}${fName}`
          fieldsChoosen = _.union(fieldsChoosen, [field])
        }
      })
    })
    return fieldsChoosen.length > maxNumberOfFieldsToChoose
  },

  resetTooManyRcsChoosen () {
    const tooManyRcsChoosen = false
    this.setState({ tooManyRcsChoosen })
  },

  tooManyRcsChoosen (cNameNew, oneRowPerRelationPassed) {
    const { exportOptions } = this.state
    const oneRowPerRelation = oneRowPerRelationPassed || this.state.oneRowPerRelation
    let rcsChoosen = cNameNew ? [cNameNew] : []
    Object.keys(exportOptions).forEach((cName) => {
      const isRc = _.get(exportOptions, `${cName}.cType`) === 'rc'
      Object.keys(exportOptions[cName]).forEach((fName) => {
        if (exportOptions[cName][fName].export && isRc) {
          rcsChoosen = _.union(rcsChoosen, [cName])
        }
      })
    })
    rcsChoosen = _.union(rcsChoosen, [cNameNew])
    return oneRowPerRelation && rcsChoosen.length > 1
  },

  onChangeIncludeDataFromSynonyms (event) {
    const includeDataFromSynonyms = event.target.checked
    const exportObjects = []
    this.setState({ exportObjects, includeDataFromSynonyms })
  },

  onChangeOneRowPerRelation (oneRowPerRelation) {
    const { exportOptions } = this.state
    const exportObjects = []
    /**
     * if oneRowPerRelation = true, check in exportOptions if too many rc's were choosen
     * pass oneRowPerRelation because it's state is not yet refreshed
     */
    if (this.tooManyRcsChoosen(null, oneRowPerRelation)) {
      // reset rc settings from exportOptions
      Object.keys(exportOptions).forEach((cName) => {
        if (_.get(exportOptions, `${cName}.cType`) === 'rc') delete exportOptions[cName]
      })
    }
    this.setState({ exportObjects, oneRowPerRelation, exportOptions })
  },

  render () {
    const { groupsLoadedOrLoading, groupsLoadingObjects, taxonomyFields, pcFields, relationFields, pcs, rcs } = this.props
    const { activePanel, exportOptions, onlyObjectsWithCollectionData, includeDataFromSynonyms, tooManyFieldsChoosen, tooManyRcsChoosen, collectionsWithAllChoosen, oneRowPerRelation } = this.state

    return (
      <div id='export' className='formContent'>
        {
          tooManyFieldsChoosen
          ? <ModalTooManyFieldsChoosen
              resetTooManyFieldsChoosen={this.resetTooManyFieldsChoosen} />
          : null
        }
        {
          tooManyRcsChoosen
          ? <ModalTooManyRcsChoosen
              resetTooManyRcsChoosen={this.resetTooManyRcsChoosen} />
          : null
        }
        <h4>Eigenschaften für das Artenlistentool wählen</h4>
        <Accordion activeKey={activePanel} onSelect={this.handleOnSelectPanel}>

          <Panel collapsible header='1. Eigenschaften wählen' eventKey={1} onClick={this.onClickPanel.bind(this, 1)}>
            {
              activePanel === 1
              ? <Panel1
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

          <Panel collapsible header='2. URL generieren' eventKey={2} onClick={this.onClickPanel.bind(this, 2)}>
            {
              activePanel === 2
              ? <Panel2
                  exportOptions={exportOptions}
                  onlyObjectsWithCollectionData={onlyObjectsWithCollectionData}
                  includeDataFromSynonyms={includeDataFromSynonyms}
                  oneRowPerRelation={oneRowPerRelation}
                  combineTaxonomies={combineTaxonomies}
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
