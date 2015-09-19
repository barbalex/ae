'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Accordion, Panel, Input } from 'react-bootstrap'
import _ from 'lodash'
import WellSoGehtsGruppeWaehlen from './wellSoGehtsGruppeWaehlen.js'
import GroupsToExport from './groupsToExport.js'
import WellTaxonomienZusammenfassen from './wellTaxonomienZusammenfassen.js'
import AlertGroups from './alertGroups.js'
import AlertLoadGroups from './alertLoadGroups.js'
import WellSoGehtsFiltern from './wellSoGehtsFiltern.js'
import WellTippsTricksFiltern from './wellTippsTricksFiltern.js'
import FilterFieldsTaxonomy from './filterFieldsTaxonomy.js'
import FilterFieldsPCs from './filterFieldsPCs.js'
import FilterFieldsRCs from './filterFieldsRCs.js'

export default React.createClass({
  displayName: 'Main',

  propTypes: {
    groupsToExport: React.PropTypes.array,
    groupsLoadingObjects: React.PropTypes.array,
    fieldsQuerying: React.PropTypes.bool,
    fieldsQueryingError: React.PropTypes.string,
    errorBuildingFields: React.PropTypes.string,
    taxonomyFields: React.PropTypes.object,
    pcFields: React.PropTypes.object,
    relationFields: React.PropTypes.object,
    groupsLoadedOrLoading: React.PropTypes.array,
    taxonomienZusammenfassen: React.PropTypes.bool,
    activePanel: React.PropTypes.number,
    exportFilters: React.PropTypes.object
  },

  getInitialState () {
    return {
      groupsToExport: [],
      errorBuildingFields: null,
      taxonomienZusammenfassen: false,
      activePanel: 1,
      exportFilters: {}
    }
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
    const panel2Done = panel1Done && false
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
    if (checked) groupsToExport.push(group)
    if (!checked) groupsToExport = _.without(groupsToExport, group)
    this.setState({ groupsToExport })
    app.Actions.queryFields(groupsToExport, group, taxonomienZusammenfassen)
  },

  onChangeTaxonomienZusammenfassen (taxonomienZusammenfassen) {
    const { groupsToExport } = this.state
    const group = null
    this.setState({ taxonomienZusammenfassen })
    // recalculate taxonomyFields
    app.Actions.queryFields(groupsToExport, group, taxonomienZusammenfassen)
  },

  onChangeFilterField (fName, event) {
    const value = event.target.value
    let { exportFilters } = this.state

    if (value || value === 0) {
      exportFilters[fName] = value
    } else if (exportFilters[fName]) {
      delete exportFilters[fName]
    }
    this.setState({ exportFilters })

    console.log('field ' + fName + ' changed to:', value)
  },

  render () {
    const { groupsLoadedOrLoading, groupsLoadingObjects, fieldsQuerying, fieldsQueryingError, taxonomyFields, pcFields, relationFields } = this.props
    const { groupsToExport, taxonomienZusammenfassen, errorBuildingFields, activePanel, exportFilters } = this.state
    const showAlertLoadGroups = groupsLoadedOrLoading.length === 0
    const showAlertGroups = groupsToExport.length > 0 && !showAlertLoadGroups
    const groupsLoading = _.pluck(groupsLoadingObjects, 'group')
    const groupsLoaded = _.difference(groupsLoadedOrLoading, groupsLoading)

    // TODO: build fields from fields state
    return (
      <div id='export' className='formContent'>
        <h4>Eigenschaften exportieren</h4>
        <Accordion activeKey={activePanel}>
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
            <h3>Art / Lebensraum</h3>
            <Input type='text' label='GUID' bsSize='small' className={'controls'} onChange={this.onChangeFilterField.bind(this, '_id')} />
            <hr />
            <FilterFieldsTaxonomy
              taxonomyFields={taxonomyFields}
              onChangeFilterField={this.onChangeFilterField} />
            <FilterFieldsPCs
              pcFields={pcFields}
              onChangeFilterField={this.onChangeFilterField} />
            <FilterFieldsRCs
              relationFields={relationFields}
              onChangeFilterField={this.onChangeFilterField} />

          </Panel>

          <Panel collapsible header='3. Eigenschaften wählen' eventKey={3} onClick={this.onClickPanel.bind(this, 3)}>
            
          </Panel>

          <Panel collapsible header='4. exportieren' eventKey={4} onClick={this.onClickPanel.bind(this, 4)}>
            
          </Panel>

        </Accordion>
      </div>
    )
  }
})
