'use strict'

import React from 'react'

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
  marginBottom: `${1}px`,
  marginLeft: 6,
  marginTop: 10
}

const CheckboxOnlyObjectsWithCollectionData = ({
  onlyObjectsWithCollectionData,
  onChangeOnlyObjectsWithCollectionData
}) => (
  <div
    style={{ marginBottom: 10, marginTop: 10 }}
  >
    <p style={pStyle}>
      <strong>Filterkriterien in Eigenschaften- und Beziehungssammlungen:</strong>
    </p>
    <div
      className="checkbox"
      style={divStyle}
    >
      <label style={labelStyle}>
        <input
          type="checkbox"
          onChange={() => onChangeOnlyObjectsWithCollectionData(true)}
          checked={onlyObjectsWithCollectionData}
          style={inputStyle}
        />
        <strong>filtern Arten bzw. Lebensräume</strong><br />
        Beispiel:<br />
        Filtern Sie in der Eigenschaftensammlung "ZH Artwert (aktuell)" im Feld "Artwert" nach "> 5",<br />
        erhalten Sie im Resultat nur Arten mit Artwert > 5
      </label>
    </div>
    <div
      className="checkbox"
      style={divStyle}
    >
      <label style={labelStyle}>
        <input
          type="checkbox"
          onChange={() => onChangeOnlyObjectsWithCollectionData(false)}
          checked={!onlyObjectsWithCollectionData}
          style={inputStyle}
        />
        <strong>filtern Eigenschaften- bzw. Beziehungssammlungen</strong><br />
        Beispiel:<br />
        Filtern Sie nach Artwert > 5, erhalten Sie im Resultat alle Arten der gewählten Gruppen.<br />
        Der Artwert wird aber nur mitgeliefert, wenn er > 5 ist
      </label>
    </div>
  </div>
)

CheckboxOnlyObjectsWithCollectionData.displayName = 'CheckboxOnlyObjectsWithCollectionData'

CheckboxOnlyObjectsWithCollectionData.propTypes = {
  onChangeOnlyObjectsWithCollectionData: React.PropTypes.func,
  onlyObjectsWithCollectionData: React.PropTypes.bool
}

export default CheckboxOnlyObjectsWithCollectionData
