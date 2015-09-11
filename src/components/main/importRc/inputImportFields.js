'use strict'

import React from 'react'
import _ from 'lodash'
import { Input } from 'react-bootstrap'

export default React.createClass({
  displayName: 'InputImportFields',

  propTypes: {
    idsImportIdField: React.PropTypes.string,
    rcsToImport: React.PropTypes.array,
    onChangeImportId: React.PropTypes.func
  },

  onChange (event) {
    const idsImportIdField = event.target.value
    this.props.onChangeImportId(idsImportIdField)
  },

  render () {
    const { rcsToImport, idsImportIdField } = this.props

     // get a list of all keys
    let keys = []
    rcsToImport.forEach((pc) => {
      keys = _.union(keys, _.keys(pc))
    })
    // remove field '_id'
    keys = _.without(keys, '_id')

    const style = { height: ((keys.length * 18) + 9) + 'px' }
    const options = keys.map((key, index) => <option key={index} value={key}>{key}</option>)

    return (
      <Input type='select' label={'Feld mit eindeutiger ID in den Importdaten'} multiple className='form-control controls' style={style} bsSize='small' value={[idsImportIdField]} onChange={this.onChange}>
        {options}
      </Input>
    )
  }
})
