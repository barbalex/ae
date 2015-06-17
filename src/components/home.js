'use strict'

import React from 'react'
import { State, Navigation, RouteHandler } from 'react-router'
import _ from 'lodash'
import Button from 'react-bootstrap/lib/Button'
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup'
import MenuButton from './menu/menuButton'
import ResizeButton from './menu/resizeButton.js'
import Filter from './menu/filter.js'
import FaunaTreeLevel1 from './menu/tree/faunaL1Klassen.js'
import FaviconImage from '../../img/aster_144.png'
import Favicon from 'react-favicon'
import Objekt from './main/object/object.js'

export default React.createClass({
  displayName: 'Home',

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
        <Favicon url={[FaviconImage]}/>
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
        <Objekt/>
        {/*<RouteHandler/>*/}
      </div>
    )
  }
})
