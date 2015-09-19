'use strict'

import React from 'react'
import { Input } from 'react-bootstrap'
import SelectComparisonOperator from './selectComparisonOperator.js'
import InfoButtonAfter from './infoButtonAfter.js'

export default React.createClass({
  displayName: 'FilterFieldsTaxonomy',

  propTypes: {
    taxonomyFields: React.PropTypes.object,
    onChangeFilterField: React.PropTypes.func,
    onChangeCoSelect: React.PropTypes.func
  },

  onBlur (cName, fName, event) {
    const { onChangeFilterField } = this.props
    onChangeFilterField(cName, fName, event)
  },

  render () {
    const { taxonomyFields, onChangeCoSelect } = this.props

    const collections = Object.keys(taxonomyFields).map((cNameKey, cIndex) => {
      const showLine = cIndex < Object.keys(taxonomyFields).length
      const cNameObject = taxonomyFields[cNameKey]
      let collection = []
      const title = <h5>{cNameKey}</h5>
      collection.push(title)
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
        <h3>Taxonomie</h3>
        {collections}
      </div>
    )
  }
})
