'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Input, Accordion, Panel } from 'react-bootstrap'
import _ from 'lodash'
import FilterFieldsTaxonomy from './filterFieldsTaxonomy.js'
import FilterFieldsPCs from './filterFieldsPCs.js'
import FilterFieldsRCs from './filterFieldsRCs.js'

export default React.createClass({
  displayName: 'FilterFieldsPcs',

  propTypes: {
    taxonomyFields: React.PropTypes.object,
    pcFields: React.PropTypes.object,
    relationFields: React.PropTypes.object,
    onChangeFilterField: React.PropTypes.func,
    onChangeCoSelect: React.PropTypes.func,
    pcs: React.PropTypes.array,
    rcs: React.PropTypes.array,
    offlineIndexes: React.PropTypes.bool,
    activePanel: React.PropTypes.number
  },

  getInitialState () {
    return {
      activePanel: null
    }
  },

  onBlur (cName, fName, event) {
    const { onChangeFilterField } = this.props
    onChangeFilterField(cName, fName, event)
  },

  onClickPanel (number, event) {
    let { activePanel } = this.state
    event.stopPropagation()

    console.log('FilterFields, panel clicked, number', number)

    // make sure the heading was clicked
    const parent = event.target.parentElement
    const headingWasClicked = _.includes(parent.className, 'panel-title') || _.includes(parent.className, 'panel-heading')
    if (!headingWasClicked) return true

    console.log('FilterFields, panel heading clicked')

    // always close panel if it is open
    if (activePanel === number) return this.setState({ activePanel: '' })
    this.setState({ activePanel: number })
  },

  render () {
    const { taxonomyFields, pcFields, relationFields, onChangeFilterField, onChangeCoSelect, pcs, rcs, offlineIndexes } = this.props
    const { activePanel } = this.state

    return (
      <Accordion activeKey={activePanel}>
        <Panel collapsible header='Taxonomie' eventKey={1} onClick={this.onClickPanel.bind(this, 1)}>
          <FilterFieldsTaxonomy
            taxonomyFields={taxonomyFields}
            onChangeFilterField={onChangeFilterField}
            onChangeCoSelect={onChangeCoSelect} />
        </Panel>
        <Panel collapsible header='Eigenschaftensammlungen' eventKey={2} onClick={this.onClickPanel.bind(this, 2)}>
          <FilterFieldsPCs
            pcFields={pcFields}
            pcs={pcs}
            offlineIndexes={offlineIndexes}
            onChangeFilterField={onChangeFilterField}
            onChangeCoSelect={onChangeCoSelect} />
        </Panel>
        <Panel collapsible header='Beziehungssammlungen' eventKey={3} onClick={this.onClickPanel.bind(this, 3)}>
          <FilterFieldsRCs
            relationFields={relationFields}
            rcs={rcs}
            offlineIndexes={offlineIndexes}
            onChangeFilterField={onChangeFilterField}
            onChangeCoSelect={onChangeCoSelect} />
        </Panel>
      </Accordion>
    )
  }
})
