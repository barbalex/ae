'use strict'

import React from 'react'
import { Accordion, Panel } from 'react-bootstrap'
import _ from 'lodash'
import FieldsPCsPanel from './fieldsPCsPanel.js'

export default React.createClass({
  displayName: 'FieldsPCs',

  propTypes: {
    pcFields: React.PropTypes.object,
    onChangeExportData: React.PropTypes.func,
    onChooseAllOfCollection: React.PropTypes.func,
    pcs: React.PropTypes.array,
    activePanel: React.PropTypes.number,
    exportData: React.PropTypes.object,
    collectionsWithAllChoosen: React.PropTypes.array
  },

  getInitialState () {
    return {
      activePanel: '',
      /**
       * need to be state because field allChoosen needs to be unchecked
       * when a single field in the collection is unchecked
       */
      collectionsWithAllChoosen: []
    }
  },

  componentWillUpdate () {
    const { pcFields } = this.props
    const { activePanel } = this.state
    // open collection panel if there is only one
    const numberOfCollections = Object.keys(pcFields).length
    if (numberOfCollections === 1 && activePanel !== 0) this.setState({ activePanel: 0 })
  },

  onChangeField (cName, fName, event) {
    const { onChangeExportData } = this.props
    let { collectionsWithAllChoosen } = this.state
    onChangeExportData(cName, fName, event)
    if (event.target.checked === false && _.includes(collectionsWithAllChoosen, cName)) {
      collectionsWithAllChoosen = _.without(collectionsWithAllChoosen, cName)
      this.setState({ collectionsWithAllChoosen })
    }
  },

  onChangeAllFields (cName, event) {
    const { onChooseAllOfCollection } = this.props
    let { collectionsWithAllChoosen } = this.state
    onChooseAllOfCollection('pc', cName, event)
    if (event.target.checked === false) {
      collectionsWithAllChoosen = _.without(collectionsWithAllChoosen, cName)
      this.setState({ collectionsWithAllChoosen })
    } else {
      collectionsWithAllChoosen = _.union(collectionsWithAllChoosen, [cName])
      this.setState({ collectionsWithAllChoosen })
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
    const { pcFields, pcs, exportData } = this.props
    const { activePanel, collectionsWithAllChoosen } = this.state

    const collectionKeysSorted = _.sortBy(Object.keys(pcFields), (cNameKey) => cNameKey.toLowerCase())
    const collections = collectionKeysSorted.map((cNameKey, cIndex) => {
      const collectionKey = cNameKey.toLowerCase()
      const pc = _.find(pcs, (pc) => pc.name === cNameKey)
      return (
        <Panel key={collectionKey} collapsible header={pc.name} eventKey={cIndex} onClick={this.onClickPanel.bind(this, cIndex)}>
          <FieldsPCsPanel
            cNameKey={cNameKey}
            pcFields={pcFields}
            exportData={exportData}
            collectionsWithAllChoosen={collectionsWithAllChoosen}
            onChangeField={this.onChangeField}
            onChangeAllFields={this.onChangeAllFields} />
        </Panel>
      )
    })

    return (
      <Accordion activeKey={activePanel}>
        {collections}
      </Accordion>
    )
  }
})
