'use strict'

import app from 'ampersand-app'
import React from 'react'
import WellSoGehts from './wellSoGehts.js'
import WellOptionsChoosen from './wellOptionsChoosen.js'
import TablePreview from './tablePreview.js'
import AlertErrorBuildingExportData from './alertErrorBuildingExportData.js'
import AlertBuildingExportData from './alertBuildingExportData.js'

export default React.createClass({
  displayName: 'Panel2',

  propTypes: {
    exportOptions: React.PropTypes.object,
    onlyObjectsWithCollectionData: React.PropTypes.bool,
    includeDataFromSynonyms: React.PropTypes.bool,
    oneRowPerRelation: React.PropTypes.bool,
    combineTaxonomies: React.PropTypes.bool,
    exportObjects: React.PropTypes.array,
    errorBuildingExportData: React.PropTypes.object
  },

  componentDidMount () {
    const { exportOptions, onlyObjectsWithCollectionData, includeDataFromSynonyms, oneRowPerRelation, combineTaxonomies } = this.props
    // make sure, pcs are queried
    app.Actions.buildExportData({ exportOptions, onlyObjectsWithCollectionData, includeDataFromSynonyms, oneRowPerRelation, combineTaxonomies })
    console.log('building export data')
  },

  render () {
    const { exportOptions, onlyObjectsWithCollectionData, includeDataFromSynonyms, oneRowPerRelation, combineTaxonomies, exportObjects, errorBuildingExportData } = this.props
    const showAlertBuildingData = exportObjects.length === 0 && !errorBuildingExportData

    return (
      <div>
        <WellSoGehts />
        <WellOptionsChoosen
          exportOptions={exportOptions}
          onlyObjectsWithCollectionData={onlyObjectsWithCollectionData}
          includeDataFromSynonyms={includeDataFromSynonyms}
          oneRowPerRelation={oneRowPerRelation}
          combineTaxonomies={combineTaxonomies} />
        {
          exportObjects.length > 0
          ? <TablePreview
              exportObjects={exportObjects} />
          : null
        }
        {
          showAlertBuildingData
          ? <AlertBuildingExportData />
          : null
        }
        {
          errorBuildingExportData
          ? <AlertErrorBuildingExportData
              errorBuildingExportData={errorBuildingExportData} />
          : null
        }
      </div>
    )
  }
})
