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

const Home = React.createClass({
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
    if (!window.pathStore || window.pathStore.path.length === 0) app.Actions.loadPathStore(path)
    if (pathEndsWithGuid) app.Actions.loadActiveObjectStore(guid)  // TODO: if LR load object too
    // above action kicks of objectStore too, so don't do it twice > exclude pathEndsWithGuid
    if (gruppe && !window.objectStore.loaded[gruppe] && !pathEndsWithGuid) app.Actions.loadObjectStore(gruppe)

    return {
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
    const pathEndsWithGuid = isGuid(path[path.length - 1])
    const object = window.activeObjectStore.getItem()

    this.setState({
      path: path,
      pathEndsWithGuid: pathEndsWithGuid,
      object: object
    })
    this.transitionTo('/' + path.join('/'))
    this.forceUpdate()
    // React.render(<Home />, document.body)
  },

  onObjectStoreChange (payload) {
    const { items, hierarchy, groupsLoaded } = payload
    this.setState({
      items: items,
      hierarchy: hierarchy,
      groupsLoaded: groupsLoaded
    })
    // console.log('home.js, onObjectStoreChange, payload', payload)
    // React.render(<Home />, document.body)
  },

  onActiveObjectStoreChange (object, metaData) {
    this.setState({
      gruppe: object.Gruppe,
      object: object
    })
    // update url if path was called only with guid
    const { isGuidPath } = this.state
    if (isGuidPath && _.keys(object).length > 0) {
      const pcName = object.Gruppe === 'Lebensräume' ? 'Lebensräume_CH_Delarze_(2008)_Allgemeine_Umgebung_(Areale)' : object.Taxonomie.Name
      const path = getPathFromGuid(object._id, object, metaData[pcName]).path
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

  render () {
    const { hierarchy, gruppe, isGuidPath, pathEndsWithGuid, guid, path, items, object } = this.state
    const isGroup = _.includes(gruppen, gruppe)
    const showFilter = _.keys(items).length > 0
    const showTree = isGroup || isGuidPath || _.keys(items).length > 0
    const showObject = pathEndsWithGuid || _.keys(object).length > 0

    // console.log('home.js, render: pathEndsWithGuid', pathEndsWithGuid)
    // console.log('home.js, render: showObject', showObject)
    // console.log('home.js, render: _.keys(object).length', _.keys(object).length)
    // console.log('home.js, render: object', object)

    return (
      <div>
        <Favicon url={[FaviconImage]}/>
        <div id='menu' className='menu'>
          <div id='menuLine'>
            <MenuButton object={object} />
            <ResizeButton />
          </div>
          {createGruppen(this)}
          {showFilter ? <Filter items={items} /> : ''}
          {showTree ? <TreeFromHierarchyObject hierarchy={hierarchy} gruppe={gruppe} guid={guid} isGuidPath={isGuidPath} path={path} /> : ''}
        </div>
        {showObject ? <Objekt object={object} items={items} /> : ''}
      </div>
    )
  }
})

export default Home
