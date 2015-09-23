'use strict'

import React from 'react'

export default React.createClass({
  displayName: 'CheckboxOnlyObjectsWithCollectionData',

  propTypes: {
    onChangeOnlyObjectsWithCollectionData: React.PropTypes.func,
    onlyObjectsWithCollectionData: React.PropTypes.bool
  },

  render () {
    const { onChangeOnlyObjectsWithCollectionData, onlyObjectsWithCollectionData } = this.props
    const inputStyle = {
      top: 5
    }
    const divStyle = {
      marginTop: 8,
      marginBottom: 8
    }
    const labelStyle = {
      float: 'none !important'
    }
    return (
      <div className='checkbox' style={divStyle}>
        <label style={labelStyle}>
          <input type='checkbox' onChange={onChangeOnlyObjectsWithCollectionData} checked={onlyObjectsWithCollectionData} style={inputStyle} />
            <strong>Nur Datensätze exportieren, die in den gewählten Eigenschaften- und Beziehungssammlungen Informationen enthalten</strong><br/>
            Entfernen Sie diese Option, um auch Datensätze zu exportieren, die nur Informationen zur Taxonomie enthalten
        </label>
      </div>
    )
  }
})
