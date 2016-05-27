'use strict'

import React from 'react'
import { union, without } from 'lodash'
import { Table } from 'react-bootstrap'

const TablePreview = ({ rcsToImport }) => {
  const legendStyle = { marginBottom: `${2}px`, paddingLeft: `${5}px` }
  const tablePreviewStyle = { marginTop: `${10}px` }
  let legend = ''

  if (rcsToImport.length > 10) {
    legend = `Vorschau der ersten 10 von ${rcsToImport.length} Datensätzen:`
  } else if (rcsToImport.length > 1) {
    legend = `Vorschau der ${rcsToImport.length} Datensätze:`
  } else if (rcsToImport.length === 1) {
    legend = 'Vorschau des einzigen Datensatzes:'
  } else {
    legend = 'Vorschau:'
  }

  // get a list of all keys
  let keys = []
  rcsToImport.forEach((pc) => {
    keys = union(keys, Object.keys(pc))
  })
  // remove '_id' and 'rPartners' from keys
  keys = without(keys, '_id', 'rPartners')

  const thead = keys.map((key, index) =>
    <th key={index}>{key}</th>
  )
  const tbody = rcsToImport.map((pc, index) => {
    // need only the first 10
    if (index < 10) {
      const rows = keys.map((key) => {
        // return values for not existing fields!
        // if not, table gets torn apart
        const value = pc[key] || ''
        return <td key={key}>{value}</td>
      })
      return (
        <tr key={index}>
          {rows}
        </tr>
      )
    }
    return null
  })

  return (
    <div style={tablePreviewStyle}>
      <p style={legendStyle}>{legend}</p>
      {
      /**
       * surround table with panel to get rounded corners
       * source: http://stackoverflow.com/questions/18729638/rounded-tables-in-twitter-bootstrap-3
       */
      }
      <div
        className="panel panel-default"
        style={{ backgroundColor: '#fffff0' }}
      >
        <Table
          responsive
          bordered
          striped
          condensed
          hover
        >
          <thead>
            <tr>
              {thead}
            </tr>
          </thead>
          <tbody>
            {tbody}
          </tbody>
        </Table>
      </div>
    </div>
  )
}


TablePreview.displayName = 'TablePreview'

TablePreview.propTypes = {
  rcsToImport: React.PropTypes.array
}

export default TablePreview
