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
import getPathFromGuid from '../modules/getPathFromGuid.js'
import getGruppen from '../modules/gruppen.js'
import NavHelper from '../components/navHelper.js'
import kickOffStores from '../modules/kickOffStores.js'
import Login from './main/login.js'

const gruppen = getGruppen()

const Home = React.createClass({
  displayName: 'Home',

  mixins: [ListenerMixin],

  propTypes: {
    hierarchy: React.PropTypes.object,
    gruppe: React.PropTypes.string,
    groupsLoadedOrLoading: React.PropTypes.array,
    groupsLoadingObjects: React.PropTypes.array,
    allGroupsLoaded: React.PropTypes.bool,
    isGuidPath: React.PropTypes.bool,
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

    // kick off stores by getting store data directly from the remote db
    kickOffStores(path, gruppe, guid)

    return {
      hierarchy: [],
      groupsLoadedOrLoading: groupsLoadedOrLoading,
      groupsLoadingObjects: [],
      allGroupsLoaded: false,
      path: path,
      synonymObjects: [],
      object: undefined,
      guid: guid,
      options: [],
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
    console.log('groupsLoading:', groupsLoading)
    console.log('groupsLoaded:', groupsLoaded)
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
    console.log('home.js, login store changed, passedVariables:', passedVariables)
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

    let showImportPC = false
    let showImportRC = false
    let showOrganizations = false
    if (path.length === 2 && path[0] === 'importieren') {
      if (path[1] === 'eigenschaften') {
        showImportPC = true
      } else if (path[1] === 'beziehungen') {
        showImportRC = true
      }
    }
    if (path.length === 1 && path[0] === 'organisationen_und_benutzer') {
      showOrganizations = true
    }

    _.assign(state, {
      object: undefined,
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
    // update url if path was called only with guid
    if (this.props.isGuidPath && guid) {
      getPathFromGuid(guid, object)
        .then(function (result) {
          const path = result.path
          app.Actions.loadActivePathStore(path, guid)
        })
        .catch(function (error) {
          console.log('home.js: error getting path for guid ' + guid + ':', error)
        })
    }
  },

  onFilterOptionsStoreChange (payload) {
    const { options, loading } = payload
    if (options) {
      this.setState({
        options: options,
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
    const { hierarchy, path, synonymObjects, object, groupsLoadingObjects, allGroupsLoaded, options, loadingFilterOptions, showImportPC, showImportRC, showOrganizations, logIn, email } = this.state
    const { isGuidPath } = this.props
    const showFilter = options.length > 0 || loadingFilterOptions
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
          {this.createGruppen()} {showFilter ? <Filter options={options} loadingFilterOptions={loadingFilterOptions} /> : ''}
          <TreeFromHierarchyObject
            hierarchy={hierarchy}
            groupsLoadingObjects={groupsLoadingObjects}
            allGroupsLoaded={allGroupsLoaded}
            object={object}
            isGuidPath={isGuidPath}
            path={path} />
        </div>
        {this.email()}
        {showMain ? <Main object={object} synonymObjects={synonymObjects} showImportPC={showImportPC} showImportRC={showImportRC} showOrganizations={showOrganizations} email={email} /> : ''}
        {showLogin ? <Login /> : ''}
      </NavHelper>
    )
  }
})

export default Home
