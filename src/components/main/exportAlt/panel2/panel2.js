'use strict'

import React from 'react'
import WellSoGehts from './wellSoGehts.js'
import WellOptionsChoosen from './wellOptionsChoosen.js'
import buildExportFields from './buildExportFields.js'
import getCouchUrl from '../../../../modules/getCouchUrl.js'

export default React.createClass({
  displayName: 'Panel2',

  propTypes: {
    urlOptions: React.PropTypes.object,
    includeDataFromSynonyms: React.PropTypes.bool,
    oneRowPerRelation: React.PropTypes.bool
  },

  buildUrl () {
    const { urlOptions, includeDataFromSynonyms, oneRowPerRelation } = this.props
    const exportFields = JSON.stringify(buildExportFields(urlOptions))
    const couchUrl = getCouchUrl()
    const list = includeDataFromSynonyms ? 'export_alt_mit_synonymen' : 'export_alt'
    const view = includeDataFromSynonyms ? 'alt_arten_mit_synonymen' : 'alt_arten'
    const url = `${couchUrl}/_design/artendb/_list/${list}/${view}?include_docs=true&bezInZeilen=${oneRowPerRelation}&felder={"felder":${exportFields}}`
    return url
  },

  render () {
    const { urlOptions, includeDataFromSynonyms, oneRowPerRelation } = this.props
    const url = this.buildUrl()

    console.log('urlOptions', urlOptions)
    console.log('url', url)

    return (
      <div>
        <WellSoGehts />
        <WellOptionsChoosen
          urlOptions={urlOptions}
          includeDataFromSynonyms={includeDataFromSynonyms}
          oneRowPerRelation={oneRowPerRelation} />
        <p>{url}</p>
      </div>
    )
  }
})
