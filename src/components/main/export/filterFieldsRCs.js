'use strict'

import React from 'react'
import { Input } from 'react-bootstrap'
import SelectComparisonOperator from './selectComparisonOperator.js'

export default React.createClass({
  displayName: 'FilterFieldsRCs',

  propTypes: {
    relationFields: React.PropTypes.object,
    onChangeFilterField: React.PropTypes.func
  },

  onChangeCoSelect (fName, event) {
    console.log('coSelect for ' + fName + ':', event.target.value)
  },

  onChange (fName, event) {
    const { onChangeFilterField } = this.props
    onChangeFilterField(fName, event)
  },

  render () {
    const { relationFields } = this.props

    const collections = Object.keys(relationFields).map((cNameKey, cIndex) => {
      const showLine = cIndex + 1 < Object.keys(relationFields).length
      const cNameObject = relationFields[cNameKey]
      let collection = []
      const title = <h5>{cNameKey}</h5>
      collection.push(title)
      const fields = Object.keys(cNameObject).map((fNameKey, fIndex) => {
        const fNameKeyObject = cNameObject[fNameKey]
        const selectComparisonOperator = <SelectComparisonOperator fNameKey={fNameKey} onChangeCoSelect={this.onChangeCoSelect} />
        return (
          <Input
            key={fIndex}
            type={fNameKeyObject.fType}
            label={fNameKey}
            bsSize='small'
            className={'controls'}
            onChange={this.onChange.bind(this, fNameKey)}
            buttonBefore={selectComparisonOperator} />
        )
      })
      collection.push(
        <div className='felderspalte'>
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
