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
    synonymObjects: React.PropTypes.array,
    object: React.PropTypes.object,
    guid: React.PropTypes.string,
    options: React.PropTypes.array
  },

  getInitialState () {
    const { gruppe, guid, path } = this.props
    const groupsLoadedOrLoading = gruppe ? [gruppe] : []

    // kick off stores by getting store data directly from the remote db
    kickOffStores(path, gruppe, guid)

    return {
      hierarchy: [],
      groupsLoadedOrLoading: groupsLoadedOrLoading,
      groupsLoading: [],
      allGroupsLoaded: false,
      path: path,
      synonymObjects: [],
      object: undefined,
      guid: guid,
      options: []
    }
  },

  componentDidMount () {
    // listen to stores
    this.listenTo(app.activePathStore, this.onPathStoreChange)
    this.listenTo(app.objectStore, this.onObjectStoreChange)
    this.listenTo(app.activeObjectStore, this.onActiveObjectStoreChange)
    this.listenTo(app.filterOptionsStore, this.onFilterOptionsStoreChange)
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
    const { hierarchy, groupsLoaded } = payload

    const groupsLoading = app.objectStore.groupsLoading
    // add groups loading to groups loaded to hide the group checkbox of the loading group
    const groupsLoadedOrLoading = _.union(groupsLoaded, groupsLoading)
    const groupsNotLoaded = _.difference(gruppen, groupsLoadedOrLoading)
    const allGroupsLoaded = groupsNotLoaded.length === 0

    // console.log('home.js, onObjectStoreChange, payload', payload)

    this.setState({
      hierarchy: hierarchy || this.state.hierarchy,
      groupsLoadedOrLoading: groupsLoadedOrLoading,
      groupsLoading: groupsLoading,
      allGroupsLoaded: allGroupsLoaded
    })
  },

  onActiveObjectStoreChange (object, synonymObjects) {
    const guid = object._id
    this.setState({
      object: object,
      guid: guid,
      synonymObjects: synonymObjects
    })
    // update url if path was called only with guid
    if (this.props.isGuidPath && guid) {
      getPathFromGuid(guid, object)
        .then(function (result) {
          const path = result.path
          app.Actions.loadPathStore(path, guid)
        })
        .catch(function (error) {
          console.log('home.js: error getting path for guid ' + guid + ':', error)
        })
    }
  },

  onFilterOptionsStoreChange (options) {
    this.setState({
      options: options
    })
  },

  onClickGruppe (gruppe) {
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
    const { hierarchy, path, synonymObjects, object, groupsLoading, allGroupsLoaded, options } = this.state
    const { isGuidPath } = this.props
    const showFilter = options.length > 0
    const showObject = object !== undefined

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
          {showFilter ? <Filter options={options} /> : ''}
          <TreeFromHierarchyObject hierarchy={hierarchy} groupsLoading={groupsLoading} allGroupsLoaded={allGroupsLoaded} object={object} isGuidPath={isGuidPath} path={path} />
        </div>
        {showObject ? <Objekt object={object} synonymObjects={synonymObjects} /> : ''}
      </NavHelper>
    )
  }
})

export default Home
