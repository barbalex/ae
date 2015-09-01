'use strict'

import React from 'react'
import _ from 'lodash'
import { Input } from 'react-bootstrap'

export default React.createClass({
  displayName: 'InputImportFields',

  propTypes: {
    importIdField: React.PropTypes.string,
    pcsToImport: React.PropTypes.array,
    onChangeImportId: React.PropTypes.func
  },

  onChange (event) {
    const importIdField = event.target.value
    this.props.onChangeImportId(importIdField)
  },

  render () {
    const { pcsToImport, importIdField } = this.props

     // get a list of all keys
    let keys = []
    pcsToImport.forEach(function (pc) {
      keys = _.union(keys, _.keys(pc))
    })

    const style = { height: ((keys.length * 19) + 9) + 'px' }
    const options = keys.map(function (key, index) {
      return (<option key={index} value={key}>{key}</option>)
    })

    return (
      <Input type='select' label={'Feld mit eindeutiger ID in den Importdaten'} multiple className='form-control controls' style={style} bsSize='small' value={[importIdField]} onChange={this.onChange}>
        {options}
      </Input>
    )
  }
})
