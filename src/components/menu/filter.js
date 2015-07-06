/*
 * gets all objects
 * builds an array of objects needed by the filter component to create the list of filterable objects
 * returns the filter component
 */
'use strict'

import app from 'ampersand-app'
import React from 'react'
import { State } from 'react-router'
import { Typeahead } from 'react-typeahead'
import { Glyphicon } from 'react-bootstrap'
import _ from 'lodash'
import getPathFromGuid from '../../modules/getPathFromGuid.js'

export default React.createClass({
  displayName: 'Filter',

  mixins: [State],

  getInitialState () {
    return {
      itemFiltered: {
        'value': 'A7EDF4A9-9501-46A0-82E1-51CC567EC83F',
        'label': 'Clematis recta L. (Aufrechte Waldrebe)'
      }
    }
  },

  propTypes: {
    items: React.PropTypes.object,
    itemFiltered: React.PropTypes.object
  },

  onClickEmptyFilterField () {
    console.log('filter.js: clicked remove')
    this.setState({
      itemFiltered: {
        'value': null,
        'label': ''
      }
    })
    this.refs.typeahead.focus()
  },

  onSelectObject (result) {
    const guid = result.value
    const label = result.label
    const path = getPathFromGuid(guid).path

    app.Actions.loadActiveObjectStore(guid)
    app.Actions.loadPathStore(path)

    this.setState({
      itemFiltered: {
        'value': guid,
        'label': label
      }
    })
  },

  render () {
    const { items } = this.props
    const { itemFiltered } = this.state
    const itemsArray = _.values(items)

    const options = _.map(itemsArray, function (object) {
      // make sure every object has a name
      if (object.Taxonomie && object.Taxonomie.Eigenschaften && object.Taxonomie.Eigenschaften['Artname vollständig']) {
        return {
          'value': object._id,
          'label': object.Taxonomie.Eigenschaften['Artname vollständig']
        }
      }
    })

    const removeGlyphStyle = {
      fontSize: 13 + 'px',
      position: 'absolute',
      right: 2 + 'px',
      top: 3 + 'px',
      padding: 7 + 'px',
      color: '#333'
    }

    return (
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
            inputProps={itemFiltered}
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
  }
})
