'use strict'

import React from 'react'
import { State, Navigation, RouteHandler } from 'react-router'
import _ from 'lodash'
import Button from 'react-bootstrap/lib/Button'
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup'
import MenuButton from './menu/menuButton'
import ResizeButton from './menu/resizeButton.js'
import Filter from './menu/filter.js'
import FaviconImage from '../../img/aster_144.png'
import Favicon from 'react-favicon'
import Objekt from './main/object/object.js'
import TreeFromHierarchyObject from './menu/tree/treeFromHierarchyObject.js'
import isGuid from '../modules/isGuid.js'

const router = window.router

export default React.createClass({
  displayName: 'Home',

  mixins: [State, Navigation],

  propTypes: {
    gruppe: React.PropTypes.string,
    guid: React.PropTypes.string
  },

  getInitialState () {
    const pathString = this.getParams().splat
    const path = pathString.split('/')
    const gruppe = this.props.gruppe || path[0]
    const lastPathElement = path[path.length - 1]
    const guid = isGuid(lastPathElement) ? lastPathElement : null

    return {
      gruppe: gruppe,
      guid: guid
    }
  },

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
    const pathString = this.getParams().splat
    const path = pathString.split('/')
    const gruppe = path[0]
    const filterableRouteNames = ['Fauna', 'Flora', 'Moose', 'Pilze', 'Lebensräume']
    const isFilterable = _.includes(filterableRouteNames, gruppe)

    // console.log('home.js: activeRoutesNames:', activeRoutesNames)
    // console.log('home.js: isFilterable:', isFilterable)

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
          {isFilterable ? <TreeFromHierarchyObject/> : ''}
        </fieldset>
        {/*this.state.guid ? <Objekt/> : ''*/}
        <Objekt/>
        {/*<RouteHandler/>*/}
      </div>
    )
  }
})
