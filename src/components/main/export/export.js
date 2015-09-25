'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Accordion, Panel } from 'react-bootstrap'
import _ from 'lodash'
import Panel1 from './panel1/panel1.js'
import Panel2 from './panel2/panel2.js'
import Panel3 from './panel3/panel3.js'
import ModalTooManyFieldsChosen from './modalTooManyFieldsChosen.js'

export default React.createClass({
  displayName: 'Export',

  propTypes: {
    groupsLoadingObjects: React.PropTypes.array,
    fieldsQuerying: React.PropTypes.bool,
    fieldsQueryingError: React.PropTypes.object,
    errorBuildingFields: React.PropTypes.string,
    taxonomyFields: React.PropTypes.object,
    pcFields: React.PropTypes.object,
    relationFields: React.PropTypes.object,
    groupsLoadedOrLoading: React.PropTypes.array,
    taxonomienZusammenfassen: React.PropTypes.bool,
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
    oneRowPerRelation: React.PropTypes.bool
  },

  /**
   * exportOptions
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
   *     fName: {
   *       value: '',
   *       comparisonOperator: '',
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
      errorBuildingFields: null,
      taxonomienZusammenfassen: false,
      activePanel: 1,
      panel1Done: null,
      panel2Done: null,
      panel3Done: null,
      exportOptions: exportOptions,
      onlyObjectsWithCollectionData: true,
      includeDataFromSynonyms: true,
      tooManyFieldsChoosen: false,
      maxNumberOfFieldsToChoose: 35,
      /**
       * need to be state because field allChoosen needs to be unchecked
       * when a single field in the collection is unchecked
       */
      collectionsWithAllChoosen: [],
      /**
       * when relations are choosen there are two possibilities:
       * 1. export one row per relation
       *    in this case make sure only one relation is choosen
       *    this is the standard mode
       * 2. export on row per object
       *    and combine all relations in one field
       *    separated by commas
       */
      oneRowPerRelation: true
    }
  },

  componentDidMount () {
    const { offlineIndexes } = this.props
    // make sure, pcs are queried
    app.Actions.queryPropertyCollections(offlineIndexes)
    app.Actions.queryRelationCollections(offlineIndexes)
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
        const isPanel3Done = this.isPanel3Done()
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
    const isPanel2Done = this.isPanel2Done()
    const panel3Done = false
    let state = { panel3Done }
    if (isPanel2Done && !panel3Done) state = Object.assign(state, { activePanel: 3 })
    this.setState(state)
    return panel3Done
  },

  onChangeGroupsToExport (group, checked) {
    let { exportOptions } = this.state
    const { taxonomienZusammenfassen } = this.state
    const { offlineIndexes } = this.props
    if (checked) exportOptions.object.Gruppen.value.push(group)
    if (!checked) exportOptions.object.Gruppen.value = _.without(exportOptions.object.Gruppen.value, group)
    const panel1Done = exportOptions.object.Gruppen.value.length > 0
    const panel2Done = exportOptions.object.Gruppen.value.length > 0
    this.setState({ exportOptions, panel1Done, panel2Done })
    app.Actions.queryFields(exportOptions.object.Gruppen.value, group, taxonomienZusammenfassen, offlineIndexes)
    // console.log('exportOptions', exportOptions)
  },

  onChangeTaxonomienZusammenfassen (taxonomienZusammenfassen) {
    const { exportOptions } = this.state
    const { offlineIndexes } = this.props
    const group = null
    this.setState({ taxonomienZusammenfassen })
    // recalculate taxonomyFields
    const groupsToExport = exportOptions.object.Gruppen.value
    app.Actions.queryFields(groupsToExport, group, taxonomienZusammenfassen, offlineIndexes)
  },

  onChangeCoSelect (cName, fName, event) {
    const { exportOptions } = this.state
    const co = event.target.value
    const coPath = `${cName}.${fName}.co`
    _.set(exportOptions, coPath, co)
    // console.log('exportOptions', exportOptions)
  },

  onChangeFilterField (cName, fName, event) {
    let { exportOptions } = this.state
    let value = event.target.value
    const valuePath = `${cName}.${fName}.value`
    // correct a few misleading values
    if (value === 'false') value = false
    if (value === 'true') value = true
    if (value === '') value = null
    _.set(exportOptions, valuePath, value)
    this.setState({ exportOptions })
    // console.log('exportOptions', exportOptions)
  },

  onChooseAllOfCollection (pcType, cName, event) {
    let { exportOptions, collectionsWithAllChoosen } = this.state
    const { maxNumberOfFieldsToChoose } = this.state
    const { taxonomyFields, pcFields, relationFields } = this.props
    const choosen = event.target.checked
    let state = {}
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

  onChooseField (cName, fName, event) {
    let { exportOptions, collectionsWithAllChoosen } = this.state
    const { maxNumberOfFieldsToChoose } = this.state
    let choosen = event.target.checked
    let state = {}
    const numberOfFieldsChoosen = this.fieldsChoosen().length + 1
    if (choosen && numberOfFieldsChoosen > maxNumberOfFieldsToChoose) {
      event.preventDefault()
      const tooManyFieldsChoosen = true
      Object.assign(state, { tooManyFieldsChoosen })
    } else {
      const valuePath = `${cName}.${fName}.export`
      _.set(exportOptions, valuePath, choosen)
      Object.assign(state, { exportOptions })
      if (choosen === false && _.includes(collectionsWithAllChoosen, cName)) {
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

  onChangeOnlyObjectsWithCollectionData (event) {
    const onlyObjectsWithCollectionData = event.target.checked
    this.setState({ onlyObjectsWithCollectionData })
  },

  onChangeIncludeDataFromSynonyms (event) {
    const includeDataFromSynonyms = event.target.checked
    this.setState({ includeDataFromSynonyms })
  },

  onChangeOneRowPerRelation (oneRowPerRelation) {
    this.setState({ oneRowPerRelation })
    console.log('onChangeOneRowPerRelation, oneRowPerRelation', oneRowPerRelation)
  },

  render () {
    const { groupsLoadedOrLoading, groupsLoadingObjects, fieldsQuerying, fieldsQueryingError, taxonomyFields, pcFields, relationFields, pcs, pcsQuerying, rcs, rcsQuerying } = this.props
    const { taxonomienZusammenfassen, errorBuildingFields, activePanel, panel1Done, exportOptions, onlyObjectsWithCollectionData, includeDataFromSynonyms, tooManyFieldsChoosen, collectionsWithAllChoosen, oneRowPerRelation } = this.state

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
                errorBuildingFields={errorBuildingFields}
                taxonomyFields={taxonomyFields}
                groupsLoadedOrLoading={groupsLoadedOrLoading}
                taxonomienZusammenfassen={taxonomienZusammenfassen}
                panel1Done={panel1Done}
                exportOptions={exportOptions}
                pcsQuerying={pcsQuerying}
                rcsQuerying={rcsQuerying}
                onChangeTaxonomienZusammenfassen={this.onChangeTaxonomienZusammenfassen}
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
                onChangeFilterField={this.onChangeFilterField}
                onChangeCoSelect={this.onChangeCoSelect} />
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
                onlyObjectsWithCollectionData={onlyObjectsWithCollectionData}
                includeDataFromSynonyms={includeDataFromSynonyms}
                collectionsWithAllChoosen={collectionsWithAllChoosen}
                oneRowPerRelation={oneRowPerRelation}
                onChangeIncludeDataFromSynonyms={this.onChangeIncludeDataFromSynonyms}
                onChangeOnlyObjectsWithCollectionData={this.onChangeOnlyObjectsWithCollectionData}
                onChooseField={this.onChooseField}
                onChooseAllOfCollection={this.onChooseAllOfCollection}
                onChangeOneRowPerRelation={this.onChangeOneRowPerRelation} />
              : null
            }
          </Panel>

          <Panel collapsible header='4. exportieren' eventKey={4} onClick={this.onClickPanel.bind(this, 4)}>
            
          </Panel>

        </Accordion>
      </div>
    )
  }
})
