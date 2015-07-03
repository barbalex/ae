/*
 * gets all objects
 * builds an array of objects needed by the filter component to create the list of filterable objects
 * returns the filter component
 */
'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Typeahead } from 'react-typeahead'
import { State, Navigation } from 'react-router'
import { Glyphicon } from 'react-bootstrap'
import _ from 'lodash'
import getPathFromGuid from '../../modules/getPathFromGuid.js'
// import Home from '../home.js'

export default React.createClass({
  displayName: 'Filter',

  mixins: [State, Navigation],

  propTypes: {
    items: React.PropTypes.object
  },

  getInitialState () {
    const items = this.props.items

    console.log('filter.js, getInitialState: this.props.items', this.props.items)

    return {
      items: items
    }
  },

  onClickRemove () {
    console.log('filter.js: clicked remove')
    // this.forceUpdate()
    React.findDOMNode(this.refs.typeahead).focus()
  },

  filter (result) {
    const guid = result.value
    const url = getPathFromGuid(guid)
    app.Actions.loadActiveItemStore(guid)
    window.router.transitionTo(url)
    // TODO: get tree to render
    // this.forceUpdate()
    // React.render(<Home />, document.body)
  },

  render () {
    console.log('filter.js, render: this.state.items', this.state.items)
    const items = this.state.items
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

    console.log('filter.js, render: options', options)

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
          <Glyphicon glyph={'remove'} style={removeGlyphStyle} onClick={this.onClickRemove}/>
          <Typeahead
            ref={'typeahead'}
            placeholder={'filtern'}
            maxVisible={10}
            options={options}
            filterOption={'label'}
            displayOption={'label'}
            onOptionSelected={this.filter}
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
