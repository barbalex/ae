'use strict'

import React from 'react'
import { Accordion, Panel } from 'react-bootstrap'
import _ from 'lodash'
import FieldsRCsPanel from './fieldsRCsPanel.js'

export default React.createClass({
  displayName: 'FieldsRCs',

  propTypes: {
    relationFields: React.PropTypes.object,
    onChangeFilterField: React.PropTypes.func,
    onChangeCoSelect: React.PropTypes.func,
    rcs: React.PropTypes.array,
    exportOptions: React.PropTypes.object,
    activePanel: React.PropTypes.number
  },

  getInitialState () {
    return {
      activePanel: ''
    }
  },

  componentWillUpdate () {
    const { relationFields } = this.props
    const { activePanel } = this.state
    // open collection panel if there is only one
    const numberOfCollections = Object.keys(relationFields).length
    if (numberOfCollections === 1 && activePanel !== 0) this.setState({ activePanel: 0 })
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
    const { relationFields, onChangeCoSelect, rcs, exportOptions, onChangeFilterField } = this.props
    const { activePanel } = this.state
    // open panel if there is only one
    const numberOfCollections = Object.keys(relationFields).length
    const activePanelOpeningWhenOnlyOneCollection = numberOfCollections === 1 ? 0 : activePanel

    const collectionKeysSorted = _.sortBy(Object.keys(relationFields), (cNameKey) => cNameKey.toLowerCase())
    const collections = collectionKeysSorted.map((cNameKey, cIndex) => {
      const collectionKey = cNameKey.toLowerCase()
      const openPanel = activePanelOpeningWhenOnlyOneCollection === cIndex
      const rc = rcs.find((rc) => rc.name === cNameKey)
      return (
        <Panel key={collectionKey} collapsible header={rc.name} eventKey={cIndex} onClick={this.onClickPanel.bind(this, cIndex)}>
          {openPanel ?
            <FieldsRCsPanel
              cNameKey={cNameKey}
              relationFields={relationFields}
              onChangeFilterField={onChangeFilterField}
              onChangeCoSelect={onChangeCoSelect}
              rcs={rcs}
              exportOptions={exportOptions} />
            : null
          }
        </Panel>
      )
    })

    return (
      <Accordion activeKey={activePanelOpeningWhenOnlyOneCollection}>
        {collections}
      </Accordion>
    )
  }
})
