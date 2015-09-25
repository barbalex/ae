'use strict'

import React from 'react'
import { Accordion, Panel } from 'react-bootstrap'
import _ from 'lodash'
import FieldsRCsPanel from './fieldsRCsPanel.js'

export default React.createClass({
  displayName: 'FieldsRCs',

  propTypes: {
    relationFields: React.PropTypes.object,
    onChooseField: React.PropTypes.func,
    onChooseAllOfCollection: React.PropTypes.func,
    rcs: React.PropTypes.array,
    activePanel: React.PropTypes.number,
    exportOptions: React.PropTypes.object,
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
    const { relationFields } = this.props
    const { activePanel } = this.state
    // open collection panel if there is only one
    const numberOfCollections = Object.keys(relationFields).length
    if (numberOfCollections === 1 && activePanel !== 0) this.setState({ activePanel: 0 })
  },

  onChangeField (cName, fName, event) {
    const { onChooseField } = this.props
    let { collectionsWithAllChoosen } = this.state
    onChooseField(cName, fName, event)
    if (event.target.checked === false && _.includes(collectionsWithAllChoosen, cName)) {
      collectionsWithAllChoosen = _.without(collectionsWithAllChoosen, cName)
      this.setState({ collectionsWithAllChoosen })
    }
  },

  onChangeAllFields (cName, event) {
    const { onChooseAllOfCollection } = this.props
    let { collectionsWithAllChoosen } = this.state
    onChooseAllOfCollection('rc', cName, event)
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
    console.log('rendering ChooseFieldsRCs')
    const { relationFields, rcs, exportOptions } = this.props
    const { activePanel, collectionsWithAllChoosen } = this.state

    const collectionKeysSorted = _.sortBy(Object.keys(relationFields), (cNameKey) => cNameKey.toLowerCase())
    const collections = collectionKeysSorted.map((cNameKey, cIndex) => {
      const collectionKey = cNameKey.toLowerCase()
      const rc = _.find(rcs, (rc) => rc.name === cNameKey)
      return (
        <Panel key={collectionKey} collapsible header={rc.name} eventKey={cIndex} onClick={this.onClickPanel.bind(this, cIndex)}>
          {activePanel === cIndex ?
            <FieldsRCsPanel
              cNameKey={cNameKey}
              relationFields={relationFields}
              exportOptions={exportOptions}
              collectionsWithAllChoosen={collectionsWithAllChoosen}
              onChangeField={this.onChangeField}
              onChangeAllFields={this.onChangeAllFields} />
            : null
          }
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
