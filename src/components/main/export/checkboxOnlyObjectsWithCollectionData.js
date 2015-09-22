'use strict'

import React from 'react'
import { Input } from 'react-bootstrap'

export default React.createClass({
  displayName: 'CheckboxOnlyObjectsWithCollectionData',

  propTypes: {
    onChangeOnlyObjectsWithCollectionData: React.PropTypes.func
  },

  render () {
    const { onChangeOnlyObjectsWithCollectionData } = this.props
    const inputStyle = {
      top: 5
    }
    return (
      <div className='checkbox'>
        <label>
          <input type='checkbox' onChange={onChangeOnlyObjectsWithCollectionData} style={inputStyle} />
            <strong>Nur Datensätze exportieren, die in den gewählten Eigenschaften- und Beziehungssammlungen Informationen enthalten</strong><br/>
            Entfernen Sie diese Option, um auch Datensätze zu exportieren, die nur Informationen zur Taxonomie enthalten
        </label>
      </div>
    )
  }
})
