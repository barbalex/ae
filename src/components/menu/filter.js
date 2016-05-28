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
import { StyleSheet, css } from 'aphrodite'

const styles = StyleSheet.create({
  filterRootDiv: {
    float: 'left',
    clear: 'both',
    width: '100%',
    marginBottom: 5,
    position: 'relative'
  },
  removeGlyph: {
    fontSize: 13,
    position: 'absolute',
    right: 2,
    top: 3,
    padding: 7,
    color: '#333',
    cursor: 'pointer'
  }
})

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

    if (loadingFilterOptions && !filterOptions) {
      return <p>Lade Suchindex...</p>
    }
    return (
      <div
        id="filter"
        className={css(styles.filterRootDiv)}
      >
        <Glyphicon
          glyph="remove"
          className={css(styles.removeGlyph)}
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
    )
  }
})
