'use strict'

import React from 'react'
import WellSoGehts from './wellSoGehts.js'
import OptionsChoosen from './optionsChoosen.js'
import Format from './format.js'

export default React.createClass({
  displayName: 'Panel4',

  propTypes: {
    exportOptions: React.PropTypes.object,
    onlyObjectsWithCollectionData: React.PropTypes.bool,
    includeDataFromSynonyms: React.PropTypes.bool,
    oneRowPerRelation: React.PropTypes.bool,
    format: React.PropTypes.string,
    onChangeFormat: React.PropTypes.func
  },

  render () {
    const { exportOptions, onlyObjectsWithCollectionData, includeDataFromSynonyms, oneRowPerRelation, format, onChangeFormat } = this.props

    return (
      <div>
        <WellSoGehts />
        <OptionsChoosen
          exportOptions={exportOptions}
          onlyObjectsWithCollectionData={onlyObjectsWithCollectionData}
          includeDataFromSynonyms={includeDataFromSynonyms}
          oneRowPerRelation={oneRowPerRelation} />
        <Format
          format={format}
          onChangeFormat={onChangeFormat} />
      </div>
    )
  }
})
