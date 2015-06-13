'use strict'

import React from 'react'
import { State, Navigation } from 'react-router'
import Button from 'react-bootstrap/lib/Button'
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup'
import _ from 'lodash'
import MenuButton from './menuButton'
import ResizeButton from './resizeButton.js'
import Filter from './filter.js'
import FaunaTreeLevel1 from './tree/faunaLevel1.js'

export default React.createClass({
  displayName: 'Menu',

  mixins: [State, Navigation],

  showFauna () {
    window.router.transitionTo(`/Fauna`)
  },

  showFlora () {
    console.log('showFlora clicked')
    // TODO
  },

  showMoose () {
    console.log('showMoose clicked')
    // TODO
  },

  showPilze () {
    console.log('showPilze clicked')
    // TODO
  },

  showLr () {
    console.log('showLr clicked')
    // TODO
  },

  render () {
    // find out if Filter shall be shown
    const activeRoutes = this.getRoutes()
    const activeRoutesNames = _.pluck(activeRoutes, 'name')
    const filterableRouteNames = ['fauna', 'flora', 'moose', 'pilze', 'lr']
    const activeFilterableRouteNames = _.intersection(activeRoutesNames, filterableRouteNames)
    const isFilterable = activeFilterableRouteNames.length > 0
    return (
      <div>
        <MenuButton/>
        <fieldset id='menu' className='menu'>
          <div>
            <ResizeButton/>
            <div id='menu-div'>
              <div id='gruppeLabel'>Gruppe wählen:</div>
            </div>
            <ButtonGroup>
              <Button bsStyle='primary' onClick={this.showFauna}>Fauna</Button>
              <Button bsStyle='primary' onClick={this.showFlora}>Flora</Button>
              <Button bsStyle='primary' onClick={this.showMoose}>Moose</Button>
              <Button bsStyle='primary' onClick={this.showPilze}>Pilze</Button>
              <Button bsStyle='primary' onClick={this.showLr}>Lebensräume</Button>
            </ButtonGroup>
          </div>
          {isFilterable ? <Filter/> : ''}
          {this.isActive('fauna') ? <FaunaTreeLevel1/> : ''}
        </fieldset>
      </div>
    )
  }
})
