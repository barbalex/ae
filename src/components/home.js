'use strict'

import app from 'ampersand-app'
import { ListenerMixin } from 'reflux'
import React from 'react'
import { State, Navigation, RouteHandler } from 'react-router'
import _ from 'lodash'
import Button from 'react-bootstrap/lib/Button'
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup'
import MenuButton from './menu/menuButton'
import ResizeButton from './menu/resizeButton.js'
// import Filter from './menu/filter.js'
import FaviconImage from '../../img/aster_144.png'
import Favicon from 'react-favicon'
import Objekt from './main/object/object.js'
import TreeFromHierarchyObject from './menu/treeFromHierarchyObject.js'
import isGuid from '../modules/isGuid.js'

export default React.createClass({
  displayName: 'Home',

  mixins: [ListenerMixin, State, Navigation],

  propTypes: {
    gruppe: React.PropTypes.string,
    guid: React.PropTypes.string,
    items: React.PropTypes.object,
    hO: React.PropTypes.object
  },

  getInitialState () {
    const pathString = this.getParams().splat
    const path = pathString.split('/')
    const gruppe = this.props.gruppe || path[0]
    const lastPathElement = path[path.length - 1]
    const guid = isGuid(lastPathElement) ? lastPathElement : null
    const hO = window.objectStore.getHierarchyOfGruppe(gruppe)

    return {
      gruppe: gruppe,
      guid: guid,
      hO: hO
    }
  },

  componentDidMount () {
    this.listenTo(window.objectStore, this.onStoreChange)
    // loadObjectStore if necessary
    if (!window.objectStore.loaded[this.state.gruppe]) app.Actions.loadObjectStore(this.state.gruppe)
  },

  onStoreChange (items, hO) {
    this.setState({
      loading: false,
      hO: hO
    })
  },

  onClickGruppe (gruppe) {
    this.setState({ gruppe: gruppe })
    // TODO: only works on first click
    this.transitionTo(`/${gruppe}`)
    // this.getInitialState()
    // this.forceUpdate()
  },

  render () {
    // find out if Filter shall be shown
    const gruppe = this.state.gruppe
    const filterableRouteNames = ['Fauna', 'Flora', 'Moose', 'Pilze', 'Lebensräume']
    const isFilterable = _.includes(filterableRouteNames, gruppe)
    const hO = this.state.hO

    console.log('home.js: gruppe:', gruppe)
    console.log('home.js: isFilterable:', isFilterable)

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
          {/*isFilterable ? <Filter/> : ''*/}
          {isFilterable ? <TreeFromHierarchyObject gruppe={gruppe} hO={hO}/> : ''}
        </fieldset>
        {/*this.state.guid ? <Objekt/> : ''*/}
        <Objekt/>
        {/*<RouteHandler/>*/}
      </div>
    )
  }
})
