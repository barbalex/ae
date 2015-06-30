'use strict'

import app from 'ampersand-app'
import { ListenerMixin } from 'reflux'
import React from 'react'
import { State, Navigation } from 'react-router'
import { Input } from 'react-bootstrap'
import _ from 'lodash'
// import Button from 'react-bootstrap/lib/Button'
// import ButtonGroup from 'react-bootstrap/lib/ButtonGroup'
import MenuButton from './menu/menuButton'
import ResizeButton from './menu/resizeButton.js'
import Filter from './menu/filter.js'
import FaviconImage from '../../img/aster_144.png'
import Favicon from 'react-favicon'
import Objekt from './main/object/object.js'
import TreeFromHierarchyObject from './menu/treeFromHierarchyObject.js'
import isGuid from '../modules/isGuid.js'
import setTreeHeight from '../modules/setTreeHeight.js'

const gruppen = ['Fauna', 'Flora', 'Moose', 'Pilze', 'Lebensräume']

function button (that, gruppe) {
  return <Input key={gruppe} type='checkbox' label={gruppe} onClick={that.onClickGruppe.bind(that, gruppe)} />
}

function createButtons (that) {
  const groupsNotLoaded = _.difference(gruppen, that.state.groupsLoaded)
  return _.map(groupsNotLoaded, function (gruppe) {
    return button(that, gruppe)
  })
}

function createGruppen (that) {
  const groupsNotLoaded = _.difference(gruppen, that.state.groupsLoaded)
  if (groupsNotLoaded.length > 0) {
    return (
      <div id='groups'>
        <div id='groupCheckboxesTitle'>Gruppen laden:</div>
        <div id='groupCheckboxes'>
          {createButtons(that)}
        </div>
      </div>
    )
  }
}

export default React.createClass({
  displayName: 'Home',

  mixins: [ListenerMixin, State, Navigation],

  propTypes: {
    gruppe: React.PropTypes.string,
    groupsLoaded: React.PropTypes.array,
    isGuidPath: React.PropTypes.bool
  },

  getInitialState () {
    const pathString = this.getParams().splat
    const path = pathString.split('/')
    // guidPath is when only a guid is contained in url
    const isGuidPath = path.length === 1 && isGuid(path[0])
    const groupsLoaded = window.objectStore.getGroupsLoaded()
    const gruppe = isGuidPath ? null : path[0]  // GET GRUPPE FROM OBJECT
    if (!isGuidPath) groupsLoaded.push(gruppe)

    const state = {
      gruppe: gruppe,
      groupsLoaded: groupsLoaded,
      isGuidPath: isGuidPath
    }

    console.log('home.js getInitialState: state', state)

    return state
  },

  componentDidMount () {
    setTreeHeight()
    window.addEventListener('resize', setTreeHeight())
    if (this.state.gruppe && !window.objectStore.loaded[this.state.gruppe]) app.Actions.loadObjectStore(this.state.gruppe)
  },

  componentWillUnmount () {
    window.removeEventListener('resize')
  },

  onStoreChange (items, hO, gruppe) {
    const groupsLoaded = this.state.groupsLoaded
    groupsLoaded.push(gruppe)
    this.setState({
      groupsLoaded: groupsLoaded
    })
    this.forceUpdate()
  },

  onClickGruppe (gruppe) {
    const groupsLoaded = this.state.groupsLoaded
    groupsLoaded.push(gruppe)
    this.setState({
      gruppe: gruppe,
      groupsLoaded: groupsLoaded
    })
    // load this gruppe if that hasn't happened yet
    if (!window.objectStore.loaded[gruppe]) app.Actions.loadObjectStore(gruppe)
    this.transitionTo(`/${gruppe}`)
    this.forceUpdate()
  },

  render () {
    // find out if Filter shall be shown
    const gruppe = this.state.gruppe
    const isGroup = _.includes(gruppen, gruppe)
    const isGuidPath = this.state.isGuidPath

    console.log('home.js is rendered')

    return (
      <div>
        <Favicon url={[FaviconImage]}/>
        <div id='menu' className='menu'>
          <div id='menuLine'>
            <MenuButton />
            <ResizeButton />
          </div>
          {createGruppen(this)}
          {isGroup ? <Filter /> : ''}
          {isGroup || isGuidPath ? <TreeFromHierarchyObject /> : ''}
        </div>
        <Objekt />
      </div>
    )
  }
})
