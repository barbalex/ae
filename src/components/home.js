'use strict'

import app from 'ampersand-app'
import { ListenerMixin } from 'reflux'
import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import MenuButton from './menu/menuButton/menuButton.js'
import ResizeButton from './menu/resizeButton.js'
import Groups from './menu/groups/groups.js'
import Filter from './menu/filter.js'
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
    mainComponent: React.PropTypes.string,
    logIn: React.PropTypes.bool,
    email: React.PropTypes.string,
    replicatingToAe: React.PropTypes.string,
    replicatingToAeTime: React.PropTypes.string,
    replicatingFromAe: React.PropTypes.string,
    replicatingFromAeTime: React.PropTypes.string,
    pcs: React.PropTypes.array,
    pcsQuerying: React.PropTypes.bool,
    rcs: React.PropTypes.array,
    rcsQuerying: React.PropTypes.bool,
    fieldsQuerying: React.PropTypes.bool,
    fieldsQueryingError: React.PropTypes.object,
    taxonomyFields: React.PropTypes.object,
    pcFields: React.PropTypes.object,
    relationFields: React.PropTypes.object,
    offlineIndexes: React.PropTypes.bool
  },

  getInitialState () {
    const { gruppe, guid, path, mainComponent, email } = this.props
    const groupsLoadedOrLoading = gruppe ? [gruppe] : []

    // this happens on first load
    // need to kick off stores
    if (!(path.length === 2 && path[0] === 'importieren') && !(path.length === 1 && path[0] === 'organisationen') && !(path.length === 1 && path[0] === 'exportieren') && path[0]) {
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
      mainComponent: mainComponent,
      logIn: false,
      email: email,
      replicatingToAe: null,
      replicatingToAeTime: null,
      replicatingFromAe: null,
      replicatingFromAeTime: null,
      pcs: [],
      pcsQuerying: false,
      rcs: [],
      rcsQuerying: false,
      fieldsQuerying: false,
      fieldsQueryingError: null,
      fields: [],
      taxonomyFields: {},
      pcFields: {},
      relationFields: {},
      // if true: get index calls from remoteDb
      // if false: query localDb
      // this uses indexes which are VERY slow to build and make the app instable
      offlineIndexes: false
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
    this.listenTo(app.fieldsStore, this.onChangeFieldsStore)
  },

  onChangePropertyCollectionsStore (pcs, pcsQuerying) {
    this.setState({ pcs, pcsQuerying })
  },

  onChangeRelationCollectionsStore (rcs, rcsQuerying) {
    this.setState({ rcs, rcsQuerying })
  },

  onChangeFieldsStore (state) {
    this.setState(state)
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

  onActivePathStoreChange ({ path, guid, gruppe, mainComponent }) {
    let state = { path, guid, gruppe, mainComponent }
    if (!guid) state = Object.assign(state, { object: undefined })
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

  onClickToggleOfflineIndexes () {
    let { offlineIndexes } = this.state
    offlineIndexes = !offlineIndexes
    this.setState({ offlineIndexes })
  },

  render () {
    const { hierarchy, path, synonymObjects, object, groupsLoadingObjects, allGroupsLoaded, filterOptions, loadingFilterOptions, mainComponent, logIn, email, groupsLoadedOrLoading, replicatingToAe, replicatingToAeTime, replicatingFromAe, replicatingFromAeTime, pcs, rcs, pcsQuerying, rcsQuerying, fieldsQuerying, fieldsQueryingError, taxonomyFields, pcFields, relationFields, offlineIndexes } = this.state
    const groupsNotLoaded = _.difference(gruppen, groupsLoadedOrLoading)
    const showGruppen = groupsNotLoaded.length > 0
    const showFilter = filterOptions.length > 0 || loadingFilterOptions
    const showTree = groupsLoadedOrLoading.length > 0
    const showMain = object !== undefined || !!mainComponent
    const showLogin = logIn && !email
    let homeStyle = {}
    if (pcsQuerying || rcsQuerying || fieldsQuerying) homeStyle.cursor = 'progress'
    const showMenu = mainComponent !== 'exportierenAlt'

    // MenuButton needs to be outside of the menu
    // otherwise the menu can't be shown outside when menu is short
    return (
      <NavHelper style={homeStyle}>
        {
          showMenu
          ? <MenuButton
              object={object}
              offlineIndexes={offlineIndexes}
              onClickToggleOfflineIndexes={this.onClickToggleOfflineIndexes} />
          : null
        }
        {
          showMenu
          ? <div id='menu' className='menu'>
              <div id='menuLine'>
                <ResizeButton />
              </div>
              {
                showGruppen
                ? <Groups
                    groupsLoadedOrLoading={groupsLoadedOrLoading} />
                : null
              }
              {
                showFilter
                ? <Filter
                    filterOptions={filterOptions}
                    loadingFilterOptions={loadingFilterOptions} />
                : null
              }
              {
                showTree
                ? <Tree
                    hierarchy={hierarchy}
                    groupsLoadingObjects={groupsLoadingObjects}
                    allGroupsLoaded={allGroupsLoaded}
                    object={object}
                    path={path} />
                : null
              }
            </div>
          : null
        }
        <Symbols
          email={email}
          groupsLoadingObjects={groupsLoadingObjects}
          pcsQuerying={pcsQuerying}
          rcsQuerying={rcsQuerying}
          fieldsQuerying={fieldsQuerying}
          replicatingToAe={replicatingToAe}
          replicatingToAeTime={replicatingToAeTime}
          replicatingFromAe={replicatingFromAe}
          replicatingFromAeTime={replicatingFromAeTime} />
        {showMain
          ? <Main
              object={object}
              allGroupsLoaded={allGroupsLoaded}
              groupsLoadedOrLoading={groupsLoadedOrLoading}
              groupsLoadingObjects={groupsLoadingObjects}
              synonymObjects={synonymObjects}
              pcs={pcs}
              rcs={rcs}
              pcsQuerying={pcsQuerying}
              rcsQuerying={rcsQuerying}
              mainComponent={mainComponent}
              fieldsQuerying={fieldsQuerying}
              fieldsQueryingError={fieldsQueryingError}
              taxonomyFields={taxonomyFields}
              pcFields={pcFields}
              relationFields={relationFields}
              email={email}
              replicatingToAe={replicatingToAe}
              replicatingToAeTime={replicatingToAeTime}
              offlineIndexes={offlineIndexes} />
          : null
        }
        {
          showLogin
          ? <Login />
          : null
        }
      </NavHelper>
    )
  }
})
