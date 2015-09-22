'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Input, Accordion, Panel } from 'react-bootstrap'
import _ from 'lodash'
import SelectComparisonOperator from './selectComparisonOperator.js'
import InfoButtonAfter from './infoButtonAfter.js'
import PcDescription from './pcDescription.js'

export default React.createClass({
  displayName: 'FilterFieldsRCs',

  propTypes: {
    relationFields: React.PropTypes.object,
    onChangeFilterField: React.PropTypes.func,
    onChangeCoSelect: React.PropTypes.func,
    rcs: React.PropTypes.array,
    offlineIndexes: React.PropTypes.bool,
    activePanel: React.PropTypes.number
  },

  getInitialState () {
    return {
      activePanel: null
    }
  },

  componentDidMount () {
    const { offlineIndexes } = this.props
    // make sure, rcs are queried
    app.Actions.queryRelationCollections(offlineIndexes)
  },

  onBlur (cName, fName, event) {
    const { onChangeFilterField } = this.props
    onChangeFilterField(cName, fName, event)
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
    const { relationFields, onChangeCoSelect, rcs } = this.props
    const { activePanel } = this.state

    const collections = Object.keys(relationFields).map((cNameKey, cIndex) => {
      const cNameObject = relationFields[cNameKey]
      const rc = _.find(rcs, (rc) => rc.name === cNameKey)
      const fields = Object.keys(cNameObject).map((fNameKey, fIndex) => {
        const fNameObject = cNameObject[fNameKey]
        const selectComparisonOperator = <SelectComparisonOperator cNameKey={cNameKey} fNameKey={fNameKey} onChangeCoSelect={onChangeCoSelect} />
        const buttonAfter = <InfoButtonAfter fNameObject={fNameObject} />
        return (
          <Input
            key={fIndex}
            type={fNameObject.fType}
            label={fNameKey}
            bsSize='small'
            className={'controls'}
            onBlur={this.onBlur.bind(this, cNameKey, fNameKey)}
            buttonBefore={selectComparisonOperator}
            buttonAfter={buttonAfter} />
        )
      })
      return (
        <Panel key={cIndex} collapsible header={rc.name} eventKey={cIndex} onClick={this.onClickPanel.bind(this, cIndex)}>
          <PcDescription pc={rc} />
          <div className='felderspalte'>
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
