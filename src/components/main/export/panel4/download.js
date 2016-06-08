import d3 from 'd3'
import moment from 'moment'
import createBlobXlsx from './createBlobXlsx.js'
import FileSaver from 'browser-filesaver'
import stringifyExportObjects from './stringifyExportObjects.js'

export default (exportObjects, format) => {
  /**
   * some arrays contain objects
   * these need to be JSON.stringified
   */
  exportObjects = stringifyExportObjects(exportObjects)

  const date = moment().format('YYYY-MM-DD_HH-mm')
  const filename = `${date}_arteigenschaften.${format}`
  let blob
  if (format === 'csv') {
    const csvData = d3.csv.format(exportObjects)
    blob = new window.Blob([csvData], {
      type: 'text/plain;charset=utf-8;'
    })
  }
  if (format === 'xlsx') {
    const blobData = createBlobXlsx(exportObjects)
    blob = new window.Blob([blobData], {
      type: 'application/octet-stream;charset=utf-8;'
    })
  }
  FileSaver.saveAs(blob, filename)
}
