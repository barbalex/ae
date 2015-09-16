'use strict'

// import app from 'ampersand-app'
import React from 'react'
import { Accordion, Panel } from 'react-bootstrap'
import _ from 'lodash'
import WellSoGehts from './wellSoGehts.js'
import GroupsToExport from './groupsToExport.js'
import ButtonTaxonomienZusammenfassen from './buttonTaxonomienZusammenfassen.js'
import WellTaxonomienZusammenfassen from './wellTaxonomienZusammenfassen.js'

export default React.createClass({
  displayName: 'Main',

  propTypes: {
    groupsToExport: React.PropTypes.array,
    groupsLoadedOrLoading: React.PropTypes.array,
    taxonomienZusammenfassen: React.PropTypes.bool,
    activePanel: React.PropTypes.number
  },

  // nameBestehend ... nameUrsprungsEs: input fields
  // idsAnalysisComplete ... idsNotANumber: for analysing import file and id fields
  // panel1Done, panel2Done, panel3Done: to guide inputting
  // validXxx: to check validity of these fields
  getInitialState () {
    return {
      groupsToExport: [],
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
    const panel1Done = false
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
  },

  onChangeTaxonomienZusammenfassen (taxonomienZusammenfassen) {
    this.setState({ taxonomienZusammenfassen })
  },

  render () {
    const { groupsLoadedOrLoading } = this.props
    const { groupsToExport, taxonomienZusammenfassen, activePanel } = this.state
    return (
      <div id='export' className='formContent'>
        <h4>Eigenschaften exportieren</h4>
        <Accordion activeKey={activePanel}>
          <Panel collapsible header='1. Gruppe(n) wählen' eventKey={1} onClick={this.onClickPanel.bind(this, 1)}>
            <WellSoGehts />
            <GroupsToExport
              groupsLoadedOrLoading={groupsLoadedOrLoading}
              groupsToExport={groupsToExport}
              onChangeGroupsToExport={this.onChangeGroupsToExport} />
            <ButtonTaxonomienZusammenfassen
              taxonomienZusammenfassen={taxonomienZusammenfassen}
              onChangeTaxonomienZusammenfassen={this.onChangeTaxonomienZusammenfassen} />
            <WellTaxonomienZusammenfassen />
          </Panel>

          <Panel collapsible header='2. filtern' eventKey={2} onClick={this.onClickPanel.bind(this, 2)}>
            
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
