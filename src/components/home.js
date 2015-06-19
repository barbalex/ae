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

const gruppen = ['Fauna', 'Flora', 'Moose', 'Pilze', 'Lebensräume']

function button (that, gruppe) {
  return <Button key={gruppe} bsStyle='primary' onClick={that.onClickGruppe.bind(that, gruppe)}>{gruppe}</Button>
}

function createButtons (that) {
  const groupsNotLoaded = _.difference(gruppen, that.state.groupsLoaded)
  return _.map(groupsNotLoaded, function (gruppe) {
    return button(that, gruppe)
  })
}

export default React.createClass({
  displayName: 'Home',

  mixins: [ListenerMixin, State, Navigation],

  propTypes: {
    gruppe: React.PropTypes.string,
    groupsLoaded: React.PropTypes.array
  },

  getInitialState () {
    const pathString = this.getParams().splat
    const path = pathString.split('/')
    const gruppe = path[0]
    const groupsLoaded = window.objectStore.getGroupsLoaded()
    groupsLoaded.push(gruppe)

    const state = {
      gruppe: gruppe,
      groupsLoaded: groupsLoaded
    }

    console.log('home.js getInitialState: state', state)

    return state
  },

  componentDidMount () {
    setTreeHeight()
    window.addEventListener('resize', setTreeHeight())
    if (!window.objectStore.loaded[this.state.gruppe]) app.Actions.loadObjectStore(this.state.gruppe)
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
    // console.log('home.js: clicked gruppe', gruppe)
    // console.log('home.js, onClickGruppe: loading', !window.objectStore.loaded[gruppe])
    const groupsLoaded = this.state.groupsLoaded
    groupsLoaded.push(gruppe)
    this.setState({
      gruppe: gruppe,
      groupsLoaded: groupsLoaded
    })
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
    const isFilterable = _.includes(gruppen, gruppe)

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
              {createButtons(this)}
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
