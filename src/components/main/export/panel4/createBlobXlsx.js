/**
 *
 * gets: Export-Objekte
 * Retourniert: data für den Blob
 * Quelle: https://github.com/SheetJS/js-xlsx
 *
 **/

function datenum(v, date1904) {
  if (date1904) v += 1462
  const epoch = Date.parse(v)
  return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000)
}

function sheetFromArrayOfArrays(dataArray) {
  const ws = {}
  const range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } }
  let R
  let C
  let cell
  let cellRef

  for (R = 0; R !== dataArray.length; ++R) {
    for (C = 0; C !== dataArray[R].length; ++C) {
      if (range.s.r > R) { range.s.r = R }
      if (range.s.c > C) { range.s.c = C }
      if (range.e.r < R) { range.e.r = R }
      if (range.e.c < C) { range.e.c = C }
      cell = { v: dataArray[R][C] }
      if (cell.v === null) {
        continue
      }
      cellRef = window.XLSX.utils.encode_cell({ c: C, r: R })

      if (typeof cell.v === 'number') {
        cell.t = 'n'
      } else if (typeof cell.v === 'boolean') {
        cell.t = 'b'
      } else if (cell.v instanceof Date) {
        cell.t = 'n'
        cell.z = window.XLSX.SSF._table[14]
        cell.v = datenum(cell.v)
      } else {
        cell.t = 's'
      }

      ws[cellRef] = cell
    }
  }
  if (range.s.c < 10000000) {
    ws['!ref'] = window.XLSX.utils.encode_range(range)
  }
  return ws
}

const wsName = 'arteigenschaften'

function Workbook() {
  if (!(this instanceof Workbook)) {
    return new Workbook()
  }
  this.SheetNames = []
  this.Sheets = {}
}

function s2ab(s) {
  const buf = new ArrayBuffer(s.length)
  const view = new Uint8Array(buf)
  let i

  for (i = 0; i !== s.length; ++i) {
    view[i] = s.charCodeAt(i) & 0xFF
  }
  return buf
}

function getDataArrayFromExportObjects(exportObjects) {
  const dataArray = []

  // first the field names:
  dataArray.push(Object.keys(exportObjects[0]))
  // then the field values
  exportObjects.forEach((object) =>
    dataArray.push(
      Object.keys(object).map((key) => object[key])
    )
  )

  return dataArray
}

export default (exportObjects) => {
  const wb = new Workbook()
  const dataArray = getDataArrayFromExportObjects(exportObjects)
  const ws = sheetFromArrayOfArrays(dataArray)

  // add worksheet to workbook
  wb.SheetNames.push(wsName)
  wb.Sheets[wsName] = ws
  const wbout = window.XLSX.write(wb, {
    bookType: 'xlsx',
    bookSST: true,
    type: 'binary'
  })

  return s2ab(wbout)
}
