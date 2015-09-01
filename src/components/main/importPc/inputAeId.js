'use strict'

import React from 'react'
import { Input } from 'react-bootstrap'

export default React.createClass({
  displayName: 'InputAeId',

  propTypes: {
    aeIdField: React.PropTypes.string,
    onChangeAeId: React.PropTypes.func
  },

  onChange (event) {
    const aeIdField = event.target.value
    this.props.onChangeAeId(aeIdField)
  },

  render () {
    const { aeIdField } = this.props

    return (
      <Input type='select' bsSize='small' label={'zugehörige ID in ArtenDb'} multiple className='form-control controls' style={{'height': 101 + 'px'}} value={[aeIdField]} onChange={this.onChange}>
        <option value='GUID'>GUID der ArtenDb</option>
        <option value='Fauna'>ID der Info Fauna (NUESP)</option>
        <option value='Flora'>ID der Info Flora (SISF-NR)</option>
        <option value='Moose'>ID des Datenzentrums Moose Schweiz (TAXONNO)</option>
        <option value='Macromycetes'>ID von Swissfungi (TaxonId)</option>
      </Input>
    )
  }
})
