'use strict'

import React from 'react'
import { Table } from 'react-bootstrap'
import { isArray, isPlainObject } from 'lodash'

const TablePreview = ({ exportObjects }) => {
  const legendStyle = {
    marginBottom: 2,
    paddingLeft: 5
  }
  const tablePreviewStyle = {
    marginTop: 10,
    marginBottom: 10
  }
  let legend = ''

  if (exportObjects.length > 10) {
    legend = `Vorschau der ersten 10 von ${exportObjects.length} Datensätzen:`
  } else if (exportObjects.length > 1) {
    legend = `Vorschau der ${exportObjects.length} Datensätze:`
  } else if (exportObjects.length === 1) {
    legend = 'Vorschau des einzigen Datensatzes:'
  } else {
    legend = 'Vorschau:'
  }

  // get a list of all keys
  const keys = Object.keys(exportObjects[0])

  const thead = keys.map((key, index) =>
    <th key={index}>{key}</th>
  )
  const tbody = exportObjects.map((pc, index) => {
    // need only the first 10
    if (index < 10) {
      const rows = keys.map((key) => {
        // return values for not existing fields!
        // if not, table gets torn apart
        let value = pc[key] || ''
        // if field content is array, write it into separate lines
        if (isArray(value)) {
          value = value.map((val, i) => {
            if (isPlainObject(val)) {
              val = JSON.stringify(val)
            }
            if (i + 1 === value.length) {
              return (
                <p key={i}>
                  {val}<br />
                </p>
              )
            }
            return (
              <p key={i}>
                {val}
              </p>
            )
          })
        }
        if (value === true) value = 'ja'
        if (value === false) value = 'nein'
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
      <p style={legendStyle}>
        {legend}
      </p>
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
          style={{ borderRadius: 3 }}
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
  exportObjects: React.PropTypes.array
}

export default TablePreview
