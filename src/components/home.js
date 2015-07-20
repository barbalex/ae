'use strict'

import app from 'ampersand-app'
import { ListenerMixin } from 'reflux'
import React from 'react'
import { Input } from 'react-bootstrap'
import _ from 'lodash'
import MenuButton from './menu/menuButton'
import ResizeButton from './menu/resizeButton.js'
import Filter from './menu/filter.js'
import FaviconImage from '../../img/aster_144.png'
import Favicon from 'react-favicon'
import Objekt from './main/object/object.js'
import TreeFromHierarchyObject from './menu/treeFromHierarchyObject.js'
import getPathFromGuid from '../modules/getPathFromGuid.js'
import getGruppen from '../modules/gruppen.js'
import NavHelper from '../components/navHelper.js'
import kickOffStores from '../modules/kickOffStores.js'

const gruppen = getGruppen()

const Home = React.createClass({
  displayName: 'Home',

  mixins: [ListenerMixin],

  propTypes: {
    hierarchy: React.PropTypes.object,
    gruppe: React.PropTypes.string,
    groupsLoadedOrLoading: React.PropTypes.array,
    groupsLoading: React.PropTypes.array,
    allGroupsLoaded: React.PropTypes.bool,
    isGuidPath: React.PropTypes.bool,
    path: React.PropTypes.array,
    items: React.PropTypes.object,
    object: React.PropTypes.object,
    guid: React.PropTypes.string
  },

  getInitialState () {
    const { gruppe, guid, path } = this.props
    // add the gruppe that is being loaded so it's checkbox is never shown
    const groupsLoadedOrLoading = [gruppe]

    // kick off stores by getting store data directly from the remote db
    kickOffStores(path, gruppe, guid)

    return {
      hierarchy: [],
      gruppe: gruppe,
      groupsLoadedOrLoading: groupsLoadedOrLoading,
      groupsLoading: [],
      allGroupsLoaded: false,
      path: path,
      items: {},
      object: undefined,
      guid: guid
    }
  },

  componentDidMount () {
    // listen to stores
    this.listenTo(app.activePathStore, this.onPathStoreChange)
    this.listenTo(app.objectStore, this.onObjectStoreChange)
    this.listenTo(app.activeObjectStore, this.onActiveObjectStoreChange)
  },

  componentWillUnmount () {
    window.removeEventListener('resize')
  },

  onPathStoreChange (path, guid) {
    this.setState({
      path: path,
      guid: guid
    })
    const url = '/' + path.join('/') + (guid ? '?id=' + guid : '')
    app.router.navigate(url)
  },

  onObjectStoreChange (payload) {
    const { items, hierarchy, groupsLoaded, groupsLoading } = payload
    // add groups loading to groups loaded to hide the group checkbox of the loading group
    const groupsLoadedOrLoading = _.union(groupsLoaded, groupsLoading)
    const groupsNotLoaded = _.difference(gruppen, groupsLoadedOrLoading)
    const allGroupsLoaded = groupsNotLoaded.length === 0

    this.setState({
      items: items,
      hierarchy: hierarchy,
      groupsLoadedOrLoading: groupsLoadedOrLoading,
      groupsLoading: groupsLoading,
      allGroupsLoaded: allGroupsLoaded
    })
  },

  onActiveObjectStoreChange (object) {
    // console.log('home.js, onActiveObjectStoreChange, object', object)
    const guid = object._id
    this.setState({
      gruppe: object.Gruppe,
      object: object,
      guid: guid
    })
    // update url if path was called only with guid
    if (this.props.isGuidPath && guid) {
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
    const groupsLoadedOrLoading = this.state.groupsLoadedOrLoading
    const groupsNotLoaded = _.difference(gruppen, groupsLoadedOrLoading)
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
    const groupsLoadedOrLoading = this.state.groupsLoadedOrLoading
    const groupsNotLoaded = _.difference(gruppen, groupsLoadedOrLoading)
    return _.map(groupsNotLoaded, function (gruppe) {
      return that.button(gruppe)
    })
  },

  button (gruppe) {
    const label = gruppe.replace('Macromycetes', 'Pilze')
    return <Input key={gruppe} type='checkbox' label={label} onClick={this.onClickGruppe.bind(this, gruppe)} />
  },

  render () {
    const { hierarchy, gruppe, path, items, object, groupsLoading, allGroupsLoaded } = this.state
    const { isGuidPath } = this.props
    const isGroup = _.includes(gruppen, gruppe)
    const showFilter = _.keys(items).length > 0
    const showTree = isGroup || isGuidPath || _.keys(items).length > 0
    const showObject = object !== undefined
    // console.log('home.js, render: path', path)

    // MenuButton needs NOT to be inside menu
    // otherwise the menu can't be shown outside when menu is short
    return (
      <NavHelper>
        <Favicon url={[FaviconImage]}/>
        <MenuButton object={object} />
        <div id='menu' className='menu'>
          <div id='menuLine'>
            <ResizeButton />
          </div>
          {this.createGruppen()}
          {showFilter ? <Filter items={items} /> : ''}
          {showTree ? <TreeFromHierarchyObject hierarchy={hierarchy} groupsLoading={groupsLoading} allGroupsLoaded={allGroupsLoaded} object={object} isGuidPath={isGuidPath} path={path} /> : ''}
        </div>
        {showObject ? <Objekt object={object} items={items} /> : ''}
      </NavHelper>
    )
  }
})

export default Home
