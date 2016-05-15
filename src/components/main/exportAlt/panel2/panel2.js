'use strict'

import React from 'react'
import { Button, Well } from 'react-bootstrap'
import CopyToClipboard from 'react-copy-to-clipboard'
import Textarea from 'react-textarea-autosize'
import WellOptionsChoosen from './wellOptionsChoosen.js'
import buildExportFields from './buildExportFields.js'
import getCouchUrl from '../../../../modules/getCouchUrl.js'

export default React.createClass({
  displayName: 'Panel2',

  propTypes: {
    urlOptions: React.PropTypes.object,
    includeDataFromSynonyms: React.PropTypes.bool,
    oneRowPerRelation: React.PropTypes.bool,
    urlCopied: React.PropTypes.string,
    onCopyUrl: React.PropTypes.func
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

  copyUrl (url, event) {
    const { onCopyUrl } = this.props
    // an event is only passed if this function is called from the link
    if (event && event.preventDefault) event.preventDefault()
    onCopyUrl(url)
  },

  render() {
    const { urlOptions, includeDataFromSynonyms, oneRowPerRelation, urlCopied } = this.props
    const url = this.buildUrl()
    const urlCopiedButtonBsStyle = urlCopied === url ? 'success' : 'default'
    const textareaStyle = {
      width: 100 + '%',
      borderRadius: 3,
      marginBottom: 5
    }
    const textareaLabelStyle = {
      marginBottom: 0
    }

    return (
      <div>
        <WellOptionsChoosen
          urlOptions={urlOptions}
          includeDataFromSynonyms={includeDataFromSynonyms}
          oneRowPerRelation={oneRowPerRelation} />
        <Well
          bsSize='small'>
          <b>
            So geht`s
          </b>
          <ul>
            <li>Die URL wurde generiert.</li>
            <li>
              <strong>
                <a href='#'
                  onClick={this.copyUrl.bind(this, url)}>
                  Kopieren Sie sie...
                </a>
              </strong>
            </li>
            <li>
              <strong>
                ...um sie im Artenlistentool einzufügen
              </strong>
            </li>
          </ul>
        </Well>
        <div>
          <p
            style={textareaLabelStyle}>
            <strong>
              URL
            </strong>
          </p>
          <Textarea
            defaultValue={url}
            style={textareaStyle} />
        </div>
        <CopyToClipboard
          text={url}
          onCopy={this.copyUrl.bind(this, url)}>
          <Button
            bsStyle={urlCopiedButtonBsStyle}>
            {
              urlCopied === url
              ? 'URL kopiert'
              : 'URL kopieren'
            }
          </Button>
        </CopyToClipboard>
      </div>
    )
  }
})
