'use strict'

import React from 'react'
import { Accordion, Panel } from 'react-bootstrap'
import _ from 'lodash'
import InputFilterGuid from './inputGuid.js'
import FieldsTaxonomy from './fieldsTaxonomy.js'
import FieldsPCs from './fieldsPCs.js'
import FieldsRCs from './fieldsRCs.js'

export default React.createClass({
  displayName: 'Fields',

  propTypes: {
    taxonomyFields: React.PropTypes.object,
    pcFields: React.PropTypes.object,
    relationFields: React.PropTypes.object,
    onChangeFilterField: React.PropTypes.func,
    onChangeCoSelect: React.PropTypes.func,
    pcs: React.PropTypes.array,
    rcs: React.PropTypes.array,
    exportOptions: React.PropTypes.object,
    activePanel: React.PropTypes.number,
    groupsLoadedOrLoading: React.PropTypes.array,
    groupsLoadingObjects: React.PropTypes.array
  },

  getInitialState () {
    return {
      activePanel: ''
    }
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
    const { taxonomyFields, pcFields, relationFields, onChangeFilterField, onChangeCoSelect, pcs, rcs, exportOptions } = this.props
    const { activePanel } = this.state
    const taxonomyHeader = Object.keys(taxonomyFields).length > 1 ? 'Taxonomien' : 'Taxonomie'

    return (
      <Accordion activeKey={activePanel}>
        <Panel collapsible header='Art / Lebensraum' eventKey={1} onClick={this.onClickPanel.bind(this, 1)}>
          {
            activePanel === 1
            ? <InputFilterGuid
                onChangeFilterField={onChangeFilterField} />
            : null
          }
        </Panel>
        <Panel
          className='collectionPanel'
          collapsible header={taxonomyHeader}
          eventKey={2}
          onClick={this.onClickPanel.bind(this, 2)}>
          {
            activePanel === 2
            ? <FieldsTaxonomy
                taxonomyFields={taxonomyFields}
                exportOptions={exportOptions}
                onChangeFilterField={onChangeFilterField}
                onChangeCoSelect={onChangeCoSelect} />
            : null
          }
        </Panel>
        <Panel
          className='collectionPanel'
          collapsible header='Eigenschaftensammlungen'
          eventKey={3}
          onClick={this.onClickPanel.bind(this, 3)}>
          {
            activePanel === 3
            ? <FieldsPCs
                pcFields={pcFields}
                pcs={pcs}
                exportOptions={exportOptions}
                onChangeFilterField={onChangeFilterField}
                onChangeCoSelect={onChangeCoSelect} />
            : null
          }
        </Panel>
        <Panel
          className='collectionPanel'
          collapsible header='Beziehungssammlungen'
          eventKey={4}
          onClick={this.onClickPanel.bind(this, 4)}>
          {
            activePanel === 4
            ? <FieldsRCs
                relationFields={relationFields}
                rcs={rcs}
                exportOptions={exportOptions}
                onChangeFilterField={onChangeFilterField}
                onChangeCoSelect={onChangeCoSelect} />
            : null
          }
        </Panel>
      </Accordion>
    )
  }
})
