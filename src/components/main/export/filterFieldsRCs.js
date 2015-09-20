'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Input } from 'react-bootstrap'
import _ from 'lodash'
import SelectComparisonOperator from './selectComparisonOperator.js'
import InfoButtonAfter from './infoButtonAfter.js'
import PcDescription from '../pcDescription.js'

export default React.createClass({
  displayName: 'FilterFieldsRCs',

  propTypes: {
    relationFields: React.PropTypes.object,
    onChangeFilterField: React.PropTypes.func,
    onChangeCoSelect: React.PropTypes.func,
    rcs: React.PropTypes.array
  },

  componentDidMount () {
    // make sure, rcs are queried
    app.Actions.queryRelationCollections()
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
        <div className='felderspalte'>
        <h5>{cNameKey}</h5>
          <PcDescription pc={rc} />
          {fields}
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
        <h3>Beziehungssammlungen</h3>
        {collections}
      </div>
    )
  }
})
