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

export default React.createClass({
  displayName: 'Main',

  propTypes: {
    groupsToExport: React.PropTypes.array,
    fieldsQuerying: React.PropTypes.bool,
    fieldsQueryingError: React.PropTypes.string,
    errorBuildingFields: React.PropTypes.string,
    taxonomyFields: React.PropTypes.array,
    pcFields: React.PropTypes.array,
    relationFields: React.PropTypes.array,
    groupsLoadedOrLoading: React.PropTypes.array,
    taxonomienZusammenfassen: React.PropTypes.bool,
    activePanel: React.PropTypes.number
  },

  getInitialState () {
    return {
      groupsToExport: [],
      errorBuildingFields: null,
      taxonomienZusammenfassen: false,
      activePanel: 1
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
    const panel1Done = taxonomyFields.length > 0
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
    if (checked) groupsToExport.push(group)
    if (!checked) groupsToExport = _.without(groupsToExport, group)
    this.setState({ groupsToExport })
    app.Actions.queryFields(groupsToExport)
  },

  onChangeTaxonomienZusammenfassen (taxonomienZusammenfassen) {
    this.setState({ taxonomienZusammenfassen })
  },

  render () {
    const { groupsLoadedOrLoading, fieldsQuerying, fieldsQueryingError, taxonomyFields, pcFields, relationFields } = this.props
    const { groupsToExport, taxonomienZusammenfassen, errorBuildingFields, activePanel } = this.state
    const showAlertLoadGroups = groupsLoadedOrLoading.length === 0
    const showAlertGroups = groupsToExport.length > 0 && !showAlertLoadGroups
    return (
      <div id='export' className='formContent'>
        <h4>Eigenschaften exportieren</h4>
        <Accordion activeKey={activePanel}>
          <Panel collapsible header='1. Gruppe(n) wählen' eventKey={1} onClick={this.onClickPanel.bind(this, 1)}>
            {showAlertLoadGroups ? <AlertLoadGroups /> : null}
            {!showAlertLoadGroups ? <WellSoGehtsGruppeWaehlen /> : null}
            {!showAlertLoadGroups ?
              <GroupsToExport
                groupsLoadedOrLoading={groupsLoadedOrLoading}
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

          <Panel collapsible header='2. filtern' eventKey={2} onClick={this.onClickPanel.bind(this, 2)}>
            <WellSoGehtsFiltern />
            <WellTippsTricksFiltern />
          </Panel>

          <Panel collapsible header="3. Eigenschaften wählen" eventKey={3} onClick={this.onClickPanel.bind(this, 3)}>
            
          </Panel>

          <Panel collapsible header='4. exportieren' eventKey={4} onClick={this.onClickPanel.bind(this, 4)}>
            
          </Panel>

        </Accordion>
      </div>
    )
  }

})
