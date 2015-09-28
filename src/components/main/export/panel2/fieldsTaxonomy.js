'use strict'

import React from 'react'
import { Accordion, Panel } from 'react-bootstrap'
import _ from 'lodash'
import FieldsTaxonomyPanel from './fieldsTaxonomyPanel.js'

export default React.createClass({
  displayName: 'FieldsTaxonomy',

  propTypes: {
    taxonomyFields: React.PropTypes.object,
    exportOptions: React.PropTypes.object,
    onChangeFilterField: React.PropTypes.func,
    onChangeCoSelect: React.PropTypes.func,
    activePanel: React.PropTypes.number
  },

  getInitialState () {
    return {
      // don't set this to null - chrome will crash!!??
      activePanel: ''
    }
  },

  /*componentWillUpdate () {
    const { taxonomyFields } = this.props
    const { activePanel } = this.state
    // open collection panel if there is only one
    console.log('taxonomyFields', taxonomyFields)
    const numberOfCollections = Object.keys(taxonomyFields).length
    if (numberOfCollections === 1 && activePanel !== 0) this.setState({ activePanel: 0 })
  },*/

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
    const { taxonomyFields, exportOptions, onChangeCoSelect, onChangeFilterField } = this.props
    const { activePanel } = this.state
    // open panel if there is only one
    const numberOfCollections = Object.keys(taxonomyFields).length
    const activePanelOpeningWhenOnlyOneCollection = numberOfCollections === 1 ? 0 : activePanel

    const collectionKeysSorted = _.sortBy(Object.keys(taxonomyFields), (cNameKey) => cNameKey.toLowerCase())
    const collections = collectionKeysSorted.map((cNameKey, cIndex) => {
      const collectionKey = cNameKey.toLowerCase()
      const openPanel = activePanelOpeningWhenOnlyOneCollection === cIndex
      return (
        <Panel key={collectionKey} collapsible header={cNameKey} eventKey={cIndex} onClick={this.onClickPanel.bind(this, cIndex)}>
          {openPanel ?
            <FieldsTaxonomyPanel
              cNameKey={cNameKey}
              taxonomyFields={taxonomyFields}
              exportOptions={exportOptions}
              onChangeCoSelect={onChangeCoSelect}
              onChangeFilterField={onChangeFilterField} />
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
