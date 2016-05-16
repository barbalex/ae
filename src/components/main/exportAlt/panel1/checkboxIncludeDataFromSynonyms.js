'use strict'

import React from 'react'

const inputStyle = {
  top: 5
}
const divStyle = {
  marginTop: 13,
  marginBottom: 13
}
const labelStyle = {
  float: 'none !important'
}

const CheckboxIncludeDataFromSynonyms = ({
  onChangeIncludeDataFromSynonyms,
  includeDataFromSynonyms
}) =>
  <div
    className="checkbox"
    style={divStyle}
  >
    <label style={labelStyle}>
      <input
        type="checkbox"
        onChange={onChangeIncludeDataFromSynonyms}
        checked={includeDataFromSynonyms}
        style={inputStyle}
      />
      <strong>Informationen von Synonymen berücksichtigen</strong><br />
      Informationen von synonymen Arten werden wie eigene Informationen behandelt
    </label>
  </div>

CheckboxIncludeDataFromSynonyms.displayName = 'CheckboxIncludeDataFromSynonyms'

CheckboxIncludeDataFromSynonyms.propTypes = {
  onChangeIncludeDataFromSynonyms: React.PropTypes.func,
  includeDataFromSynonyms: React.PropTypes.bool
}

export default CheckboxIncludeDataFromSynonyms
