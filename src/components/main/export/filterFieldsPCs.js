'use strict'

import React from 'react'
import { Input } from 'react-bootstrap'
import SelectComparisonOperator from './selectComparisonOperator.js'

export default React.createClass({
  displayName: 'FilterFieldsPcs',

  propTypes: {
    pcFields: React.PropTypes.object,
    onChangeFilterField: React.PropTypes.func,
    onChangeCoSelect: React.PropTypes.func
  },

  onChange (cName, fName, event) {
    const { onChangeFilterField } = this.props
    onChangeFilterField(cName, fName, event)
  },

  render () {
    const { pcFields, onChangeCoSelect } = this.props

    const collections = Object.keys(pcFields).map((cNameKey, cIndex) => {
      const showLine = cIndex < Object.keys(pcFields).length
      const cNameObject = pcFields[cNameKey]
      let collection = []
      const title = <h5>{cNameKey}</h5>
      collection.push(title)
      const fields = Object.keys(cNameObject).map((fNameKey, fIndex) => {
        const fNameKeyObject = cNameObject[fNameKey]
        const selectComparisonOperator = <SelectComparisonOperator cNameKey={cNameKey} fNameKey={fNameKey} onChangeCoSelect={onChangeCoSelect} />
        return (
          <Input
            key={fIndex}
            type={fNameKeyObject.fType}
            label={fNameKey}
            bsSize='small'
            className={'controls'}
            onChange={this.onChange.bind(this, cNameKey, fNameKey)}
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
        <h3>Eigenschaftensammlungen</h3>
        {collections}
      </div>
    )
  }
})
