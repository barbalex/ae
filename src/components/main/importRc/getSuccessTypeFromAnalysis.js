export default ({
  rcsToImport,
  idsNumberImportable,
  idsNotImportable,
  idsNotANumber
}) => {
  if (idsNotImportable.length > 0 || idsNotANumber.length > 0) return 'danger'
  if ((idsNumberImportable < rcsToImport.length)) return 'warning'
  return 'success'
}
