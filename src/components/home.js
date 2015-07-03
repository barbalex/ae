'use strict'

import app from 'ampersand-app'
import { ListenerMixin } from 'reflux'
import React from 'react'
import { State, Navigation } from 'react-router'
import { Input } from 'react-bootstrap'
import _ from 'lodash'
import MenuButton from './menu/menuButton'
import ResizeButton from './menu/resizeButton.js'
import Filter from './menu/filter.js'
import FaviconImage from '../../img/aster_144.png'
import Favicon from 'react-favicon'
import Objekt from './main/object/object.js'
import TreeFromHierarchyObject from './menu/treeFromHierarchyObject.js'
import isGuid from '../modules/isGuid.js'
import setTreeHeight from '../modules/setTreeHeight.js'

const gruppen = ['Fauna', 'Flora', 'Moose', 'Macromycetes', 'Lebensräume']

function button (that, gruppe) {
  const label = gruppe.replace('Macromycetes', 'Pilze')
  return <Input key={gruppe} type='checkbox' label={label} onClick={that.onClickGruppe.bind(that, gruppe)} />
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
    hierarchy: React.PropTypes.object,
    gruppe: React.PropTypes.string,
    groupsLoaded: React.PropTypes.array,
    isGuidPath: React.PropTypes.bool,
    pathEndsWithGuid: React.PropTypes.bool,
    path: React.PropTypes.array,
    items: React.PropTypes.object,
    object: React.PropTypes.object,
    guid: React.PropTypes.string
  },

  getInitialState () {
    const pathString = this.getParams().splat
    const path = pathString ? pathString.split('/') : []
    // guidPath is when only a guid is contained in url
    const isGuidPath = path.length === 1 && isGuid(path[0])
    const gruppe = isGuidPath ? null : (path[0] ? path[0] : null)
    const pathEndsWithGuid = isGuid(path[path.length - 1])
    const guid = pathEndsWithGuid ? path[path.length - 1] : null
    const object = window.activeObjectStore.getItem()
    const hierarchy = isGuidPath ? null : window.objectStore.getHierarchy()
    const groupsLoaded = window.objectStore.getGroupsLoaded()
    const items = window.objectStore.getItems()

    // kick off stores
    if (pathEndsWithGuid) app.Actions.loadActiveObjectStore(guid)
    // above action kicks of objectStore too, so don't do it twice > exclude pathEndsWithGuid
    if (gruppe && !window.objectStore.loaded[gruppe] && !pathEndsWithGuid) app.Actions.loadObjectStore(gruppe)

    const state = {
      hierarchy: hierarchy,
      gruppe: gruppe,
      groupsLoaded,
      isGuidPath: isGuidPath,
      pathEndsWithGuid: pathEndsWithGuid,
      path: path,
      items: items,
      object: object,
      guid: guid
    }

    console.log('home.js getInitialState: state', state)

    return state
  },

  componentDidMount () {
    setTreeHeight()
    window.addEventListener('resize', setTreeHeight())
    this.listenTo(window.pathStore, this.onPathStoreChange)
    this.listenTo(window.objectStore, this.onObjectStoreChange)
    this.listenTo(window.activeObjectStore, this.onActiveObjectStoreChange)
  },

  componentWillUnmount () {
    window.removeEventListener('resize')
  },

  onPathStoreChange (path) {
    console.log('home.js onPathStoreChange: path:', path)
    this.setState({
      path: path
    })
    this.transitionTo('/' + path.join('/'))
    this.forceUpdate()
  },

  onObjectStoreChange (payload) {
    // console.log('home.js onObjectStoreChange: payload:', payload)
    const { items, hierarchy, groupsLoaded } = payload
    this.setState({
      items: items,
      hierarchy: hierarchy,
      groupsLoaded: groupsLoaded
    })
    this.forceUpdate()
  },

  onActiveObjectStoreChange (object) {
    // object can be a real object or empty
    // console.log('home.js onActiveObjectStoreChange: object:', object)
    // change state of all elements that can have changed
    const guid = object._id || null
    const gruppe = object.Gruppe ? object.Gruppe : this.state.gruppe

    this.setState({
      gruppe: gruppe,
      object: object,
      guid: guid
    })
  },

  onClickGruppe (gruppe) {
    const path = [gruppe]
    const groupsLoaded = window.objectStore.getGroupsLoaded()
    this.setState({
      gruppe: gruppe,
      path: path,
      groupsLoaded: groupsLoaded
    })
    // load this gruppe if that hasn't happened yet
    if (!window.objectStore.isGroupLoaded(gruppe)) app.Actions.loadObjectStore(gruppe)
    app.Actions.loadPathStore(path)
  },

  render () {
    // find out if Filter shall be shown
    const { hierarchy, gruppe, isGuidPath, pathEndsWithGuid, guid, path, items, object } = this.state
    console.log('home.js, render: gruppen', gruppen)
    console.log('home.js, render: gruppe', gruppe)
    const isGroup = _.includes(gruppen, gruppe)

    console.log('home.js, render: isGroup', isGroup)

    return (
      <div>
        <Favicon url={[FaviconImage]}/>
        <div id='menu' className='menu'>
          <div id='menuLine'>
            <MenuButton />
            <ResizeButton />
          </div>
          {createGruppen(this)}
          {isGroup ? <Filter items={items} /> : ''}
          {isGroup || isGuidPath ? <TreeFromHierarchyObject hierarchy={hierarchy} gruppe={gruppe} guid={guid} isGuidPath={isGuidPath} path={path} /> : ''}
        </div>
        {pathEndsWithGuid ? <Objekt object={object} /> : ''}
      </div>
    )
  }
})
