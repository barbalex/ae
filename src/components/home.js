'use strict'

import app from 'ampersand-app'
import { ListenerMixin } from 'reflux'
import React from 'react'
import { State, Navigation } from 'react-router'
import _ from 'lodash'
import Button from 'react-bootstrap/lib/Button'
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup'
import MenuButton from './menu/menuButton'
import ResizeButton from './menu/resizeButton.js'
import Filter from './menu/filter.js'
import FaviconImage from '../../img/aster_144.png'
import Favicon from 'react-favicon'
import Objekt from './main/object/object.js'
import TreeFromHierarchyObject from './menu/treeFromHierarchyObject.js'
import isGuid from '../modules/isGuid.js'
import setTreeHeight from '../modules/setTreeHeight.js'

export default React.createClass({
  displayName: 'Home',

  mixins: [ListenerMixin, State, Navigation],

  propTypes: {
    gruppe: React.PropTypes.string
  },

  getInitialState () {
    const pathString = this.getParams().splat
    const path = pathString.split('/')
    const gruppe = path[0]

    console.log('home.js getInitialState')

    return {
      gruppe: gruppe
    }
  },

  componentDidMount () {
    setTreeHeight()
    window.addEventListener('resize', setTreeHeight())
  },

  componentWillUnmount () {
    window.removeEventListener('resize')
  },

  onClickGruppe (gruppe) {
    // console.log('home.js: clicked gruppe', gruppe)
    // console.log('home.js, onClickGruppe: loading', !window.objectStore.loaded[gruppe])

    this.setState({ gruppe: gruppe })
    // load this gruppe if that hasn't happened yet
    if (!window.objectStore.loaded[gruppe]) app.Actions.loadObjectStore(gruppe)
    this.transitionTo(`/${gruppe}`)
    // this.render()
    this.forceUpdate()
  },

  render () {
    // find out if Filter shall be shown
    const gruppe = this.state.gruppe
    const pathString = this.getParams().splat
    const path = pathString.split('/')
    const lastPathElement = path[path.length - 1]
    const guid = isGuid(lastPathElement) ? lastPathElement : null
    const filterableRouteNames = ['Fauna', 'Flora', 'Moose', 'Pilze', 'Lebensräume']
    const isFilterable = _.includes(filterableRouteNames, gruppe)

    // console.log('home.js, render: gruppe:', gruppe)
    // console.log('home.js, render: isFilterable:', isFilterable)

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
              <Button bsStyle='primary' onClick={this.onClickGruppe.bind(this, 'Fauna')}>Fauna</Button>
              <Button bsStyle='primary' onClick={this.onClickGruppe.bind(this, 'Flora')}>Flora</Button>
              <Button bsStyle='primary' onClick={this.onClickGruppe.bind(this, 'Moose')}>Moose</Button>
              <Button bsStyle='primary' onClick={this.onClickGruppe.bind(this, 'Pilze')}>Pilze</Button>
              <Button bsStyle='primary' onClick={this.onClickGruppe.bind(this, 'Lebensräume')}>Lebensräume</Button>
            </ButtonGroup>
          </div>
          {isFilterable ? <Filter/> : ''}
          {isFilterable ? <TreeFromHierarchyObject/> : ''}
        </fieldset>
        {guid ? <Objekt/> : ''}
      </div>
    )
  }
})
