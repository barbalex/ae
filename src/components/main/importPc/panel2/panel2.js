'use strict'

import React from 'react'
import WellTechnAnforderungenAnDatei from './wellTechnAnforderungenAnDatei.js'
import WellAnforderungenAnCsv from './wellAnforderungenAnCsv.js'
import WellAnforderungenInhaltlich from './wellAnforderungenInhaltlich.js'
import TablePreview from './tablePreview.js'

export default React.createClass({
  displayName: 'Panel2',

  propTypes: {
    pcsToImport: React.PropTypes.array,
    validPcsToImport: React.PropTypes.bool,
    onChangeFile: React.PropTypes.func
  },

  render () {
    const { onChangeFile, pcsToImport, validPcsToImport } = this.props
    return (
      <div>
        <WellTechnAnforderungenAnDatei />
        <WellAnforderungenAnCsv />
        <WellAnforderungenInhaltlich />
        <input
          type='file'
          className='form-control'
          onChange={onChangeFile} />
        {
          !validPcsToImport &&
          <div className='validateDiv'>
            Bitte wählen Sie eine Datei
          </div>
        }
        {
          pcsToImport.length > 0 &&
          <TablePreview
            pcsToImport={pcsToImport} />
        }
      </div>
    )
  }
})
