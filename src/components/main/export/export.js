'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Accordion, Panel } from 'react-bootstrap'
import _ from 'lodash'
import WellSoGehtsGruppeWaehlen from './wellSoGehtsGruppeWaehlen.js'
import GroupsToExport from './groupsToExport.js'
import WellTaxonomienZusammenfassen from './wellTaxonomienZusammenfassen.js'
import AlertGroups from './alertGroups.js'
import AlertLoadGroups from './alertLoadGroups.js'
import WellSoGehtsFiltern from './wellSoGehtsFiltern.js'
import WellTippsTricksFiltern from './wellTippsTricksFiltern.js'
import FilterFields from './filterFields.js'
import WellSoGehtsWaehlen from './wellSoGehtsWaehlen.js'
import CheckboxOnlyObjectsWithCollectionData from './checkboxOnlyObjectsWithCollectionData.js'
import CheckboxIncludeDataFromSynonyms from './checkboxIncludeDataFromSynonyms.js'
import ChooseFields from './chooseFields.js'

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
    exportData: React.PropTypes.object,
    pcs: React.PropTypes.array,
    rcs: React.PropTypes.array,
    offlineIndexes: React.PropTypes.bool,
    onlyObjectsWithCollectionData: React.PropTypes.bool,
    includeDataFromSynonyms: React.PropTypes.bool
  },

  /**
   * exportData
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
   *   _id: [],
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
    const exportData = {
      object: {
        Gruppen: {
          value: []
        }
      }
    }
    return {
      errorBuildingFields: null,
      taxonomienZusammenfassen: false,
      activePanel: 1,
      exportData: exportData,
      onlyObjectsWithCollectionData: true,
      includeDataFromSynonyms: true
    }
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
    const { taxonomyFields } = this.props
    const panel1Done = Object.keys(taxonomyFields).length > 0
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
    let { exportData } = this.state
    const { taxonomienZusammenfassen } = this.state
    const { offlineIndexes } = this.props
    let groupsToExport = exportData.object.Gruppen.value
    if (checked) groupsToExport.push(group)
    if (!checked) groupsToExport = _.without(groupsToExport, group)
    this.setState({ exportData })
    app.Actions.queryFields(groupsToExport, group, taxonomienZusammenfassen, offlineIndexes)
    console.log('exportData', exportData)
  },

  onChangeTaxonomienZusammenfassen (taxonomienZusammenfassen) {
    const { exportData } = this.state
    const { offlineIndexes } = this.props
    const group = null
    this.setState({ taxonomienZusammenfassen })
    // recalculate taxonomyFields
    const groupsToExport = exportData.object.Gruppen.value
    app.Actions.queryFields(groupsToExport, group, taxonomienZusammenfassen, offlineIndexes)
  },

  onChangeCoSelect (cName, fName, event) {
    const { exportData } = this.state
    const co = event.target.value
    const coPath = `${cName}.${fName}.co`
    _.set(exportData, coPath, co)
    // console.log('exportData', exportData)
  },

  onChangeFilterField (cName, fName, event) {
    let { exportData } = this.state
    let value = event.target.value
    let valuePath = `${cName}.${fName}.value`
    // correct a few misleading values
    if (value === 'false') value = false
    if (value === 'true') value = true
    if (value === '') value = null
    _.set(exportData, valuePath, value)
    this.setState({ exportData })
    console.log('exportData', exportData)
  },

  onChangeExportData (cName, fName, event) {
    let { exportData } = this.state
    let value = event.target.checked
    let valuePath = `${cName}.${fName}.export`
    _.set(exportData, valuePath, value)
    this.setState({ exportData })
    console.log('exportData', exportData)
  },

  onChangeOnlyObjectsWithCollectionData (event) {
    const onlyObjectsWithCollectionData = event.target.checked
    this.setState({ onlyObjectsWithCollectionData })
  },

  onChangeIncludeDataFromSynonyms (event) {
    const includeDataFromSynonyms = event.target.checked
    this.setState({ includeDataFromSynonyms })
  },

  render () {
    const { groupsLoadedOrLoading, groupsLoadingObjects, fieldsQuerying, fieldsQueryingError, taxonomyFields, pcFields, relationFields, pcs, rcs, offlineIndexes } = this.props
    const { taxonomienZusammenfassen, errorBuildingFields, activePanel, exportData, onlyObjectsWithCollectionData, includeDataFromSynonyms } = this.state
    const showAlertLoadGroups = groupsLoadedOrLoading.length === 0
    const groupsToExport = exportData.object.Gruppen.value
    const showAlertGroups = groupsToExport.length > 0 && !showAlertLoadGroups
    const groupsLoading = _.pluck(groupsLoadingObjects, 'group')
    const groupsLoaded = _.difference(groupsLoadedOrLoading, groupsLoading)

    return (
      <div id='export' className='formContent'>
        <h4>Eigenschaften exportieren</h4>
        <Accordion activeKey={activePanel} onSelect={this.handleOnSelectPanel}>
          <Panel collapsible header='1. Gruppe(n) wählen' eventKey={1} onClick={this.onClickPanel.bind(this, 1)}>
            {showAlertLoadGroups ? <AlertLoadGroups /> : null}
            {!showAlertLoadGroups ? <WellSoGehtsGruppeWaehlen /> : null}
            {!showAlertLoadGroups ?
              <GroupsToExport
                groupsLoaded={groupsLoaded}
                groupsToExport={groupsToExport}
                onChangeGroupsToExport={this.onChangeGroupsToExport} />
              : null
            }
            {!showAlertLoadGroups ?
              <WellTaxonomienZusammenfassen
                taxonomienZusammenfassen={taxonomienZusammenfassen}
                onChangeTaxonomienZusammenfassen={this.onChangeTaxonomienZusammenfassen} />
              : null
            }
            {showAlertGroups ?
              <AlertGroups
                fieldsQuerying={fieldsQuerying}
                fieldsQueryingError={fieldsQueryingError}
                taxonomyFields={taxonomyFields}
                errorBuildingFields={errorBuildingFields} />
              : null
            }
          </Panel>

          <Panel className='exportFields' collapsible header='2. filtern' eventKey={2} onClick={this.onClickPanel.bind(this, 2)}>

            <WellSoGehtsFiltern />
            <WellTippsTricksFiltern />
            <FilterFields
              taxonomyFields={taxonomyFields}
              pcFields={pcFields}
              pcs={pcs}
              relationFields={relationFields}
              rcs={rcs}
              offlineIndexes={offlineIndexes}
              onChangeFilterField={this.onChangeFilterField}
              onChangeCoSelect={this.onChangeCoSelect}
              onClickPanel={this.onClickPanel} />

          </Panel>

          <Panel collapsible header='3. Eigenschaften wählen' eventKey={3} onClick={this.onClickPanel.bind(this, 3)}>

            <WellSoGehtsWaehlen />
            <CheckboxOnlyObjectsWithCollectionData
              onlyObjectsWithCollectionData={onlyObjectsWithCollectionData}
              onChangeOnlyObjectsWithCollectionData={this.onChangeOnlyObjectsWithCollectionData} />
            <CheckboxIncludeDataFromSynonyms
              includeDataFromSynonyms={includeDataFromSynonyms}
              onChangeIncludeDataFromSynonyms={this.onChangeIncludeDataFromSynonyms} />
            <ChooseFields
              taxonomyFields={taxonomyFields}
              pcFields={pcFields}
              pcs={pcs}
              relationFields={relationFields}
              rcs={rcs}
              offlineIndexes={offlineIndexes}
              onChangeExportData={this.onChangeExportData}
              onClickPanel={this.onClickPanel} />
            
          </Panel>

          <Panel collapsible header='4. exportieren' eventKey={4} onClick={this.onClickPanel.bind(this, 4)}>
            
          </Panel>

        </Accordion>
      </div>
    )
  }
})
