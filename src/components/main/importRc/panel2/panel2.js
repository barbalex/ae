'use strict'

import React from 'react'
import WellTechnAnforderungenAnDatei from './wellTechnAnforderungenAnDatei.js'
import WellAnforderungenAnCsv from './wellAnforderungenAnCsv.js'
import WellAnforderungenInhaltlich from './wellAnforderungenInhaltlich.js'
import TablePreview from './tablePreview.js'

const Panel2 = ({ rcsToImport, validRcsToImport, onChangeFile }) => (
  <div>
    <WellTechnAnforderungenAnDatei />
    <WellAnforderungenAnCsv />
    <WellAnforderungenInhaltlich />

    <input
      type="file"
      className="form-control"
      onChange={(event) => onChangeFile(event)}
    />
    {
      !validRcsToImport &&
      <div
        className="validateDiv"
      >
        Bitte wählen Sie eine Datei
      </div>
    }

    {
      rcsToImport.length > 0 &&
      <TablePreview
        rcsToImport={rcsToImport}
      />
    }
  </div>
)

Panel2.displayName = 'Panel2'

Panel2.propTypes = {
  rcsToImport: React.PropTypes.array,
  validRcsToImport: React.PropTypes.bool,
  onChangeFile: React.PropTypes.func
}

export default Panel2
