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
import Main from './main/main.js'
import TreeFromHierarchyObject from './menu/treeFromHierarchyObject.js'
import getGruppen from '../modules/gruppen.js'
import NavHelper from '../components/navHelper.js'
import kickOffStores from '../modules/kickOffStores.js'
import Login from './main/login.js'

const gruppen = getGruppen()

export default React.createClass({
  displayName: 'Home',

  mixins: [ListenerMixin],

  propTypes: {
    hierarchy: React.PropTypes.object,
    gruppe: React.PropTypes.string,
    groupsLoadedOrLoading: React.PropTypes.array,
    groupsLoadingObjects: React.PropTypes.array,
    allGroupsLoaded: React.PropTypes.bool,
    path: React.PropTypes.array,
    synonymObjects: React.PropTypes.array,
    object: React.PropTypes.object,
    guid: React.PropTypes.string,
    options: React.PropTypes.array,
    loadingFilterOptions: React.PropTypes.bool,
    showImportPC: React.PropTypes.bool,
    showImportRC: React.PropTypes.bool,
    showOrganizations: React.PropTypes.bool,
    logIn: React.PropTypes.bool,
    email: React.PropTypes.string
  },

  getInitialState () {
    const { gruppe, guid, path, showImportPC, showImportRC, showOrganizations, email } = this.props
    const groupsLoadedOrLoading = gruppe ? [gruppe] : []

    // this happens on first load
    // need to kick off stores
    if (!(path.length === 2 && path[0] === 'importieren') && !(path.length === 1 && path[0] === 'organisationen_und_benutzer') && path[0]) {
      // this would be an object url
      kickOffStores(path, gruppe, guid)
    }

    return {
      hierarchy: [],
      groupsLoadedOrLoading: groupsLoadedOrLoading,
      groupsLoadingObjects: [],
      allGroupsLoaded: false,
      path: path,
      synonymObjects: [],
      object: undefined,
      guid: guid,
      filterOptions: [],
      loadingFilterOptions: false,
      showImportPC: showImportPC,
      showImportRC: showImportRC,
      showOrganizations: showOrganizations,
      logIn: false,
      email: email
    }
  },

  componentDidMount () {
    // listen to stores
    this.listenTo(app.loginStore, this.onLoginStoreChange)
    this.listenTo(app.activePathStore, this.onActivePathStoreChange)
    this.listenTo(app.objectStore, this.onObjectStoreChange)
    this.listenTo(app.activeObjectStore, this.onActiveObjectStoreChange)
    this.listenTo(app.filterOptionsStore, this.onFilterOptionsStoreChange)
    this.listenTo(app.loadingGroupsStore, this.onLoadingGroupsStoreChange)
  },

  onLoadingGroupsStoreChange (payload) {
    const { groupsLoadingObjects, groupsLoaded } = payload
    const groupsLoading = _.pluck(groupsLoadingObjects, 'group')
    // add groups loading to groups loaded to hide the group checkbox of the loading group
    const groupsLoadedOrLoading = _.union(groupsLoaded, groupsLoading)
    const groupsNotLoaded = _.difference(gruppen, groupsLoadedOrLoading)
    const allGroupsLoaded = groupsNotLoaded.length === 0

    this.setState({
      groupsLoadingObjects: groupsLoadingObjects,
      groupsLoadedOrLoading: groupsLoadedOrLoading,
      allGroupsLoaded: allGroupsLoaded
    })
  },

  onLoginStoreChange (passedVariables) {
    this.setState({
      logIn: passedVariables.logIn,
      email: passedVariables.email
    })
  },

  onActivePathStoreChange (path, guid) {
    let state = {
      path: path,
      guid: guid
    }

    let gruppe = null
    let showImportPC = false
    let showImportRC = false
    let showOrganizations = false

    if (path.length === 2 && path[0] === 'importieren') {
      if (path[1] === 'eigenschaften') {
        showImportPC = true
        gruppe = null
      } else if (path[1] === 'beziehungen') {
        showImportRC = true
        gruppe = null
      }
    } else if (path.length === 1 && path[0] === 'organisationen_und_benutzer') {
      showOrganizations = true
      gruppe = null
    } else if (path[0]) {
      // this would be an object url
      gruppe = path[0]
    } else {
      // must be home
      gruppe = null
    }

    _.assign(state, {
      object: undefined,
      gruppe: gruppe,
      showImportPC: showImportPC,
      showImportRC: showImportRC,
      showOrganizations: showOrganizations
    })

    this.setState(state)

    const url = '/' + path.join('/') + (guid ? '?id=' + guid : '')
    app.router.navigate(url)
  },

  onObjectStoreChange (hierarchy) {
    this.setState({
      hierarchy: hierarchy || this.state.hierarchy
    })
  },

  onActiveObjectStoreChange (object, synonymObjects) {
    const guid = object._id
    this.setState({
      object: object,
      guid: guid,
      synonymObjects: synonymObjects
    })
  },

  onFilterOptionsStoreChange (payload) {
    const { filterOptions, loading } = payload
    if (filterOptions) {
      this.setState({
        filterOptions: filterOptions,
        loadingFilterOptions: loading
      })
    } else {
      this.setState({
        loadingFilterOptions: loading
      })
    }
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
          <div id='groupCheckboxesTitle'>
            Gruppen laden:
          </div>
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
    return (
            <Input
              key={gruppe}
              type='checkbox'
              label={label}
              onClick={this.onClickGruppe.bind(this, gruppe)} />
          )
  },

  email () {
    const email = this.state.email
    const text = email ? email : 'nicht angemeldet'
    return (<div id='email'>{text}</div>)
  },

  render () {
    const { hierarchy, path, synonymObjects, object, groupsLoadingObjects, allGroupsLoaded, filterOptions, loadingFilterOptions, showImportPC, showImportRC, showOrganizations, logIn, email, groupsLoadedOrLoading } = this.state
    const showFilter = filterOptions.length > 0 || loadingFilterOptions
    const showMain = object !== undefined || showImportRC || showImportPC || showOrganizations
    const showLogin = logIn && !email

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
          {showFilter ? <Filter filterOptions={filterOptions} loadingFilterOptions={loadingFilterOptions} /> : ''}
          <TreeFromHierarchyObject
            hierarchy={hierarchy}
            groupsLoadingObjects={groupsLoadingObjects}
            allGroupsLoaded={allGroupsLoaded}
            object={object}
            path={path} />
        </div>
        {this.email()}
        {showMain ? <Main object={object} groupsLoadedOrLoading={groupsLoadedOrLoading} synonymObjects={synonymObjects} showImportPC={showImportPC} showImportRC={showImportRC} showOrganizations={showOrganizations} email={email} /> : ''}
        {showLogin ? <Login /> : ''}
      </NavHelper>
    )
  }
})
