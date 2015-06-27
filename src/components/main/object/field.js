/*
 * receives a field name and it's value
 * decides what type of field to generate
 */

'use strict'

import React from 'react'
import { State } from 'react-router'
import FieldLink from './fieldLink.js'
import FieldInput from './fieldInput.js'
import FieldBoolean from './fieldBoolean.js'
import FieldTextarea from './fieldTextarea.js'

export default React.createClass({
  displayName: 'Field',

  mixins: [State],

  propTypes: {
    fieldName: React.PropTypes.string,
    fieldValue: React.PropTypes.string,
    pcType: React.PropTypes.string,
    pcName: React.PropTypes.string
  },

  getInitialState () {
    return {
      fieldName: this.props.fieldName,
      fieldValue: this.props.fieldValue,
      pcType: this.props.pcType,
      pcName: this.props.pcName
    }
  },

  render () {
    const fieldName = this.state.fieldName
    const fieldValue = this.state.fieldValue
    const pcType = this.state.pcType
    const pcName = this.state.pcName

    if ((typeof fieldValue === 'string' && fieldValue.slice(0, 7) === 'http://') || (typeof fieldValue === 'string' && fieldValue.slice(0, 8) === 'https://') || (typeof fieldValue === 'string' && fieldValue.slice(0, 2) === '//')) {
      // www-Links als Link darstellen
      return <FieldLink fieldName={fieldName} fieldValue={fieldValue} pcType={pcType} pcName={pcName} />
    }
    if (typeof fieldValue === 'string' && fieldValue.length < 45) {
      return <FieldInput fieldName={fieldName} fieldValue={fieldValue} inputType={'text'} pcType={pcType} pcName={pcName} />
    }
    if (typeof fieldValue === 'string' && fieldValue.length >= 45) {
      return <FieldTextarea fieldName={fieldName} fieldValue={fieldValue} pcType={pcType} pcName={pcName} />
    }
    if (typeof fieldValue === 'number') {
      return <FieldInput fieldName={fieldName} fieldValue={fieldValue} inputType={'number'} pcType={pcType} pcName={pcName} />
    }
    if (typeof fieldValue === 'boolean') {
      return <FieldBoolean fieldName={fieldName} fieldValue={fieldValue} pcType={pcType} pcName={pcName} />
    }
    // fallback ist text input
    return <FieldInput fieldName={fieldName} fieldValue={fieldValue} inputType={'text'} pcType={pcType} pcName={pcName} />
  }
})
