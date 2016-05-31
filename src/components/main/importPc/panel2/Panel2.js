'use strict'

import React from 'react'
import { FormGroup, FormControl } from 'react-bootstrap'
import WellTechnAnforderungenAnDatei from './WellTechnAnforderungenAnDatei.js'
import WellAnforderungenAnCsv from './WellAnforderungenAnCsv.js'
import WellAnforderungenInhaltlich from './WellAnforderungenInhaltlich.js'
import TablePreview from './TablePreview.js'

const Panel2 = ({
  onChangeFile,
  pcsToImport,
  validPcsToImport
}) =>
  <div>
    <WellTechnAnforderungenAnDatei />
    <WellAnforderungenAnCsv />
    <WellAnforderungenInhaltlich />
    <FormGroup
      controlId="nutzungsbedingungenInput"
      validationState={validPcsToImport ? null : 'error'}
    >
      <FormControl
        type="file"
        onChange={onChangeFile}
      />
    </FormGroup>
    {
      !validPcsToImport &&
      <div style={{ marginTop: '-4px' }} className="validateDiv">
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
