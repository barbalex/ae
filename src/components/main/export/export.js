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

export default React.createClass({
  displayName: 'Main',

  propTypes: {
    groupsToExport: React.PropTypes.array,
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
    exportFilters: React.PropTypes.object,
    exportFields: React.PropTypes.object,
    pcs: React.PropTypes.array,
    rcs: React.PropTypes.array,
    offlineIndexes: React.PropTypes.bool,
    onlyObjectsWithCollectionData: React.PropTypes.bool,
    includeDataFromSynonyms: React.PropTypes.bool
  },

  /**
   * exportFilters
   * {
   *   _id: [],
   *   cName: {
   *     fName: {
   *       value: '',
   *       comparisonOperator: ''
   *     },
   *     ...
   *   },
   *   ...
   * }
   */
  getInitialState () {
    return {
      groupsToExport: [],
      errorBuildingFields: null,
      taxonomienZusammenfassen: false,
      activePanel: 1,
      exportFilters: {},
      exportFields: {},
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
    if (!headingWasClicked) return event.stopPropagation()

    // always close panel if it is open
    if (activePanel === number) return this.setState({ activePanel: '' })

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
    let { groupsToExport } = this.state
    const { taxonomienZusammenfassen } = this.state
    const { offlineIndexes } = this.props
    if (checked) groupsToExport.push(group)
    if (!checked) groupsToExport = _.without(groupsToExport, group)
    this.setState({ groupsToExport })
    app.Actions.queryFields(groupsToExport, group, taxonomienZusammenfassen, offlineIndexes)
  },

  onChangeTaxonomienZusammenfassen (taxonomienZusammenfassen) {
    const { groupsToExport } = this.state
    const { offlineIndexes } = this.props
    const group = null
    this.setState({ taxonomienZusammenfassen })
    // recalculate taxonomyFields
    app.Actions.queryFields(groupsToExport, group, taxonomienZusammenfassen, offlineIndexes)
  },

  onChangeCoSelect (cName, fName, event) {
    const { exportFilters } = this.state
    const co = event.target.value
    const coPath = `${cName}.${fName}.co`
    _.set(exportFilters, coPath, co)
    // console.log('exportFilters', exportFilters)
  },

  onChangeFilterField (cName, fName, event) {
    let { exportFilters } = this.state
    let value = event.target.value
    let valuePath = `${cName}.${fName}.value`
    if (cName === 'object' && fName === '_id') {
      // one or more guids were entered
      valuePath = `_id`
      if (value) {
        // remove empty strings from value
        value = value.replace(/\s+/g, '')
        // convert value into array
        // this way user can enter a single guid or many comma separated
        value = value.split(',')
      } else {
        value = null
      }
    }
    if (value === 'false') value = false
    if (value === 'true') value = true
    _.set(exportFilters, valuePath, value)
    this.setState({ exportFilters })
    // console.log('exportFilters', exportFilters)
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
    const { groupsToExport, taxonomienZusammenfassen, errorBuildingFields, activePanel, exportFilters, onlyObjectsWithCollectionData, includeDataFromSynonyms } = this.state
    const showAlertLoadGroups = groupsLoadedOrLoading.length === 0
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
            
          </Panel>

          <Panel collapsible header='4. exportieren' eventKey={4} onClick={this.onClickPanel.bind(this, 4)}>
            
          </Panel>

        </Accordion>
      </div>
    )
  }
})
