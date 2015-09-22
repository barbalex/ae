'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Input, Panel } from 'react-bootstrap'
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
    offlineIndexes: React.PropTypes.bool
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

  render () {
    const { relationFields, onChangeCoSelect, rcs } = this.props

    const collections = Object.keys(relationFields).map((cNameKey, cIndex) => {
      const showLine = cIndex + 1 < Object.keys(relationFields).length
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
      const collection = (
        <div>
          <PcDescription pc={rc} />
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
