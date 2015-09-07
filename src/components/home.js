'use strict'

import app from 'ampersand-app'
import { ListenerMixin } from 'reflux'
import React from 'react'
import { Input } from 'react-bootstrap'
import _ from 'lodash'
import MenuButton from './menu/menuButton'
import ResizeButton from './menu/resizeButton.js'
import Gruppen from './menu/gruppen.js'
import Filter from './menu/filter.js'
import FaviconImage from '../../img/aster_144.png'
import Favicon from 'react-favicon'
import Email from './email.js'
import Main from './main/main.js'
import Tree from './menu/tree/tree.js'
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

    this.setState({ groupsLoadingObjects, groupsLoadedOrLoading, allGroupsLoaded })
  },

  onLoginStoreChange (passedVariables) {
    this.setState(passedVariables)
  },

  onActivePathStoreChange (path, guid) {
    let state = { path, guid }

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
    const object = undefined
    _.assign(state, { object, gruppe: gruppe, showImportPC, showImportRC, showOrganizations })

    this.setState(state)

    const url = '/' + path.join('/') + (guid ? '?id=' + guid : '')
    app.router.navigate(url)
  },

  onObjectStoreChange (hierarchy) {
    hierarchy = hierarchy || this.state.hierarchy
    this.setState({ hierarchy })
  },

  onActiveObjectStoreChange (object, synonymObjects) {
    const guid = object._id
    this.setState({ object, guid, synonymObjects })
  },

  onFilterOptionsStoreChange (payload) {
    const { filterOptions, loading: loadingFilterOptions } = payload
    if (filterOptions) {
      this.setState({ filterOptions, loadingFilterOptions })
    } else {
      this.setState({ loadingFilterOptions })
    }
  },

  render () {
    const { hierarchy, path, synonymObjects, object, groupsLoadingObjects, allGroupsLoaded, filterOptions, loadingFilterOptions, showImportPC, showImportRC, showOrganizations, logIn, email, groupsLoadedOrLoading } = this.state
    const groupsNotLoaded = _.difference(gruppen, groupsLoadedOrLoading)
    const showGruppen = groupsNotLoaded.length > 0
    const showFilter = filterOptions.length > 0 || loadingFilterOptions
    const showTree = groupsLoadedOrLoading.length > 0
    const showMain = object !== undefined || showImportRC || showImportPC || showOrganizations
    const showLogin = logIn && !email

    // MenuButton needs to be outside of the menu
    // otherwise the menu can't be shown outside when menu is short
    return (
      <NavHelper>
        <Favicon url={[FaviconImage]}/>
        <MenuButton object={object} />
        <div id='menu' className='menu'>
          <div id='menuLine'>
            <ResizeButton />
          </div>
          {showGruppen ?
            <Gruppen
              groupsLoadedOrLoading={groupsLoadedOrLoading} />
            : null
          }
          {showFilter ?
            <Filter
              filterOptions={filterOptions}
              loadingFilterOptions={loadingFilterOptions} />
            : null
          }
          {showTree ?
            <Tree
              hierarchy={hierarchy}
              groupsLoadingObjects={groupsLoadingObjects}
              allGroupsLoaded={allGroupsLoaded}
              object={object}
              path={path} />
            : null
          }
        </div>
        <Email email={email} />
        {showMain ?
          <Main
            object={object}
            allGroupsLoaded={allGroupsLoaded}
            groupsLoadedOrLoading={groupsLoadedOrLoading}
            groupsLoadingObjects={groupsLoadingObjects}
            synonymObjects={synonymObjects}
            showImportPC={showImportPC}
            showImportRC={showImportRC}
            showOrganizations={showOrganizations}
            email={email} />
          : null
        }
        {showLogin ? <Login /> : null}
      </NavHelper>
    )
  }
})
