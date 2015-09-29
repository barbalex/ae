'use strict'

import React from 'react'

export default React.createClass({
  displayName: 'CheckboxIncludeDataFromSynonyms',

  propTypes: {
    onChangeIncludeDataFromSynonyms: React.PropTypes.func,
    includeDataFromSynonyms: React.PropTypes.bool
  },

  render () {
    const { onChangeIncludeDataFromSynonyms, includeDataFromSynonyms } = this.props
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
    return (
      <div className='checkbox' style={divStyle}>
        <label style={labelStyle}>
          <input type='checkbox' onChange={onChangeIncludeDataFromSynonyms} checked={includeDataFromSynonyms} style={inputStyle} />
            <strong>Informationen von Synonymen berücksichtigen</strong><br/>
            Informationen von synonymen Arten bzw. Lebensräumen werden wie eigene Informationen behandelt
        </label>
      </div>
    )
  }
})
