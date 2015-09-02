'use strict'

import _ from 'lodash'
import xlsx from 'xlsx'
import d3 from 'd3'

export default function (file) {
  return new Promise(function (resolve, reject) {
    const fileName = file.name
    const fileType = fileName.split('.').pop()
    let reader = new window.FileReader()

    if (fileType === 'csv') {
      reader.onload = function (onloadEvent) {
        const data = onloadEvent.target.result
        const pcsToImport = d3.csv.parse(data)
        // d3 adds missing fields as '' > remove them
        pcsToImport.forEach(function (pc, index) {
          _.forEach(pc, function (value, key) {
            if (value === '') delete pcsToImport[index][key]
          })
        })
        resolve(pcsToImport)
      }
      reader.onerror = function (error) {
        reject('error reading file: ' + error)
      }
      reader.readAsText(file)
    }
    if (fileType === 'xlsx') {
      reader.onload = function (onloadEvent) {
        const data = onloadEvent.target.result
        const workbook = xlsx.read(data, {type: 'binary'})
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const pcsToImport = xlsx.utils.sheet_to_json(worksheet)
        resolve(pcsToImport)
      }
      reader.onerror = function (error) {
        reject('error reading file: ' + error)
      }
      reader.readAsBinaryString(file)
    }
  })
}