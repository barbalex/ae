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
      itemFiltered: {
        'value': 'A7EDF4A9-9501-46A0-82E1-51CC567EC83F',
        'label': 'Clematis recta L. (Aufrechte Waldrebe)'
      }
    }
  },*/

  propTypes: {
    options: React.PropTypes.array,
    loadingFilterOptions: React.PropTypes.bool/*,
    itemFiltered: React.PropTypes.object*/
  },

  onClickEmptyFilterField () {
    console.log('filter.js: clicked remove')
    /*this.setState({
      itemFiltered: {
        'value': null,
        'label': ''
      }
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
    // const { itemFiltered } = this.state
    // console.log('filter.js, render: options', options)

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
            onClick={this.onClickEmptyFilterField}
          />
          <Typeahead
            ref={'typeahead'}
            placeholder={'filtern'}
            maxVisible={10}
            options={options}
            filterOption={'label'}
            displayOption={'label'}
            onOptionSelected={this.onSelectObject}
            customClasses={{
              'input': ['form-control'],
              'results': ['list-group'],
              'listItem': ['list-group-item']
            }}
          />
        </div>
      </div>
    )

    const loadingIndicator = <p>Lade Filter...</p>

    if (loadingFilterOptions) return loadingIndicator
    return filterField
  }
})
