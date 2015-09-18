'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Accordion, Panel, Input } from 'react-bootstrap'
import _ from 'lodash'

export default React.createClass({
  displayName: 'FilterFieldsTaxonomy',

  propTypes: {
    taxonomyFields: React.PropTypes.object,
    pcFields: React.PropTypes.object,
    relationFields: React.PropTypes.object,
    exportFilters: React.PropTypes.object,
    onChangeFilterField: React.PropTypes.func
  },

  onChange (fName, event) {
    const { onChangeFilterField } = this.props
    onChangeFilterField(fName, event)
  },

  render () {
    const { taxonomyFields, pcFields, relationFields, exportFilters } = this.props

    const collections = Object.keys(taxonomyFields).map((cNameKey, cIndex) => {
      const cNameObject = taxonomyFields[cNameKey]
      let collection = []
      const title = <h5>cNameKey</h5>
      collection.push(title)
      const fields = Object.keys(cNameObject).map((fNameKey, fIndex) => {
        const fNameKeyObject = cNameObject[fNameKey]
        return (
          <Input
            key={fIndex}
            type={fNameKeyObject.fType}
            label={fNameKey}
            bsSize='small'
            className={'controls'}
            onChange={this.onChange.bind(this, fNameKey)} />
        )
      })
      collection.push(fields)
      return (
        <div key={cIndex}>
          {collection}
        </div>
      )
    })

    return (
      <div>
        <h3>Taxonomie</h3>
        {collections}
      </div>
    )
  }
})
