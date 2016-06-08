export default ({
  pcsToImport,
  idsNumberImportable,
  idsNotImportable,
  idsNotANumber,
  idsDuplicate
}) => {
  if (idsNotImportable.length > 0 || idsNotANumber.length > 0) return 'danger'
  if ((idsNumberImportable < pcsToImport.length) || idsDuplicate.length > 0) return 'warning'
  return 'success'
}
