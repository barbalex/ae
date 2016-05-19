'use strict'

import React from 'react'
import WellTechnAnforderungenAnDatei from './wellTechnAnforderungenAnDatei.js'
import WellAnforderungenAnCsv from './wellAnforderungenAnCsv.js'
import WellAnforderungenInhaltlich from './wellAnforderungenInhaltlich.js'
import TablePreview from './tablePreview.js'

const Panel2 = ({ onChangeFile, pcsToImport, validPcsToImport }) =>
  <div>
    <WellTechnAnforderungenAnDatei />
    <WellAnforderungenAnCsv />
    <WellAnforderungenInhaltlich />
    <input
      type="file"
      className="form-control"
      onChange={onChangeFile}
    />
    {
      !validPcsToImport &&
      <div className="validateDiv">
        Bitte wählen Sie eine Datei
      </div>
    }
    {
      pcsToImport.length > 0 &&
      <TablePreview
        pcsToImport={pcsToImport}
      />
    }
  </div>

Panel2.displayName = 'Panel2'

Panel2.propTypes = {
  pcsToImport: React.PropTypes.array,
  validPcsToImport: React.PropTypes.bool,
  onChangeFile: React.PropTypes.func
}

export default Panel2
