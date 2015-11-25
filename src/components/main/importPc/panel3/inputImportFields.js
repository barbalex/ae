'use strict'

import React from 'react'
import _ from 'lodash'
import { Input } from 'react-bootstrap'

export default React.createClass({
  displayName: 'InputImportFields',

  propTypes: {
    idsImportIdField: React.PropTypes.string,
    pcsToImport: React.PropTypes.array,
    onChangeImportId: React.PropTypes.func
  },

  onChange (event) {
    const idsImportIdField = event.target.value
    this.props.onChangeImportId(idsImportIdField)
  },

  render () {
    const { pcsToImport, idsImportIdField } = this.props

     // get a list of all keys
    let keys = []
    pcsToImport.forEach((pc) => {
      keys = _.union(keys, Object.keys(pc))
    })

    const style = { height: ((keys.length * 18) + 9) + 'px' }
    const options = keys.map((key, index) => <option key={index} value={key}>{key}</option>)

    return (
      <Input type='select' label={'Feld mit eindeutiger ID in den Importdaten'} multiple className='form-control controls' style={style} bsSize='small' value={[idsImportIdField]} onChange={this.onChange}>
        {options}
      </Input>
    )
  }
})
