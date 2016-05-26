/*
 * get: idsAeIdField, idsImportIdField, pcsToImport
 * return alert
 */
'use strict'

import React from 'react'
import { Alert } from 'react-bootstrap'
import getSuccessTypeFromAnalysis from '../getSuccessTypeFromAnalysis.js'

const AlertIdsAnalysisResult = ({
  rcsToImport,
  idsImportIdField,
  idsAeIdField,
  idsAnalysisComplete,
  idsNumberOfRecordsWithIdValue,
  idsNumberImportable,
  idsNotANumber,
  idsWithoutPartner,
  rPartnerIdsToImport,
  rPartnerIdsImportable,
  idsNotImportable
}) => {
  if (!idsAnalysisComplete) {
    if (idsAeIdField === 'GUID') {
      return (
        <Alert bsStyle="info">
          Bitte warten, die Daten werden analysiert...
        </Alert>
      )
    }
    return (
      <Alert bsStyle="info">
        Bitte warten, die Daten werden analysiert.<br />
        Das kann eine Weile dauern...<br />
        ...vor allem wenn Sie zum ersten Mal Daten mit Hilfe einer ID eines nationalen Zentrums importieren:<br />
        ...dann muss nämlich der entsprechende Index aufgebaut werden.
      </Alert>
    )
  }

  const titleText = <p>Die Importtabelle enthält {rcsToImport.length} Datensätze:</p>
  const recordsWithIdValueText = `${idsNumberOfRecordsWithIdValue} enthalten einen Wert im Feld "${idsImportIdField}"`
  const recordsImportableText = `${idsNumberImportable} können zugeordnet und importiert werden`

  const idsNotNumbersText = `${idsNotANumber.length} mit den folgenden Werten im Feld "${idsImportIdField}" enthalten keine Zahlen:`
  const idsNotNumbersList = idsNotANumber.join(' | ')

  const recordsNotImportableText = `${idsNotImportable.length} mit den folgenden Werten im Feld "${idsImportIdField}" können nicht zugeordnet und importiert werden:`
  const idsNotImportableList = idsNotImportable.join(' | ')

  const idsWithoutPartnerText = `${idsWithoutPartner.length} haben keinen Beziehungspartner:`
  const idsWithoutPartnerList = idsWithoutPartner.join(' | ')

  const rPartnerText = `Von ${rPartnerIdsToImport.length} Beziehungspartnern können ${rPartnerIdsImportable.length} importiert werden`

  const successType = getSuccessTypeFromAnalysis({
    rcsToImport,
    idsNumberImportable,
    idsNotImportable,
    idsNotANumber
  })

  return (
    <Alert bsStyle={successType}>
      <p><strong>Ergebnis der Analyse</strong></p>
      {titleText}
      <ul>
        <li>
          {recordsWithIdValueText}
        </li>
        {
          idsNotANumber.length > 0 &&
          <li>
            {idsNotNumbersText}<br />
            {idsNotNumbersList}
          </li>
        }
        {
          idsNotImportable.length > 0 &&
          <li>
            {recordsNotImportableText}<br />
            {idsNotImportableList}
          </li>
        }
        <li>
          {recordsImportableText}
        </li>
        {
          idsWithoutPartner.length > 0 &&
          <li>
            {idsWithoutPartnerText}<br />
            {idsWithoutPartnerList}
          </li>
        }
        <li>
          {rPartnerText}
        </li>
      </ul>
    </Alert>
  )
}

AlertIdsAnalysisResult.displayName = 'AlertIdsAnalysisResult'

AlertIdsAnalysisResult.propTypes = {
  idsAeIdField: React.PropTypes.string,
  idsImportIdField: React.PropTypes.string,
  rcsToImport: React.PropTypes.array,
  idsAnalysisComplete: React.PropTypes.bool,
  idsNumberOfRecordsWithIdValue: React.PropTypes.number,
  idsNumberImportable: React.PropTypes.number,
  idsNotImportable: React.PropTypes.array,
  idsNotANumber: React.PropTypes.array,
  idsWithoutPartner: React.PropTypes.array,
  rPartnerIdsToImport: React.PropTypes.array,
  rPartnerIdsImportable: React.PropTypes.array
}

export default AlertIdsAnalysisResult
