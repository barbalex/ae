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
import getPathFromGuid from '../../modules/getPathFromGuid.js'

export default React.createClass({
  displayName: 'Filter',

  /*getInitialState () {
    return {
      value: 'initial value'
    }
  },*/

  propTypes: {
    options: React.PropTypes.array,
    loadingFilterOptions: React.PropTypes.bool/*,
    value: React.PropTypes.string*/
  },

  onClickEmptyFilterField () {
    console.log('filter.js: clicked remove')
    /*this.setState({
      value: 'empty'
    })*/
    this.refs.typeahead.focus()
  },

  onSelectObject (result) {
    const guid = result.value
    // const label = result.label

    app.Actions.loadActiveObjectStore(guid)
    getPathFromGuid(guid)
      .then(function (result) {
        const path = result.path
        app.Actions.loadActivePathStore(path, guid)
      })
      .catch(function (error) {
        console.log('filter.js: error getting path for guid ' + guid + ':', error)
      })

    /*this.setState({
      itemFiltered: {
        'value': guid,
        'label': label
      }
    })*/
  },

  render () {
    const { options, loadingFilterOptions } = this.props

    const removeGlyphStyle = {
      fontSize: 13 + 'px',
      position: 'absolute',
      right: 2 + 'px',
      top: 3 + 'px',
      padding: 7 + 'px',
      color: '#333'
    }

    const filterField = (
      <div id='filter'>
        <div style={{position: 'relative'}}>
          <Glyphicon
            glyph={'remove'}
            style={removeGlyphStyle}
            onClick={this.onClickEmptyFilterField}/>
          <Typeahead
            ref={'typeahead'}
            placeholder={loadingFilterOptions ? 'Ergänze Suchindex...' : 'suchen'}
            maxVisible={10}
            options={options}
            filterOption={'label'}
            displayOption={'label'}
            onOptionSelected={this.onSelectObject}
            customClasses={{
              'input': ['form-control'],
              'results': ['list-group'],
              'listItem': ['list-group-item']
            }}/>
        </div>
      </div>
    )

    const loadingIndicator = <p>Lade Suchindex...</p>

    if (loadingFilterOptions && !options) return loadingIndicator
    return filterField
  }
})
