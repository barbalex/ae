'use strict'

import app from 'ampersand-app'
import React from 'react'
import WellSoGehts from './wellSoGehts.js'
import OptionsChoosen from './optionsChoosen.js'
import Format from './format.js'
import TablePreview from './tablePreview.js'
import AlertErrorBuildingExportData from './alertErrorBuildingExportData.js'
import AlertBuildingExportData from './alertBuildingExportData.js'

export default React.createClass({
  displayName: 'Panel4',

  propTypes: {
    exportOptions: React.PropTypes.object,
    onlyObjectsWithCollectionData: React.PropTypes.bool,
    includeDataFromSynonyms: React.PropTypes.bool,
    oneRowPerRelation: React.PropTypes.bool,
    taxonomienZusammenfassen: React.PropTypes.bool,
    format: React.PropTypes.string,
    onChangeFormat: React.PropTypes.func,
    exportData: React.PropTypes.array,
    errorBuildingExportData: React.PropTypes.object
  },

  componentDidMount () {
    const { exportOptions, onlyObjectsWithCollectionData, includeDataFromSynonyms, oneRowPerRelation, taxonomienZusammenfassen } = this.props
    // make sure, pcs are queried
    app.Actions.buildExportData({ exportOptions, onlyObjectsWithCollectionData, includeDataFromSynonyms, oneRowPerRelation, taxonomienZusammenfassen })
    console.log('building export data')
  },

  render () {
    const { exportOptions, onlyObjectsWithCollectionData, includeDataFromSynonyms, oneRowPerRelation, taxonomienZusammenfassen, format, onChangeFormat, exportData, errorBuildingExportData } = this.props
    const showAlertBuildingData = exportData.length === 0 && !errorBuildingExportData

    return (
      <div>
        <WellSoGehts />
        <OptionsChoosen
          exportOptions={exportOptions}
          onlyObjectsWithCollectionData={onlyObjectsWithCollectionData}
          includeDataFromSynonyms={includeDataFromSynonyms}
          oneRowPerRelation={oneRowPerRelation}
          taxonomienZusammenfassen={taxonomienZusammenfassen} />
        <Format
          format={format}
          onChangeFormat={onChangeFormat} />
        {exportData.length > 0 ?
          <TablePreview
            exportData={exportData} />
          : null
        }
        {showAlertBuildingData ?
          <AlertBuildingExportData />
          : null
        }
        {errorBuildingExportData ?
          <AlertErrorBuildingExportData
            errorBuildingExportData={errorBuildingExportData} />
          : null
        }
      </div>
    )
  }
})
