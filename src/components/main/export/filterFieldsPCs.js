'use strict'

import React from 'react'
import { Input } from 'react-bootstrap'

export default React.createClass({
  displayName: 'FilterFieldsPcs',

  propTypes: {
    pcFields: React.PropTypes.object,
    onChangeFilterField: React.PropTypes.func
  },

  onChange (fName, event) {
    const { onChangeFilterField } = this.props
    onChangeFilterField(fName, event)
  },

  render () {
    const { pcFields } = this.props

    const collections = Object.keys(pcFields).map((cNameKey, cIndex) => {
      const showLine = cIndex < Object.keys(pcFields).length
      const cNameObject = pcFields[cNameKey]
      let collection = []
      const title = <h5>{cNameKey}</h5>
      collection.push(title)
      const fields = Object.keys(cNameObject).map((fNameKey, fIndex) => {
        const fNameKeyObject = cNameObject[fNameKey]
        return (
          <Input
            key={fIndex}
            type={fNameKeyObject.fType}
            label={fNameKey}
            bsSize='small'
            className={'controls'}
            onChange={this.onChange.bind(this, fNameKey)} />
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
