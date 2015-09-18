'use strict'

import React from 'react'
import { Input } from 'react-bootstrap'

export default React.createClass({
  displayName: 'SelectComparisonOperator',

  propTypes: {
    fNameKey: React.PropTypes.string,
    onChangeCoSelect: React.PropTypes.func
  },

  onChange (fName, event) {
    const { onChangeCoSelect } = this.props
    onChangeCoSelect(fName, event)
  },

  render () {
    const { fNameKey } = this.props
    const coSelectStyle = {
      width: 45,
      paddingLeft: 3,
      paddingRight: 0,
      borderTopLeftRadius: 3,
      borderBottomLeftRadius: 3
    }

    return (
      <Input bsSize='small' type='select' style={coSelectStyle} onChange={this.onChange.bind(this, fNameKey)}>
        <option value=''></option>
        <option value='='>&#61;</option>
        <option value='>'>&#62;</option>
        <option value='>='>&#61;&#62;</option>
        <option value='<'>&#60;</option>
        <option value='<='>&#60;&#61;</option>
      </Input>
    )
  }
})
