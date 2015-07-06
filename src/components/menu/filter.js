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
import _ from 'lodash'
import getPathFromGuid from '../../modules/getPathFromGuid.js'

export default React.createClass({
  displayName: 'Filter',

  propTypes: {
    items: React.PropTypes.object
  },

  onClickEmptyFilterField () {
    console.log('filter.js: clicked remove')
    // this.forceUpdate()
    React.findDOMNode(this.refs.typeahead).focus()
  },

  onSelectObject (result) {
    const guid = result.value
    const path = getPathFromGuid(guid).path
    app.Actions.loadActiveObjectStore(guid)
    app.Actions.loadPathStore(path)
  },

  render () {
    const { items } = this.props
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
          <Glyphicon glyph={'remove'} style={removeGlyphStyle} onClick={this.onClickEmptyFilterField}/>
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
          }}/>
        </div>
      </div>
    )
  }
})
