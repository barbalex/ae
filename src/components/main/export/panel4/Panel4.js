import app from 'ampersand-app'
import React from 'react'
import WellSoGehts from './WellSoGehts.js'
import WellOptionsChoosen from './WellOptionsChoosen.js'
import WellFormat from './WellFormat.js'
import TablePreview from './TablePreview.js'
import AlertErrorBuildingExportData from './AlertErrorBuildingExportData.js'
import AlertBuildingExportData from './AlertBuildingExportData.js'
import ButtonExport from './ButtonExport.js'

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
