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
import getPathFromGuid from '../modules/getPathFromGuid.js'
import getObjectFromPath from '../modules/getObjectFromPath.js'

const gruppen = ['Fauna', 'Flora', 'Moose', 'Macromycetes', 'Lebensräume']

const Home = React.createClass({
  displayName: 'Home',

  mixins: [ListenerMixin, State, Navigation],

  propTypes: {
    hierarchy: React.PropTypes.object,
    gruppe: React.PropTypes.string,
    groupsLoaded: React.PropTypes.array,
    isGuidPath: React.PropTypes.bool,
    path: React.PropTypes.array,
    items: React.PropTypes.object,
    object: React.PropTypes.object
  },

  getInitialState () {
    const pathString = this.getParams().splat
    const path = pathString ? pathString.split('/') : []
    // guidPath is when only a guid is contained in url
    const isGuidPath = path.length === 1 && isGuid(path[0])
    const gruppe = isGuidPath ? null : (path[0] ? path[0] : null)
    const object = getObjectFromPath(path)
    const isObjectPath = object !== undefined
    const hierarchy = window.objectStore.getHierarchy()
    const groupsLoaded = window.objectStore.getGroupsLoaded()
    const items = window.objectStore.getItems()

    console.log('home.js, getInitialState, window.activeObjectStore.getItem()', window.activeObjectStore.getItem())
    console.log('home.js, getInitialState, getObjectFromPath(path)', getObjectFromPath(path))
    console.log('home.js, getInitialState, isGuidPath', isGuidPath)

    // kick off stores
    if (isGuidPath) {
      app.Actions.loadActiveObjectStore(path[0])
    } else if (!window.pathStore || window.pathStore.path.length === 0) {
      app.Actions.loadPathStore(path)
    }
    if (isObjectPath) app.Actions.loadActiveObjectStore(object._id)
    // above action kicks of objectStore too, so don't do it twice > exclude isObjectPath
    if (gruppe && !window.objectStore.loaded[gruppe] && !isObjectPath) app.Actions.loadObjectStore(gruppe)

    return {
      hierarchy: hierarchy,
      gruppe: gruppe,
      groupsLoaded: groupsLoaded,
      isGuidPath: isGuidPath,
      path: path,
      items: items,
      object: object
    }
  },

  componentDidMount () {
    // listen to stores
    this.listenTo(window.pathStore, this.onPathStoreChange)
    this.listenTo(window.objectStore, this.onObjectStoreChange)
    this.listenTo(window.activeObjectStore, this.onActiveObjectStoreChange)
  },

  componentWillUnmount () {
    window.removeEventListener('resize')
  },

  onPathStoreChange (path) {
    const object = getObjectFromPath(path)

    console.log('home.js, onPathStoreChange, getObjectFromPath(path)', getObjectFromPath(path))

    this.setState({
      path: path,
      object: object
    })
    this.transitionTo('/' + path.join('/'))
    this.forceUpdate()
    // React.render(<Home />, document.body)
  },

  onObjectStoreChange (payload) {
    const { items, hierarchy, groupsLoaded } = payload
    const object = getObjectFromPath(this.state.path)
    this.setState({
      items: items,
      hierarchy: hierarchy,
      groupsLoaded: groupsLoaded,
      object: object
    })
    // console.log('home.js, onObjectStoreChange, payload', payload)
    // React.render(<Home />, document.body)
  },

  onActiveObjectStoreChange (object) {
    this.setState({
      gruppe: object.Gruppe,
      object: object
    })
    // update url if path was called only with guid
    const { isGuidPath } = this.state
    if (isGuidPath && object._id) {
      const path = getPathFromGuid(object._id, object).path
      console.log('home.js, onActiveObjectStoreChange, object', object)
      console.log('home.js, onActiveObjectStoreChange, path', path)
      app.Actions.loadPathStore(path)
    }
    // React.render(<Home />, document.body)
  },

  onClickGruppe (gruppe) {
    this.setState({
      gruppe: gruppe
    })
    app.Actions.loadObjectStore(gruppe)
  },

  createGruppen () {
    const that = this
    const groupsNotLoaded = _.difference(gruppen, that.state.groupsLoaded)
    if (groupsNotLoaded.length > 0) {
      return (
        <div id='groups'>
          <div id='groupCheckboxesTitle'>Gruppen laden:</div>
          <div id='groupCheckboxes'>
            {this.createButtons()}
          </div>
        </div>
      )
    }
  },

  createButtons () {
    const that = this
    const groupsNotLoaded = _.difference(gruppen, that.state.groupsLoaded)
    return _.map(groupsNotLoaded, function (gruppe) {
      return that.button(gruppe)
    })
  },

  button (gruppe) {
    const that = this
    const label = gruppe.replace('Macromycetes', 'Pilze')
    return <Input key={gruppe} type='checkbox' label={label} onClick={that.onClickGruppe.bind(that, gruppe)} />
  },

  render () {
    const { hierarchy, gruppe, isGuidPath, path, items, object } = this.state
    const isGroup = _.includes(gruppen, gruppe)
    const showFilter = _.keys(items).length > 0
    const showTree = isGroup || isGuidPath || _.keys(items).length > 0
    const showObject = object !== undefined

    // console.log('home.js, render: showObject', showObject)
    // console.log('home.js, render: _.keys(object).length', _.keys(object).length)
    console.log('home.js, render: object', object)

    return (
      <div>
        <Favicon url={[FaviconImage]}/>
        <div id='menu' className='menu'>
          <div id='menuLine'>
            <MenuButton object={object} />
            <ResizeButton />
          </div>
          {this.createGruppen()}
          {showFilter ? <Filter items={items} /> : ''}
          {showTree ? <TreeFromHierarchyObject hierarchy={hierarchy} gruppe={gruppe} object={object} isGuidPath={isGuidPath} path={path} /> : ''}
        </div>
        {showObject ? <Objekt object={object} items={items} /> : ''}
      </div>
    )
  }
})

export default Home
