'use strict'

import React from 'react'
import { Accordion, Panel } from 'react-bootstrap'
import _ from 'lodash'
import InputFilterGuid from './inputFilterGuid.js'
import ChosseFieldsTaxonomy from './chooseFieldsTaxonomy.js'
import ChooseFieldsPCs from './chooseFieldsPCs.js'
import ChooseFieldsRCs from './chooseFieldsRCs.js'

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
    // prevent higher level panels from reacting
    event.stopPropagation()

    // make sure the heading was clicked
    const parent = event.target.parentElement
    const headingWasClicked = _.includes(parent.className, 'panel-title') || _.includes(parent.className, 'panel-heading')
    if (headingWasClicked) {
      // always close panel if it is open
      if (activePanel === number) return this.setState({ activePanel: '' })
        // open the panel clicked
      this.setState({ activePanel: number })
    }
  },

  render () {
    const { taxonomyFields, pcFields, relationFields, onChangeFilterField, onChangeCoSelect, pcs, rcs, offlineIndexes } = this.props
    const { activePanel } = this.state

    return (
      <Accordion activeKey={activePanel}>
        <Panel collapsible header='Art / Lebensraum' eventKey={1} onClick={this.onClickPanel.bind(this, 1)}>
          <InputFilterGuid
              onChangeFilterField={this.onChangeFilterField} />
        </Panel>
        <Panel className='collectionPanel' collapsible header='Taxonomie' eventKey={2} onClick={this.onClickPanel.bind(this, 2)}>
          <ChosseFieldsTaxonomy
            taxonomyFields={taxonomyFields}
            onChangeFilterField={onChangeFilterField}
            onChangeCoSelect={onChangeCoSelect} />
        </Panel>
        <Panel className='collectionPanel' collapsible header='Eigenschaftensammlungen' eventKey={3} onClick={this.onClickPanel.bind(this, 3)}>
          <ChooseFieldsPCs
            pcFields={pcFields}
            pcs={pcs}
            offlineIndexes={offlineIndexes}
            onChangeFilterField={onChangeFilterField}
            onChangeCoSelect={onChangeCoSelect} />
        </Panel>
        <Panel className='collectionPanel' collapsible header='Beziehungssammlungen' eventKey={4} onClick={this.onClickPanel.bind(this, 4)}>
          <ChooseFieldsRCs
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
