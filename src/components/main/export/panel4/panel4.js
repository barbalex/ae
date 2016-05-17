'use strict'

import app from 'ampersand-app'
import React from 'react'
import WellSoGehts from './wellSoGehts.js'
import WellOptionsChoosen from './wellOptionsChoosen.js'
import WellFormat from './wellFormat.js'
import TablePreview from './tablePreview.js'
import AlertErrorBuildingExportData from './alertErrorBuildingExportData.js'
import AlertBuildingExportData from './alertBuildingExportData.js'
import ButtonExport from './buttonExport.js'

export default React.createClass({
  displayName: 'Panel4',

  propTypes: {
    exportOptions: React.PropTypes.object,
    onlyObjectsWithCollectionData: React.PropTypes.bool,
    includeDataFromSynonyms: React.PropTypes.bool,
    oneRowPerRelation: React.PropTypes.bool,
    combineTaxonomies: React.PropTypes.bool,
    format: React.PropTypes.string,
    onChangeFormat: React.PropTypes.func,
    exportObjects: React.PropTypes.array,
    errorBuildingExportData: React.PropTypes.object
  },

  componentDidMount() {
    const {
      exportOptions,
      onlyObjectsWithCollectionData,
      includeDataFromSynonyms,
      oneRowPerRelation,
      combineTaxonomies
    } = this.props
    // make sure, pcs are queried
    app.Actions.buildExportData({
      exportOptions,
      onlyObjectsWithCollectionData,
      includeDataFromSynonyms,
      oneRowPerRelation,
      combineTaxonomies
    })
  },

  render() {
    const {
      exportOptions,
      onlyObjectsWithCollectionData,
      includeDataFromSynonyms,
      oneRowPerRelation,
      combineTaxonomies,
      format,
      onChangeFormat,
      exportObjects,
      errorBuildingExportData
    } = this.props
    const showAlertBuildingData = (
      exportObjects.length === 0 &&
      !errorBuildingExportData
    )
    const showExportComponents = exportObjects.length > 0

    return (
      <div>
        <WellSoGehts />
        <WellOptionsChoosen
          exportOptions={exportOptions}
          onlyObjectsWithCollectionData={onlyObjectsWithCollectionData}
          includeDataFromSynonyms={includeDataFromSynonyms}
          oneRowPerRelation={oneRowPerRelation}
          combineTaxonomies={combineTaxonomies}
        />
        {
          exportObjects.length > 0 &&
          <TablePreview
            exportObjects={exportObjects}
          />
        }
        {
          showAlertBuildingData &&
          <AlertBuildingExportData />
        }
        {
          errorBuildingExportData &&
          <AlertErrorBuildingExportData
            errorBuildingExportData={errorBuildingExportData}
          />
        }
        {
          showExportComponents &&
          <WellFormat
            format={format}
            onChangeFormat={onChangeFormat}
          />
        }
        {
          showExportComponents &&
          <ButtonExport
            exportObjects={exportObjects}
            format={format}
          />
        }
      </div>
    )
  }
})
