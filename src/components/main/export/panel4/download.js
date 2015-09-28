'use strict'

// import d3 from 'd3'
import moment from 'moment'
import createBlobXlsx from './createBlobXlsx.js'
import FileSaver from 'browser-filesaver'

export default (exportObjects, format) => {
  const date = moment().format('YYYY-MM-DD_HH-mm')
  if (format === 'csv') {

  }
  if (format === 'xlsx') {
    const blobData = createBlobXlsx(exportObjects)
    const blob = new window.Blob([blobData], {type: 'application/octet-stream;charset=utf-8;'})
    FileSaver.saveAs(blob, `${date}_arteigenschaften.xlsx`)
  }
}
