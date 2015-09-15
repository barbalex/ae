'use strict'

import app from 'ampersand-app'
import { ListenerMixin } from 'reflux'
import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import MenuButton from './menu/menuButton'
import ResizeButton from './menu/resizeButton.js'
import Groups from './menu/groups/groups.js'
import Filter from './menu/filter.js'
import FaviconImage from '../../img/aster_144.png'
import Favicon from 'react-favicon'
import Symbols from './symbols/symbols.js'
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
    showImportPc: React.PropTypes.bool,
    showImportRc: React.PropTypes.bool,
    showExportieren: React.PropTypes.bool,
    showOrganizations: React.PropTypes.bool,
    logIn: React.PropTypes.bool,
    email: React.PropTypes.string,
    replicatingToAe: React.PropTypes.string,
    replicatingToAeTime: React.PropTypes.string,
    replicatingFromAe: React.PropTypes.string,
    replicatingFromAeTime: React.PropTypes.string,
    pcsQuerying: React.PropTypes.bool,
    rcsQuerying: React.PropTypes.bool
  },

  getInitialState () {
    const { gruppe, guid, path, showImportPc, showImportRc, showExportieren, showOrganizations, email } = this.props
    const groupsLoadedOrLoading = gruppe ? [gruppe] : []

    // this happens on first load
    // need to kick off stores
    if (!(path.length === 2 && path[0] === 'importieren') && !(path.length === 1 && path[0] === 'organisationen_und_benutzer') && !(path.length === 1 && path[0] === 'exportieren') && path[0]) {
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
      showImportPc: showImportPc,
      showImportRc: showImportRc,
      showExportieren: showExportieren,
      showOrganizations: showOrganizations,
      logIn: false,
      email: email,
      replicatingToAe: null,
      replicatingToAeTime: null,
      replicatingFromAe: null,
      replicatingFromAeTime: null,
      pcsQuerying: false,
      rcsQuerying: false
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
    this.listenTo(app.replicateToAeStore, this.onReplicateToAeStoreChange)
    this.listenTo(app.replicateFromAeStore, this.onReplicateFromAeStoreChange)
    this.listenTo(app.objectsPcsStore, this.onChangeObjectsPcsStore)
    this.listenTo(app.propertyCollectionsStore, this.onChangePropertyCollectionsStore)
    this.listenTo(app.relationCollectionsStore, this.onChangeRelationCollectionsStore)
  },

  onChangePropertyCollectionsStore (pcs, pcsQuerying) {
    this.setState({ pcsQuerying })
  },

  onChangeRelationCollectionsStore (rcs, rcsQuerying) {
    this.setState({ rcsQuerying })
  },

  onChangeObjectsPcsStore () {
    // set back replication to ae state
    const replicatingToAe = null
    const replicatingToAeTime = null
    this.setState({ replicatingToAe, replicatingToAeTime })
  },

  onReplicateFromAeStoreChange (replicatingFromAe) {
    const replicatingFromAeTime = moment().format('HH:mm')
    this.setState({ replicatingFromAe, replicatingFromAeTime })
  },

  onReplicateToAeStoreChange (replicatingToAe) {
    const replicatingToAeTime = moment().format('HH:mm')
    this.setState({ replicatingToAe, replicatingToAeTime })
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
    let showImportPc = false
    let showImportRc = false
    let showExportieren = false
    let showOrganizations = false

    if (path.length === 2 && path[0] === 'importieren') {
      if (path[1] === 'eigenschaften') {
        showImportPc = true
        gruppe = null
      } else if (path[1] === 'beziehungen') {
        showImportRc = true
        gruppe = null
      }
    } else if (path.length === 1 && path[0] === 'organisationen_und_benutzer') {
      showOrganizations = true
      gruppe = null
    } else if (path.length === 1 && path[0] === 'exportieren') {
      showExportieren = true
      gruppe = null
    } else if (path[0]) {
      // this would be an object url
      gruppe = path[0]
    } else {
      // must be home
      gruppe = null
    }
    const object = undefined
    state = Object.assign(state, { object, gruppe, showImportPc, showImportRc, showExportieren, showOrganizations })

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
    let state = { loadingFilterOptions }
    if (filterOptions) state = Object.assign(state, { filterOptions })
    this.setState(state)
  },

  render () {
    const { hierarchy, path, synonymObjects, object, groupsLoadingObjects, allGroupsLoaded, filterOptions, loadingFilterOptions, showImportPc, showImportRc, showExportieren, showOrganizations, logIn, email, groupsLoadedOrLoading, replicatingToAe, replicatingToAeTime, replicatingFromAe, replicatingFromAeTime, pcsQuerying, rcsQuerying } = this.state
    const groupsNotLoaded = _.difference(gruppen, groupsLoadedOrLoading)
    const showGruppen = groupsNotLoaded.length > 0
    const showFilter = filterOptions.length > 0 || loadingFilterOptions
    const showTree = groupsLoadedOrLoading.length > 0
    const showMain = object !== undefined || showImportRc || showImportPc || showExportieren || showOrganizations
    const showLogin = logIn && !email
    let homeStyle = {}
    if (pcsQuerying || rcsQuerying) homeStyle.cursor = 'progress'

    // MenuButton needs to be outside of the menu
    // otherwise the menu can't be shown outside when menu is short
    return (
      <NavHelper style={homeStyle}>
        <Favicon url={[FaviconImage]}/>
        <MenuButton object={object} />
        <div id='menu' className='menu'>
          <div id='menuLine'>
            <ResizeButton />
          </div>
          {showGruppen ?
            <Groups
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
        <Symbols
          email={email}
          pcsQuerying={pcsQuerying}
          rcsQuerying={rcsQuerying}
          replicatingToAe={replicatingToAe}
          replicatingToAeTime={replicatingToAeTime}
          replicatingFromAe={replicatingFromAe}
          replicatingFromAeTime={replicatingFromAeTime} />
        {showMain ?
          <Main
            object={object}
            allGroupsLoaded={allGroupsLoaded}
            groupsLoadedOrLoading={groupsLoadedOrLoading}
            groupsLoadingObjects={groupsLoadingObjects}
            synonymObjects={synonymObjects}
            showImportPc={showImportPc}
            showImportRc={showImportRc}
            showExportieren={showExportieren}
            showOrganizations={showOrganizations}
            email={email}
            replicatingToAe={replicatingToAe}
            replicatingToAeTime={replicatingToAeTime} />
          : null
        }
        {showLogin ? <Login /> : null}
      </NavHelper>
    )
  }
})
