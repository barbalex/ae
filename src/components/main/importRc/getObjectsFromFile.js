'use strict'

import _ from 'lodash'
import d3 from 'd3'

export default (file) => {
  return new Promise((resolve, reject) => {
    const fileName = file.name
    const fileType = fileName.split('.').pop()
    let reader = new window.FileReader()

    if (fileType === 'csv') {
      reader.onload = (onloadEvent) => {
        const data = onloadEvent.target.result
        const objects = d3.csv.parse(data)
        // d3 adds missing fields as '' > remove them
        objects.forEach((object, index) => {
          _.forEach(object, (value, key) => {
            if (value === '') delete objects[index][key]
          })
        })
        resolve(objects)
      }
      reader.onerror = (error) => reject('error reading file: ' + error)
      reader.readAsText(file)
    }
    if (fileType === 'xlsx') {
      reader.onload = (onloadEvent) => {
        const data = onloadEvent.target.result
        const workbook = window.XLSX.read(data, {type: 'binary'})
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const objects = window.XLSX.utils.sheet_to_json(worksheet)
        resolve(objects)
      }
      reader.onerror = (error) => reject('error reading file: ' + error)
      reader.readAsBinaryString(file)
    }
  })
}