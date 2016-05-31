'use strict'

import React from 'react'
import { FormGroup, FormControl } from 'react-bootstrap'
import WellTechnAnforderungenAnDatei from './WellTechnAnforderungenAnDatei.js'
import WellAnforderungenAnCsv from './WellAnforderungenAnCsv.js'
import WellAnforderungenInhaltlich from './WellAnforderungenInhaltlich.js'
import TablePreview from './TablePreview.js'

const Panel2 = ({
  rcsToImport,
  validRcsToImport,
  onChangeFile
}) => (
  <div>
    <WellTechnAnforderungenAnDatei />
    <WellAnforderungenAnCsv />
    <WellAnforderungenInhaltlich />

    <FormGroup
      controlId="nutzungsbedingungenInput"
      validationState={validRcsToImport ? null : 'error'}
    >
      <FormControl
        type="file"
        onChange={onChangeFile}
      />
    </FormGroup>
    {
      !validRcsToImport &&
      <div style={{ marginTop: '-4px' }} className="validateDiv">
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
