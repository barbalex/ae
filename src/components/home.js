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
import getUrlParameterByName from '../modules/getUrlParameterByName.js'
import getGruppen from '../modules/gruppen.js'

const gruppen = getGruppen()

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
    object: React.PropTypes.object,
    guid: React.PropTypes.string
  },

  getInitialState () {
    // this is the enter point of the application
    // > read state from url
    const pathString = this.getParams().splat
    const path = pathString ? pathString.split('/') : []
    // guidPath is when only a guid is contained in url
    const isGuidPath = path.length === 1 && isGuid(path[0])
    const guid = isGuidPath ? path[0] : getUrlParameterByName('id')
    const gruppe = isGuidPath ? null : (path[0] ? path[0] : null)

    /*console.log('home.js, getInitialState, window.activeObjectStore.getItem()', window.activeObjectStore.getItem())
    console.log('home.js, getInitialState, getObjectFromPath(path)', getObjectFromPath(path))
    console.log('home.js, getInitialState, isGuidPath', isGuidPath)*/

    // kick off stores
    if (guid) {
      app.Actions.loadActiveObjectStore(guid)
    } else {
      // loadActiveObjectStore loads objectStore too, so don't do it twice
      if (gruppe) app.Actions.loadObjectStore(gruppe)
    }
    app.Actions.loadPathStore(path, guid)

    return {
      hierarchy: [],
      gruppe: gruppe,
      groupsLoaded: [],
      isGuidPath: isGuidPath,
      path: path,
      items: {},
      object: undefined,
      guid: guid
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

  onPathStoreChange (path, guid) {
    console.log('home.js, onPathStoreChange, path', path)
    console.log('home.js, onPathStoreChange, guid', guid)
    this.setState({
      path: path,
      guid: guid
    })
    const url = '/' + path.join('/') + (guid ? '?id=' + guid : '')
    this.transitionTo(url)
  },

  onObjectStoreChange (payload) {
    const { items, hierarchy, groupsLoaded } = payload
    this.setState({
      items: items,
      hierarchy: hierarchy,
      groupsLoaded: groupsLoaded
    })
  },

  onActiveObjectStoreChange (object) {
    console.log('home.js, onActiveObjectStoreChange, object', object)
    const guid = object._id
    this.setState({
      gruppe: object.Gruppe,
      object: object,
      guid: guid
    })
    // update url if path was called only with guid
    if (this.state.isGuidPath && guid) {
      const path = getPathFromGuid(guid, object).path
      app.Actions.loadPathStore(path, guid)
    }
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
    // console.log('home.js, render: path', path)

    // MenuButton needs NOT to be inside menu
    // otherwise the menu can't be shown outside when menu is short
    return (
      <div>
        <Favicon url={[FaviconImage]}/>
        <MenuButton object={object} />
        <div id='menu' className='menu'>
          <div id='menuLine'>
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
