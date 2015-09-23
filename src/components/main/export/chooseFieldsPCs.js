'use strict'

import React from 'react'
import { Input, Accordion, Panel } from 'react-bootstrap'
import _ from 'lodash'

export default React.createClass({
  displayName: 'ChooseFieldsPcs',

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

  onChange (cName, fName, event) {
    const { onChangeExportData } = this.props
    let { collectionsWithAllChoosen } = this.state
    onChangeExportData(cName, fName, event)
    if (event.target.checked === false && _.includes(collectionsWithAllChoosen, cName)) {
      collectionsWithAllChoosen = _.without(collectionsWithAllChoosen, cName)
      this.setState({ collectionsWithAllChoosen })
    }
  },

  onChangeAlle (cName, event) {
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

    const collections = Object.keys(pcFields).map((cNameKey, cIndex) => {
      const cNameObject = pcFields[cNameKey]
      const pc = _.find(pcs, (pc) => pc.name === cNameKey)
      const fields = Object.keys(cNameObject).map((fNameKey, fIndex) => {
        let checked = false
        const path = `${cNameKey}.${fNameKey}.export`
        if (_.has(exportData, path)) checked = _.get(exportData, path)
        return (
          <Input
            key={fIndex}
            type='checkbox'
            label={fNameKey}
            checked={checked}
            onChange={this.onChange.bind(this, cNameKey, fNameKey)} />
        )
      })
      let alleField = null
      if (fields.length > 1) {
        const checked = _.includes(collectionsWithAllChoosen, cNameKey)
        alleField = (
          <div className='felderspalte alleWaehlenCheckbox' style={{marginBottom: 5}}>
            <Input
              type='checkbox'
              label='alle'
              checked={checked}
              onChange={this.onChangeAlle.bind(this, cNameKey)} />
          </div>
        )
      }
      return (
        <Panel key={cIndex} collapsible header={pc.name} eventKey={cIndex} onClick={this.onClickPanel.bind(this, cIndex)}>
          {alleField}
          <div className='felderspalte' style={{marginBottom: -8}}>
            {fields}
          </div>
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
