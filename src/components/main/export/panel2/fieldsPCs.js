'use strict'

import React from 'react'
import { Accordion, Panel } from 'react-bootstrap'
import FieldsPCsPanel from './fieldsPCsPanel.js'

export default React.createClass({
  displayName: 'FieldsPCs',

  propTypes: {
    pcFields: React.PropTypes.object,
    onChangeFilterField: React.PropTypes.func,
    onChangeCoSelect: React.PropTypes.func,
    pcs: React.PropTypes.array,
    exportOptions: React.PropTypes.object,
    activePanel: React.PropTypes.number
  },

  getInitialState () {
    return {
      activePanel: ''
    }
  },

  componentWillUpdate () {
    const { pcFields } = this.props
    const { activePanel } = this.state
    // open collection panel if there is only one
    const numberOfCollections = Object.keys(pcFields).length
    if (numberOfCollections === 1 && activePanel !== 0) this.setState({ activePanel: 0 })
  },

  onClickPanel (number, event) {
    let { activePanel } = this.state
    // prevent higher level panels from reacting
    event.stopPropagation()

    // make sure the heading was clicked
    const parent = event.target.parentElement
    const headingWasClicked = parent.className.includes('panel-title') || parent.className.includes('panel-heading')
    if (headingWasClicked) {
      // always close panel if it is open
      if (activePanel === number) return this.setState({ activePanel: '' })
        // open the panel clicked
      this.setState({ activePanel: number })
    }
  },

  render () {
    const { pcFields, onChangeCoSelect, pcs, exportOptions, onChangeFilterField } = this.props
    const { activePanel } = this.state
    // open panel if there is only one
    const numberOfCollections = Object.keys(pcFields).length
    const activePanelOpeningWhenOnlyOneCollection = numberOfCollections === 1 ? 0 : activePanel

    const collectionKeysSorted = Object.keys(pcFields).sort((cNameKey) => cNameKey.toLowerCase())
    const collections = collectionKeysSorted.map((cNameKey, cIndex) => {
      const collectionKey = cNameKey.toLowerCase()
      const openPanel = activePanelOpeningWhenOnlyOneCollection === cIndex
      const pc = pcs.find((pc) => pc.name === cNameKey)
      return (
        <Panel
          key={collectionKey}
          collapsible
          header={pc.name}
          eventKey={cIndex}
          onClick={this.onClickPanel.bind(this, cIndex)}>
          {
            openPanel
            ? <FieldsPCsPanel
                cNameKey={cNameKey}
                pcs={pcs}
                exportOptions={exportOptions}
                pcFields={pcFields}
                onChangeFilterField={onChangeFilterField}
                onChangeCoSelect={onChangeCoSelect} />
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
