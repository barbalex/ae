'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Input, Accordion, Panel } from 'react-bootstrap'
import _ from 'lodash'
import SelectComparisonOperator from './selectComparisonOperator.js'
import InfoButtonAfter from './infoButtonAfter.js'
import PcDescription from './pcDescription.js'

export default React.createClass({
  displayName: 'FilterFieldsPcs',

  propTypes: {
    pcFields: React.PropTypes.object,
    onChangeFilterField: React.PropTypes.func,
    onChangeCoSelect: React.PropTypes.func,
    pcs: React.PropTypes.array,
    offlineIndexes: React.PropTypes.bool
  },

  getInitialState () {
    return {
      activePanel: null
    }
  },

  componentDidMount () {
    const { offlineIndexes } = this.props
    // make sure, pcs are queried
    app.Actions.queryPropertyCollections(offlineIndexes)
  },

  onBlur (cName, fName, event) {
    const { onChangeFilterField } = this.props
    onChangeFilterField(cName, fName, event)
  },

  render () {
    const { pcFields, onChangeCoSelect, pcs } = this.props
    const collections = Object.keys(pcFields).map((cNameKey, cIndex) => {
      const showLine = cIndex < Object.keys(pcFields).length
      const cNameObject = pcFields[cNameKey]
      const pc = _.find(pcs, (pc) => pc.name === cNameKey)
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
      const collection = (
        <div>
          <PcDescription pc={pc} />
          <div className='felderspalte'>
            {fields}
          </div>
        </div>
      )
      return (
        <div key={cIndex}>
          {collection}
          {showLine ? <hr /> : null}
        </div>
      )
    })

    return (
      <div>
        {collections}
      </div>
    )
  }
})
