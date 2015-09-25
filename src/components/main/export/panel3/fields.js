'use strict'

import React from 'react'
import { Accordion, Panel, Input } from 'react-bootstrap'
import _ from 'lodash'
import FieldsTaxonomy from './fieldsTaxonomy.js'
import FieldsPCs from './fieldsPCs.js'
import FieldsRCs from './fieldsRCs.js'

export default React.createClass({
  displayName: 'Fields',

  propTypes: {
    taxonomyFields: React.PropTypes.object,
    pcFields: React.PropTypes.object,
    relationFields: React.PropTypes.object,
    onChangeExportData: React.PropTypes.func,
    onChooseAllOfCollection: React.PropTypes.func,
    pcs: React.PropTypes.array,
    rcs: React.PropTypes.array,
    activePanel: React.PropTypes.number,
    exportOptions: React.PropTypes.object
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

  onChangeMyExportData (cName, fName, event) {
    const { onChangeExportData } = this.props
    onChangeExportData(cName, fName, event)
  },

  render () {
    const { taxonomyFields, pcFields, relationFields, onChangeExportData, onChooseAllOfCollection, pcs, rcs, exportOptions } = this.props
    const { activePanel } = this.state
    const guidChecked = _.get(exportOptions, 'object._id.export')

    return (
      <Accordion activeKey={activePanel}>
        <Panel collapsible header='Art / Lebensraum' eventKey={1} onClick={this.onClickPanel.bind(this, 1)}>
          {activePanel === 1 ?
            <div className='felderspalte' style={{marginBottom: -8}}>
              <Input type='checkbox' label='GUID' onChange={this.onChangeMyExportData.bind(this, 'object', '_id')} checked={guidChecked} />
              <Input type='checkbox' label='Gruppe' onChange={this.onChangeMyExportData.bind(this, 'object', 'Gruppe')} />
            </div>
            : null
          }
        </Panel>
        <Panel className='collectionPanel' collapsible header='Taxonomie' eventKey={2} onClick={this.onClickPanel.bind(this, 2)}>
          {activePanel === 2 ?
            <FieldsTaxonomy
              exportOptions={exportOptions}
              taxonomyFields={taxonomyFields}
              onChangeExportData={onChangeExportData}
              onChooseAllOfCollection={onChooseAllOfCollection} />
            : null
          }
        </Panel>
        <Panel className='collectionPanel' collapsible header='Eigenschaftensammlungen' eventKey={3} onClick={this.onClickPanel.bind(this, 3)}>
          {activePanel === 3 ?
            <FieldsPCs
              exportOptions={exportOptions}
              pcFields={pcFields}
              pcs={pcs}
              onChangeExportData={onChangeExportData}
              onChooseAllOfCollection={onChooseAllOfCollection} />
            : null
          }
        </Panel>
        <Panel className='collectionPanel' collapsible header='Beziehungssammlungen' eventKey={4} onClick={this.onClickPanel.bind(this, 4)}>
          {activePanel === 4 ?
            <FieldsRCs
              exportOptions={exportOptions}
              relationFields={relationFields}
              rcs={rcs}
              onChangeExportData={onChangeExportData}
              onChooseAllOfCollection={onChooseAllOfCollection} />
            : null
          }
        </Panel>
      </Accordion>
    )
  }
})
