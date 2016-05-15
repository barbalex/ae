'use strict'

import React from 'react'

export default React.createClass({
  displayName: 'CheckboxOnlyObjectsWithCollectionData',

  propTypes: {
    onChangeOnlyObjectsWithCollectionData: React.PropTypes.func,
    onlyObjectsWithCollectionData: React.PropTypes.bool
  },

  onChangeOnlyObjectsWithCollectionData (checked) {
    const { onChangeOnlyObjectsWithCollectionData } = this.props
    onChangeOnlyObjectsWithCollectionData(checked)
  },

  render() {
    const { onlyObjectsWithCollectionData } = this.props
    const inputStyle = {
      top: 5
    }
    const divStyle = {
      marginTop: 0,
      marginBottom: 0
    }
    const labelStyle = {
      float: 'none !important'
    }
    const pStyle = {
      marginBottom: 1 + 'px',
      marginLeft: 6,
      marginTop: 10
    }
    return (
      <div style={{marginBottom: 10, marginTop: 10}}>
        <p style={pStyle}><strong>Filterkriterien in Eigenschaften- und Beziehungssammlungen:</strong></p>
        <div className='checkbox' style={divStyle}>
          <label style={labelStyle}>
            <input type='checkbox' onChange={this.onChangeOnlyObjectsWithCollectionData.bind(this, true)} checked={onlyObjectsWithCollectionData} style={inputStyle} />
              <strong>filtern Arten bzw. Lebensräume</strong><br/>
              Beispiel: Filtern Sie in der Eigenschaftensammlung "ZH Artwert (aktuell)" im Feld "Artwert" nach "> 5", erhalten Sie im Resultat nur Arten mit Artwert > 5
          </label>
        </div>
        <div className='checkbox' style={divStyle}>
          <label style={labelStyle}>
            <input type='checkbox' onChange={this.onChangeOnlyObjectsWithCollectionData.bind(this, false)} checked={!onlyObjectsWithCollectionData} style={inputStyle} />
              <strong>filtern Eigenschaften- bzw. Beziehungssammlungen</strong><br/>
              Beispiel: Filtern Sie nach Artwert > 5, erhalten Sie im Resultat alle Arten der gewählten Gruppen. Der Artwert wird aber nur mitgeliefert, wenn er > 5 ist
          </label>
        </div>
      </div>
    )
  }
})
