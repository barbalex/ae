'use strict'

import React from 'react'
import { Accordion, Panel } from 'react-bootstrap'
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

  getInitialState() {
    return {
      activePanel: ''
    }
  },

  componentWillUpdate() {
    const { relationFields } = this.props
    const { activePanel } = this.state
    // open collection panel if there is only one
    const numberOfCollections = Object.keys(relationFields).length
    if (numberOfCollections === 1 && activePanel !== 0) {
      this.setState({ activePanel: 0 })
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
      if (activePanel === number) {
        return this.setState({ activePanel: '' })
      }
        // open the panel clicked
      this.setState({ activePanel: number })
    }
  },

  render() {
    const {
      relationFields,
      onChangeCoSelect,
      rcs,
      exportOptions,
      onChangeFilterField
    } = this.props
    const { activePanel } = this.state
    // open panel if there is only one
    const numberOfCollections = Object.keys(relationFields).length
    const activePanelOpeningWhenOnlyOneCollection = (
      numberOfCollections === 1 ?
      0 :
      activePanel
    )

    const collectionKeysSorted = (
      Object.keys(relationFields)
        .sort((cNameKey) => cNameKey.toLowerCase())
    )
    const collections = collectionKeysSorted.map((cNameKey, cIndex) => {
      const collectionKey = cNameKey.toLowerCase()
      const openPanel = activePanelOpeningWhenOnlyOneCollection === cIndex
      const rc = rcs.find((c) => c.name === cNameKey)
      return (
        <Panel
          key={collectionKey}
          collapsible
          header={rc.name}
          eventKey={cIndex}
          onClick={(event) =>
            this.onClickPanel(cIndex, event)
          }
        >
          {
            openPanel &&
            <FieldsRCsPanel
              cNameKey={cNameKey}
              relationFields={relationFields}
              onChangeFilterField={onChangeFilterField}
              onChangeCoSelect={onChangeCoSelect}
              rcs={rcs}
              exportOptions={exportOptions}
            />
          }
        </Panel>
      )
    })

    return (
      <Accordion
        activeKey={activePanelOpeningWhenOnlyOneCollection}
      >
        {collections}
      </Accordion>
    )
  }
})
