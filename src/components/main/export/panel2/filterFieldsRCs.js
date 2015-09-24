'use strict'

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

    const collectionKeysSorted = _.sortBy(Object.keys(relationFields), (cNameKey) => cNameKey.toLowerCase())
    const collections = collectionKeysSorted.map((cNameKey, cIndex) => {
      const collectionKey = cNameKey.toLowerCase()
      const cNameObject = relationFields[cNameKey]
      const rc = _.find(rcs, (rc) => rc.name === cNameKey)
      const fieldsSorted = _.sortBy(Object.keys(cNameObject), (fNameKey) => fNameKey.toLowerCase())
      const fields = fieldsSorted.map((fNameKey) => {
        const fieldKey = fNameKey.toLowerCase()
        const fNameObject = cNameObject[fNameKey]
        const selectComparisonOperator = <SelectComparisonOperator cNameKey={cNameKey} fNameKey={fNameKey} onChangeCoSelect={onChangeCoSelect} />
        const buttonAfter = <InfoButtonAfter fNameObject={fNameObject} />
        if (fNameObject.fType !== 'boolean') {
          return (
            <Input
              key={fieldKey}
              type={fNameObject.fType}
              label={fNameKey}
              bsSize='small'
              className={'controls'}
              onBlur={this.onBlur.bind(this, cNameKey, fNameKey)}
              buttonBefore={selectComparisonOperator}
              buttonAfter={buttonAfter} />
          )
        }
        return (
          <Input
            key={fieldKey}
            type='select'
            label={fNameKey}
            bsSize='small'
            className={'controls'}
            onBlur={this.onBlur.bind(this, cNameKey, fNameKey)}
            buttonAfter={buttonAfter} >
            <option value=''></option>
            <option value='true'>ja</option>
            <option value='false'>nein</option>
          </Input>
        )
      })
      return (
        <Panel key={collectionKey} collapsible header={rc.name} eventKey={cIndex} onClick={this.onClickPanel.bind(this, cIndex)}>
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
