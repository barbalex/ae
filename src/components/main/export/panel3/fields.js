'use strict'

import React from 'react'
import { Accordion, Panel, Input } from 'react-bootstrap'
import { get } from 'lodash'
import FieldsTaxonomy from './fieldsTaxonomy.js'
import FieldsPCs from './fieldsPCs.js'
import FieldsRCs from './fieldsRCs.js'

export default React.createClass({
  displayName: 'Fields',

  propTypes: {
    taxonomyFields: React.PropTypes.object,
    pcFields: React.PropTypes.object,
    relationFields: React.PropTypes.object,
    onChooseField: React.PropTypes.func,
    onChooseAllOfCollection: React.PropTypes.func,
    pcs: React.PropTypes.array,
    rcs: React.PropTypes.array,
    activePanel: React.PropTypes.number,
    exportOptions: React.PropTypes.object,
    collectionsWithAllChoosen: React.PropTypes.array,
    oneRowPerRelation: React.PropTypes.bool,
    onChangeOneRowPerRelation: React.PropTypes.func
  },

  getInitialState() {
    return {
      activePanel: ''
    }
  },

  onClickPanel(number, event) {
    const { activePanel } = this.state
    // prevent higher level panels from reacting
    event.stopPropagation()

    // make sure the heading was clicked
    const parent = event.target.parentElement
    const headingWasClicked = (
      parent.className.includes('panel-title') ||
      parent.className.includes('panel-heading')
    )
    if (headingWasClicked) {
      // always close panel if it is open
      if (activePanel === number) return this.setState({ activePanel: '' })
        // open the panel clicked
      this.setState({ activePanel: number })
    }
  },

  render() {
    const {
      taxonomyFields,
      pcFields,
      relationFields,
      onChooseField,
      onChooseAllOfCollection,
      pcs,
      rcs,
      exportOptions,
      collectionsWithAllChoosen,
      oneRowPerRelation,
      onChangeOneRowPerRelation
    } = this.props
    const { activePanel } = this.state
    const guidChecked = get(exportOptions, 'object._id.export')
    const taxonomyHeader = Object.keys(taxonomyFields).length > 1 ? 'Taxonomien' : 'Taxonomie'

    return (
      <Accordion activeKey={activePanel}>
        <Panel
          collapsible
          header="Art / Lebensraum"
          eventKey={1}
          onClick={this.onClickPanel.bind(this, 1)}
        >
          {
            activePanel === 1 &&
            <div
              className="felderspalte"
              style={{ marginBottom: -8 }}
            >
              <Input
                type="checkbox"
                label="GUID"
                onChange={(event) => onChooseField('object', '_id', 'cType', event)}
                checked={guidChecked}
              />
              <Input
                type="checkbox"
                label="Gruppe"
                onChange={(event) => onChooseField('object', 'Gruppe', 'cType', event)}
              />
            </div>
          }
        </Panel>
        <Panel
          className="collectionPanel"
          collapsible
          header={taxonomyHeader}
          eventKey={2}
          onClick={this.onClickPanel.bind(this, 2)}
        >
          {
            activePanel === 2 &&
            <FieldsTaxonomy
              exportOptions={exportOptions}
              taxonomyFields={taxonomyFields}
              collectionsWithAllChoosen={collectionsWithAllChoosen}
              onChooseField={onChooseField}
              onChooseAllOfCollection={onChooseAllOfCollection}
            />
          }
        </Panel>
        <Panel
          className="collectionPanel"
          collapsible
          header="Eigenschaftensammlungen"
          eventKey={3}
          onClick={this.onClickPanel.bind(this, 3)}
        >
          {
            activePanel === 3 &&
            <FieldsPCs
              exportOptions={exportOptions}
              pcFields={pcFields}
              pcs={pcs}
              collectionsWithAllChoosen={collectionsWithAllChoosen}
              onChooseField={onChooseField}
              onChooseAllOfCollection={onChooseAllOfCollection}
            />
          }
        </Panel>
        <Panel
          className="collectionPanel"
          collapsible
          header="Beziehungssammlungen"
          eventKey={4}
          onClick={this.onClickPanel.bind(this, 4)}
        >
          {
            activePanel === 4 &&
            <FieldsRCs
              exportOptions={exportOptions}
              relationFields={relationFields}
              rcs={rcs}
              collectionsWithAllChoosen={collectionsWithAllChoosen}
              oneRowPerRelation={oneRowPerRelation}
              onChooseField={onChooseField}
              onChooseAllOfCollection={onChooseAllOfCollection}
              onChangeOneRowPerRelation={onChangeOneRowPerRelation}
            />
          }
        </Panel>
      </Accordion>
    )
  }
})
