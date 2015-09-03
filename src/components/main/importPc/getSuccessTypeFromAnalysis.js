'use strict'

export default (variablesPassed) => {
  const { pcsToImport, idsNumberImportable, idsNotImportable, idsNotANumber, idsDuplicate } = variablesPassed
  if (idsNotImportable.length > 0 || idsNotANumber.length > 0) return 'danger'
  if ((idsNumberImportable < pcsToImport.length) || idsDuplicate.length > 0) return 'warning'
  return 'success'
}
