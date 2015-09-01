'use strict'

export default function (variablesPassed) {
  const { pcsToImport, idsImportableCount, idsNotImportable, idsNotNumber, idsDuplicate } = variablesPassed
  if (idsNotImportable.length > 0 || idsNotNumber.length > 0) return 'danger'
  if ((idsImportableCount < pcsToImport.length) || idsDuplicate.length > 0) return 'warning'
  return 'success'
}
