'use strict'

import app from 'ampersand-app'
import { ListenerMixin } from 'reflux'
import React from 'react'
import { pluck, difference, union } from 'lodash'
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
import Login from './main/login/login.js'

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
    editObjects: React.PropTypes.bool,
    guid: React.PropTypes.string,
    options: React.PropTypes.array,
    loadingFilterOptions: React.PropTypes.bool,
    mainComponent: React.PropTypes.string,
    logIn: React.PropTypes.bool,
    email: React.PropTypes.string,
    userRoles: React.PropTypes.array,
    replicatingToAe: React.PropTypes.string,
    replicatingToAeTime: React.PropTypes.string,
    replicatingFromAe: React.PropTypes.string,
    replicatingFromAeTime: React.PropTypes.string,
    tcs: React.PropTypes.array,
    tcsQuerying: React.PropTypes.bool,
    pcs: React.PropTypes.array,
    pcsQuerying: React.PropTypes.bool,
    rcs: React.PropTypes.array,
    rcsQuerying: React.PropTypes.bool,
    fieldsQuerying: React.PropTypes.bool,
    fieldsQueryingError: React.PropTypes.object,
    taxonomyFields: React.PropTypes.object,
    pcFields: React.PropTypes.object,
    relationFields: React.PropTypes.object,
    offlineIndexes: React.PropTypes.bool,
    organizations: React.PropTypes.array,
    activeOrganization: React.PropTypes.object,
    tcsOfActiveOrganization: React.PropTypes.array,
    pcsOfActiveOrganization: React.PropTypes.array,
    rcsOfActiveOrganization: React.PropTypes.array,
    userIsAdminInOrgs: React.PropTypes.array,
    userIsEsWriterInOrgs: React.PropTypes.array
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
      editObjects: false,
      guid: guid,
      filterOptions: [],
      loadingFilterOptions: false,
      mainComponent: mainComponent,
      logIn: false,
      email: email,
      userRoles: [],
      replicatingToAe: null,
      replicatingToAeTime: null,
      replicatingFromAe: null,
      replicatingFromAeTime: null,
      tcs: [],
      tcsQuerying: false,
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
      offlineIndexes: false,
      organizations: [],
      activeOrganization: null,
      tcsOfActiveOrganization: [],
      pcsOfActiveOrganization: [],
      rcsOfActiveOrganization: [],
      userIsAdminInOrgs: [],
      userIsEsWriterInOrgs: []
    }
  },

  componentDidMount () {
    // listen to stores
    this.listenTo(app.userStore, this.onLoginStoreChange)
    this.listenTo(app.activePathStore, this.onActivePathStoreChange)
    this.listenTo(app.objectStore, this.onObjectStoreChange)
    this.listenTo(app.activeObjectStore, this.onActiveObjectStoreChange)
    this.listenTo(app.filterOptionsStore, this.onFilterOptionsStoreChange)
    this.listenTo(app.loadingGroupsStore, this.onLoadingGroupsStoreChange)
    this.listenTo(app.replicateToAeStore, this.onReplicateToAeStoreChange)
    this.listenTo(app.replicateFromAeStore, this.onReplicateFromAeStoreChange)
    this.listenTo(app.objectsPcsStore, this.onChangeObjectsPcsStore)
    this.listenTo(app.taxonomyCollectionsStore, this.onChangeTaxonomyCollectionsStore)
    this.listenTo(app.propertyCollectionsStore, this.onChangePropertyCollectionsStore)
    this.listenTo(app.relationCollectionsStore, this.onChangeRelationCollectionsStore)
    this.listenTo(app.fieldsStore, this.onChangeFieldsStore)
    this.listenTo(app.organizationsStore, this.onOrganizationsStoreChange)
  },

  onOrganizationsStoreChange ({ organizations, activeOrganization, userIsAdminInOrgs, userIsEsWriterInOrgs, tcsOfActiveOrganization, pcsOfActiveOrganization, rcsOfActiveOrganization }) {
    this.setState({ organizations, activeOrganization, userIsAdminInOrgs, userIsEsWriterInOrgs, tcsOfActiveOrganization, pcsOfActiveOrganization, rcsOfActiveOrganization })
  },

  onChangeActiveOrganization (event) {
    const activeOrganizationName = event.target.value
    app.Actions.setActiveOrganization(activeOrganizationName)
    app.Actions.getTcsOfOrganization(activeOrganizationName)
    app.Actions.getPcsOfOrganization(activeOrganizationName)
    app.Actions.getRcsOfOrganization(activeOrganizationName)
  },

  onChangeTaxonomyCollectionsStore (tcs, tcsQuerying) {
    this.setState({ tcs, tcsQuerying })
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
    const groupsLoading = pluck(groupsLoadingObjects, 'group')
    // add groups loading to groups loaded to hide the group checkbox of the loading group
    const groupsLoadedOrLoading = union(groupsLoaded, groupsLoading)
    const groupsNotLoaded = difference(gruppen, groupsLoadedOrLoading)
    const allGroupsLoaded = groupsNotLoaded.length === 0

    this.setState({ groupsLoadingObjects, groupsLoadedOrLoading, allGroupsLoaded })
  },

  onLoginStoreChange ({ logIn, email, roles: userRoles }) {
    this.setState({ logIn, email, userRoles })
  },

  onActivePathStoreChange ({ path, guid, gruppe, mainComponent }) {
    this.setState({ path, guid, gruppe, mainComponent })
    // navigate
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

  toggleEditObjects () {
    const { editObjects } = this.state
    this.setState({ editObjects: !editObjects })
  },

  render () {
    const { hierarchy, path, synonymObjects, object, groupsLoadingObjects, allGroupsLoaded, filterOptions, loadingFilterOptions, mainComponent, logIn, email, userRoles, groupsLoadedOrLoading, replicatingToAe, replicatingToAeTime, replicatingFromAe, replicatingFromAeTime, tcs, pcs, tcsQuerying, rcs, pcsQuerying, rcsQuerying, fieldsQuerying, fieldsQueryingError, taxonomyFields, pcFields, relationFields, offlineIndexes, organizations, activeOrganization, userIsAdminInOrgs, userIsEsWriterInOrgs, tcsOfActiveOrganization, pcsOfActiveOrganization, rcsOfActiveOrganization, editObjects } = this.state
    const groupsNotLoaded = difference(gruppen, groupsLoadedOrLoading)
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
          tcsQuerying={tcsQuerying}
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
              editObjects={editObjects}
              toggleEditObjects={this.toggleEditObjects}
              allGroupsLoaded={allGroupsLoaded}
              groupsLoadedOrLoading={groupsLoadedOrLoading}
              groupsLoadingObjects={groupsLoadingObjects}
              synonymObjects={synonymObjects}
              tcs={tcs}
              pcs={pcs}
              rcs={rcs}
              tcsQuerying={tcsQuerying}
              pcsQuerying={pcsQuerying}
              rcsQuerying={rcsQuerying}
              mainComponent={mainComponent}
              fieldsQuerying={fieldsQuerying}
              fieldsQueryingError={fieldsQueryingError}
              taxonomyFields={taxonomyFields}
              pcFields={pcFields}
              relationFields={relationFields}
              email={email}
              userRoles={userRoles}
              replicatingToAe={replicatingToAe}
              replicatingToAeTime={replicatingToAeTime}
              offlineIndexes={offlineIndexes}
              organizations={organizations}
              activeOrganization={activeOrganization}
              tcsOfActiveOrganization={tcsOfActiveOrganization}
              pcsOfActiveOrganization={pcsOfActiveOrganization}
              rcsOfActiveOrganization={rcsOfActiveOrganization}
              onChangeActiveOrganization={this.onChangeActiveOrganization}
              userIsAdminInOrgs={userIsAdminInOrgs}
              userIsEsWriterInOrgs={userIsEsWriterInOrgs} />
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
