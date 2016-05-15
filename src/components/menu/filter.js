/*
 * gets all objects
 * builds an array of objects needed by the filter component to create the list of filterable objects
 * returns the filter component
 */
'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Typeahead } from 'react-typeahead'
import { Glyphicon } from 'react-bootstrap'

export default React.createClass({
  displayName: 'Filter',

  propTypes: {
    filterOptions: React.PropTypes.array,
    loadingFilterOptions: React.PropTypes.bool
  },

  onClickEmptyFilterField() {
    this.refs.typeahead.focus()
    this.refs.typeahead.setState({
      entryValue: '',
      selection: null,
      selectionIndex: null,
      visible: []
    })
  },

  onSelectObject(result) {
    const guid = result.value
    app.Actions.loadActiveObject(guid)
    this.emptyInTenSeconds()
  },

  emptyInTenSeconds() {
    setTimeout(() => {
      this.refs.typeahead.setState({
        entryValue: '',
        selection: null,
        selectionIndex: null,
        visible: []
      })
    }, 10000)
  },

  render() {
    const { filterOptions, loadingFilterOptions } = this.props

    const removeGlyphStyle = {
      fontSize: 13,
      position: 'absolute',
      right: 2,
      top: 3,
      padding: 7,
      color: '#333',
      cursor: 'pointer'
    }

    const filterField = (
      <div id="filter">
        <div style={{ position: 'relative' }}>
          <Glyphicon
            glyph="remove"
            style={removeGlyphStyle}
            onClick={this.onClickEmptyFilterField}
          />
          <Typeahead
            ref="typeahead"
            placeholder={loadingFilterOptions ? 'Ergänze Suchindex...' : 'suchen'}
            maxVisible={10}
            options={filterOptions}
            filterOption={'label'}
            displayOption={'label'}
            onOptionSelected={this.onSelectObject}
            customClasses={{
              input: ['form-control'],
              results: ['list-group'],
              listItem: ['list-group-item']
            }}
          />
        </div>
      </div>
    )

    const loadingIndicator = <p>Lade Suchindex...</p>

    if (loadingFilterOptions && !filterOptions) return loadingIndicator
    return filterField
  }
})
