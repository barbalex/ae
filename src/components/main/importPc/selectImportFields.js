'use strict'

import React from 'react'
import _ from 'lodash'
import { Input } from 'react-bootstrap'

export default React.createClass({
  displayName: 'SelectImportFields',

  propTypes: {
    pcsToImport: React.PropTypes.array
  },

  render () {
    const { pcsToImport } = this.props

     // get a list of all keys
    let keys = []
    pcsToImport.forEach(function (pc) {
      keys = _.union(keys, _.keys(pc))
    })

    const style = { height: ((keys.length * 19) + 9) + 'px' }
    const options = keys.map(function (key) {
      return (<option value={key}>{key}</option>)
    })

    return (
      <Input type='select' label={'Feld mit eindeutiger ID in den Importdaten'} multiple className='form-control controls input-sm' style={style}>
        {options}
      </Input>
    )
  }
})
