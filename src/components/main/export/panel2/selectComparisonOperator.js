'use strict'

import React from 'react'
import { Input } from 'react-bootstrap'

export default React.createClass({
  displayName: 'SelectComparisonOperator',

  propTypes: {
    cNameKey: React.PropTypes.string,
    fNameKey: React.PropTypes.string,
    onChangeCoSelect: React.PropTypes.func,
    value: React.PropTypes.string
  },

  onChange (cName, fName, event) {
    const { onChangeCoSelect } = this.props
    onChangeCoSelect(cName, fName, event)
  },

  render () {
    const { cNameKey, fNameKey, value } = this.props
    const coSelectStyle = {
      width: 45,
      paddingLeft: 3,
      paddingRight: 0,
      borderTopLeftRadius: 3,
      borderBottomLeftRadius: 3
    }

    return (
      <Input
        bsSize='small'
        type='select'
        style={coSelectStyle}
        value={value}
        onChange={this.onChange.bind(this, cNameKey, fNameKey)}>
        <option value={null}></option>
        <option value='='>&#61;</option>
        <option value='>'>&#62;</option>
        <option value='>='>&#62;&#61;</option>
        <option value='<'>&#60;</option>
        <option value='<='>&#60;&#61;</option>
      </Input>
    )
  }
})
