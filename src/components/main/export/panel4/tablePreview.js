'use strict'

import React from 'react'
import { Table } from 'react-bootstrap'

export default React.createClass({
  displayName: 'TablePreview',

  propTypes: {
    exportObjects: React.PropTypes.array
  },

  render () {
    const { exportObjects } = this.props
    const legendStyle = { marginBottom: 2 + 'px', paddingLeft: 5 + 'px' }
    const tablePreviewStyle = { marginTop: 10 + 'px' }
    let legend = ''

    if (exportObjects.length > 10) {
      legend = 'Vorschau der ersten 10 von ' + exportObjects.length + ' Datensätzen:'
    } else if (exportObjects.length > 1) {
      legend = 'Vorschau der ' + exportObjects.length + ' Datensätze:'
    } else if (exportObjects.length === 1) {
      legend = 'Vorschau der ' + exportObjects.length + ' Datensätze:'
    } else {
      legend = 'Vorschau:'
    }

    // get a list of all keys
    const keys = Object.keys(exportObjects[0])

    const thead = keys.map((key, index) => <th key={index}>{key}</th>)
    const tbody = exportObjects.map((pc, index) => {
      // need only the first 10
      if (index < 10) {
        const rows = keys.map((key) => {
          // return values for not existing fieds!
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
    })

    return (
      <div style={tablePreviewStyle}>
        <p style={legendStyle}>{legend}</p>
        <Table responsive bordered striped condensed hover>
          <thead>
            {thead}
          </thead>
          <tbody>
            {tbody}
          </tbody>
        </Table>
      </div>
    )
  }
})
