'use strict'

import React from 'react'
import { ListenerMixin } from 'reflux'
import WellTechnAnforderungenAnDatei from './wellTechnAnforderungenAnDatei.js'
import WellAnforderungenAnCsv from './wellAnforderungenAnCsv.js'
import WellAnforderungenInhaltlich from './wellAnforderungenInhaltlich.js'
import TablePreview from './tablePreview.js'

export default React.createClass({
  displayName: 'ImportRelationCollections',

  mixins: [ListenerMixin],

  propTypes: {
    rcsToImport: React.PropTypes.array,
    validRcsToImport: React.PropTypes.bool,
    onChangeFile: React.PropTypes.func
  },

  render () {
    const { rcsToImport, validRcsToImport, onChangeFile } = this.props

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
          validRcsToImport
          ? null
          : <div
              className='validateDiv'>
              Bitte wählen Sie eine Datei
            </div>
        }

        {
          rcsToImport.length > 0
          ? <TablePreview
              rcsToImport={rcsToImport} />
          : null
        }
      </div>
    )
  }
})
