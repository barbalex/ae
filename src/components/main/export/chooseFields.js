'use strict'

import React from 'react'
import { Accordion, Panel, Input } from 'react-bootstrap'
import _ from 'lodash'
import ChooseFieldsTaxonomy from './chooseFieldsTaxonomy.js'
import ChooseFieldsPCs from './chooseFieldsPCs.js'
import ChooseFieldsRCs from './chooseFieldsRCs.js'

export default React.createClass({
  displayName: 'ChooseFields',

  propTypes: {
    taxonomyFields: React.PropTypes.object,
    pcFields: React.PropTypes.object,
    relationFields: React.PropTypes.object,
    onChangeExportData: React.PropTypes.func,
    onChooseAllOfCollection: React.PropTypes.func,
    pcs: React.PropTypes.array,
    rcs: React.PropTypes.array,
    activePanel: React.PropTypes.number,
    exportData: React.PropTypes.object
  },

  getInitialState () {
    return {
      activePanel: null
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

  onChangeMyExportData (cName, fName, event) {
    const { onChangeExportData } = this.props
    onChangeExportData(cName, fName, event)
  },

  render () {
    const { taxonomyFields, pcFields, relationFields, onChangeExportData, onChooseAllOfCollection, pcs, rcs, exportData } = this.props
    const { activePanel } = this.state

    return (
      <Accordion activeKey={activePanel}>
        <Panel collapsible header='Art / Lebensraum' eventKey={1} onClick={this.onClickPanel.bind(this, 1)}>
          <div className='felderspalte' style={{marginBottom: -8}}>
            <Input type='checkbox' label='GUID' onChange={this.onChangeMyExportData.bind(this, 'object', '_id')} />
            <Input type='checkbox' label='Gruppe' onChange={this.onChangeMyExportData.bind(this, 'object', 'Gruppe')} />
          </div>
        </Panel>
        <Panel className='collectionPanel' collapsible header='Taxonomie' eventKey={2} onClick={this.onClickPanel.bind(this, 2)}>
          <ChooseFieldsTaxonomy
            exportData={exportData}
            taxonomyFields={taxonomyFields}
            onChangeExportData={onChangeExportData}
            onChooseAllOfCollection={onChooseAllOfCollection} />
        </Panel>
        <Panel className='collectionPanel' collapsible header='Eigenschaftensammlungen' eventKey={3} onClick={this.onClickPanel.bind(this, 3)}>
          <ChooseFieldsPCs
            exportData={exportData}
            pcFields={pcFields}
            pcs={pcs}
            onChangeExportData={onChangeExportData}
            onChooseAllOfCollection={onChooseAllOfCollection} />
        </Panel>
        <Panel className='collectionPanel' collapsible header='Beziehungssammlungen' eventKey={4} onClick={this.onClickPanel.bind(this, 4)}>
          <ChooseFieldsRCs
            exportData={exportData}
            relationFields={relationFields}
            rcs={rcs}
            onChangeExportData={onChangeExportData}
            onChooseAllOfCollection={onChooseAllOfCollection} />
        </Panel>
      </Accordion>
    )
  }
})
