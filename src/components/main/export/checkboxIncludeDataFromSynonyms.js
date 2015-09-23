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
      marginTop: 8,
      marginBottom: 8
    }
    const labelStyle = {
      float: 'none !important'
    }
    return (
      <div className='checkbox' style={divStyle}>
        <label style={labelStyle}>
          <input type='checkbox' onChange={onChangeIncludeDataFromSynonyms} checked={includeDataFromSynonyms} style={inputStyle} />
            <strong>inklusive Informationen von Synonymen</strong><br/>
            Es werden auch Informationen mitgeliefert, die nur bei einem Synonym beschrieben wurden
        </label>
      </div>
    )
  }
})
