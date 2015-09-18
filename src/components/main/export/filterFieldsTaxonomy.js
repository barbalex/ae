'use strict'

import React from 'react'
import { Input } from 'react-bootstrap'

export default React.createClass({
  displayName: 'FilterFieldsTaxonomy',

  propTypes: {
    taxonomyFields: React.PropTypes.object,
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
    const { taxonomyFields } = this.props
    const coSelectStyle = {
      position: 'relative',
      width: 45,
      paddingLeft: 3,
      paddingRight: 0,
      borderTopLeftRadius: 3,
      borderBottomLeftRadius: 3
    }

    const collections = Object.keys(taxonomyFields).map((cNameKey, cIndex) => {
      const showLine = cIndex < Object.keys(taxonomyFields).length
      const cNameObject = taxonomyFields[cNameKey]
      let collection = []
      const title = <h5>{cNameKey}</h5>
      collection.push(title)
      const fields = Object.keys(cNameObject).map((fNameKey, fIndex) => {
        const fNameKeyObject = cNameObject[fNameKey]
        const coSelect = (
          <Input bsSize='small' type='select' style={coSelectStyle} onChange={this.onChangeCoSelect.bind(this, fNameKey)}>
            <option value=''></option>
            <option value='='>&#61;</option>
            <option value='>'>&#62;</option>
            <option value='>='>&#61;&#62;</option>
            <option value='<'>&#60;</option>
            <option value='<='>&#60;&#61;</option>
          </Input>
        )
        return (
          <Input
            key={fIndex}
            type={fNameKeyObject.fType}
            label={fNameKey}
            bsSize='small'
            className={'controls'}
            onChange={this.onChange.bind(this, fNameKey)}
            buttonBefore={coSelect} />
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
