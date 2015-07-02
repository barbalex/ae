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
    isGuidPath: React.PropTypes.bool,
    guid: React.PropTypes.string,
    path: React.PropTypes.array
  },

  getInitialState () {
    const pathString = this.getParams().splat
    const path = pathString.split('/')
    // guidPath is when only a guid is contained in url
    const isGuidPath = path.length === 1 && isGuid(path[0])
    const groupsLoaded = window.objectStore.getGroupsLoaded()
    const gruppe = isGuidPath ? null : path[0]
    if (!isGuidPath) groupsLoaded.push(gruppe)
    const pathEndsWithGuid = isGuid(path[path.length - 1])
    const guid = pathEndsWithGuid ? path[path.length - 1] : null
    if (isGuidPath) app.Actions.loadActiveItemStore(guid)

    const state = {
      gruppe: gruppe,
      groupsLoaded: groupsLoaded,
      isGuidPath: isGuidPath,
      guid: guid,
      path: path
    }

    console.log('home.js getInitialState: state', state)

    return state
  },

  componentDidMount () {
    const gruppe = this.state.gruppe
    const guid = this.state.guid

    setTreeHeight()
    window.addEventListener('resize', setTreeHeight())
    if (gruppe && !window.objectStore.loaded[gruppe]) app.Actions.loadObjectStore(gruppe)
    if (guid) app.Actions.loadActiveObjectStore(guid)
    this.listenTo(window.objectStore, this.onObjectStoreChange)
    this.listenTo(window.activeObjectStore, this.onActiveObjectStoreChange)
  },

  componentWillUnmount () {
    window.removeEventListener('resize')
  },

  onObjectStoreChange (items, hO, gruppe) {
    const groupsLoaded = this.state.groupsLoaded
    groupsLoaded.push(gruppe)
    this.setState({
      groupsLoaded: groupsLoaded
    })
    this.forceUpdate()
  },

  onActiveObjectStoreChange (object) {
    this.setState({
      guid: object._id ? object._id : null
    })
    this.forceUpdate()
  },

  onClickGruppe (gruppe) {
    const groupsLoaded = this.state.groupsLoaded.push(gruppe)
    const path = [gruppe]
    this.setState({
      gruppe: gruppe,
      groupsLoaded: groupsLoaded,
      path: path
    })
    // load this gruppe if that hasn't happened yet
    if (!window.objectStore.loaded[gruppe]) app.Actions.loadObjectStore(gruppe)
    this.transitionTo(`/${gruppe}`)
    this.forceUpdate()
  },

  render () {
    // find out if Filter shall be shown
    const { gruppe, isGuidPath, guid, path } = this.state
    const isGroup = _.includes(gruppen, gruppe)

    console.log('home.js, render')

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
          {isGroup || isGuidPath ? <TreeFromHierarchyObject gruppe={gruppe} guid={guid} isGuidPath={isGuidPath} path={path} /> : ''}
        </div>
        <Objekt guid={guid} />
      </div>
    )
  }
})
