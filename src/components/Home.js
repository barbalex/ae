import app from 'ampersand-app'
import { ListenerMixin } from 'reflux'
import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import { browserHistory } from 'react-router'
import MenuButton from './menu/menuButton/MenuButton.js'
import ResizeButton from './menu/ResizeButton.js'
import Filter from './menu/Filter.js'
import Symbols from './symbols/Symbols.js'
import Main from './main/Main.js'
import Tree from './menu/tree/Tree.js'
import ErrorsCt from './ErrorsCt.js'
import Login from './main/login/Login.js'
import buildHierarchyObjectFromObjectForTaxonomy from '../modules/buildHierarchyObjectFromObjectForTaxonomy.js'

const styles = StyleSheet.create({
  menu: {
    display: 'flex',
    flexDirection: 'column',
    left: 7,
    top: 8,
    width: '100%',
    padding: 8,
    marginBottom: 10,
    border: '1px solid #e5e5e5',
    borderRadius: 6,
    backgroundColor: '#FFFFF0',
    zIndex: 1,
    maxHeight: 'calc(100vh - 105px)',
  },
  buttonLine: {
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    marginBottom: 5
  }
})

export default React.createClass({
  displayName: 'Home',

  propTypes: {
    hierarchy: React.PropTypes.object,
    gruppe: React.PropTypes.string,
    path: React.PropTypes.array,
    synonymObjects: React.PropTypes.array,
    object: React.PropTypes.object,
    editObjects: React.PropTypes.bool,
    guid: React.PropTypes.string,
    loadingFilterOptions: React.PropTypes.bool,
    mainComponent: React.PropTypes.string,
    logIn: React.PropTypes.bool,
    email: React.PropTypes.string,
    tcs: React.PropTypes.array,
    tcsQuerying: React.PropTypes.bool,
    pcs: React.PropTypes.array,
    pcsQuerying: React.PropTypes.bool,
    rcs: React.PropTypes.array,
    rcsQuerying: React.PropTypes.bool,
    fieldsQuerying: React.PropTypes.bool,
    errors: React.PropTypes.array,
    initializeApp: React.PropTypes.func,
    getNodesInitial: React.PropTypes.func,
  },

  mixins: [ListenerMixin],

  getInitialState() {
    const {
      guid,
      path,
      mainComponent,
      email
    } = this.props

    return {
      hierarchy: [],
      path,
      synonymObjects: [],
      object: undefined,
      editObjects: false,
      guid,
      filterOptions: [],
      loadingFilterOptions: false,
      mainComponent,
      logIn: false,
      email,
      tcs: [],
      tcsQuerying: false,
      pcs: [],
      pcsQuerying: false,
      rcs: [],
      rcsQuerying: false,
      fieldsQuerying: false,
      errors: []
    }
  },

  componentDidMount() {
    const { initializeApp, getNodesInitial } = this.props
    initializeApp()
    /*
    // listen to stores
    this.listenTo(app.userStore, this.onLoginStoreChange)
    this.listenTo(app.activePathStore, this.onActivePathStoreChange)
    this.listenTo(app.objectStore, this.onObjectStoreChange)
    this.listenTo(app.activeObjectStore, this.onActiveObjectStoreChange)
    this.listenTo(app.filterOptionsStore, this.onFilterOptionsStoreChange)
    this.listenTo(app.objectsPcsStore, this.onChangeObjectsPcsStore)
    this.listenTo(app.taxonomyCollectionsStore, this.onChangeTaxonomyCollectionsStore)
    this.listenTo(app.propertyCollectionsStore, this.onChangePropertyCollectionsStore)
    this.listenTo(app.relationCollectionsStore, this.onChangeRelationCollectionsStore)
    this.listenTo(app.fieldsStore, this.onChangeFieldsStore)
    this.listenTo(app.organizationsStore, this.onOrganizationsStoreChange)
    this.listenTo(app.errorStore, this.onErrorStoreChange)
    */
    console.log('Home.js, componentDidMount')
    getNodesInitial()
  },

  onErrorStoreChange(errors) {
    console.log('home.js, onErrorStoreChange, errors', errors)
    this.setState({ errors })
  },

  onChangeActiveOrganization(event) {
    const activeOrganizationName = event.target.value
    app.Actions.setActiveOrganization(activeOrganizationName)
    app.Actions.getTcsOfOrganization(activeOrganizationName)
    app.Actions.getPcsOfOrganization(activeOrganizationName)
    app.Actions.getRcsOfOrganization(activeOrganizationName)
  },

  onChangeTaxonomyCollectionsStore(tcs, tcsQuerying) {
    this.setState({ tcs, tcsQuerying })
  },

  onChangePropertyCollectionsStore(pcs, pcsQuerying) {
    this.setState({ pcs, pcsQuerying })
  },

  onChangeRelationCollectionsStore(rcs, rcsQuerying) {
    this.setState({ rcs, rcsQuerying })
  },

  onChangeFieldsStore(state) {
    this.setState(state)
  },

  onLoginStoreChange({ logIn, email, roles: userRoles }) {
    this.setState({ logIn, email, userRoles })
  },

  onActivePathStoreChange({
    path,
    guid,
    gruppe,
    mainComponent
  }) {
    this.setState({
      path,
      guid,
      gruppe,
      mainComponent
    })
    // navigate
    const url = `/${path.join('/')}${guid ? `?id=${guid}` : ''}`
    browserHistory.push(url)
  },

  onObjectStoreChange(hierarchyPassed) {
    const hierarchy = hierarchyPassed || this.state.hierarchy
    this.setState({ hierarchy })
  },

  onActiveObjectStoreChange(object, synonymObjects) {
    const guid = object._id
    this.setState({
      object,
      guid,
      synonymObjects
    })
  },

  onFilterOptionsStoreChange({
    filterOptions,
    loading: loadingFilterOptions
  }) {
    let state = { loadingFilterOptions }
    if (filterOptions) {
      state = Object.assign(state, { filterOptions })
    }
    this.setState(state)
  },

  onSaveObjectField(
    pcType,
    pcName,
    fieldName,
    fieldValue,
    save
  ) {
    const { object } = this.state
    const pcTypeHash = {
      Taxonomie: 'Taxonomien',
      Datensammlung: 'Eigenschaftensammlungen',
      Eigenschaftensammlung: 'Eigenschaftensammlungen',
      Beziehungssammlung: 'Beziehungssammlungen'
    }
    if (object) {
      const collection = object[pcTypeHash[pcType]].find((pc) =>
        pc.Name === pcName
      )
      if (collection && collection.Eigenschaften) {
        // update eigenschaften
        const eigenschaften = collection.Eigenschaften
        eigenschaften[fieldName] = fieldValue
        // if this field is contained in Hierarchien, need to update that
        if (save && pcType === 'Taxonomie' && eigenschaften.Hierarchie) {
          const hO = buildHierarchyObjectFromObjectForTaxonomy(object, pcName)
          if (hO) {
            const hierarchy = eigenschaften.Hierarchie
            hierarchy.pop()
            hierarchy.push(hO)
          }
        }
        // o.k., now update object
        const collectionIndex = object[pcTypeHash[pcType]].findIndex(pc =>
          pc.Name === pcName
        )
        object[pcTypeHash[pcType]][collectionIndex].Eigenschaften = eigenschaften
        app.Actions.saveObject(object, save)
      }
    }
  },

  toggleEditObjects() {
    const { editObjects } = this.state
    this.setState({ editObjects: !editObjects })
  },

  addNewObject() {
    addError({
      title: 'Dieses Feature ist noch nicht implementiert'
    })
  },

  removeObject() {
    addError({
      title: 'Dieses Feature ist noch nicht implementiert'
    })
  },

  render() {
    const {
      hierarchy,
      path,
      object,
      filterOptions,
      loadingFilterOptions,
      mainComponent,
      logIn,
      email,
      pcsQuerying,
      rcsQuerying,
      fieldsQuerying,
      errors
    } = this.state
    const showFilter = filterOptions.length > 0 || loadingFilterOptions
    const showTree = path && hierarchy
    const showMain = (
      object !== undefined ||
      !!mainComponent
    )
    const showLogin = logIn && !email
    let homeStyle = {}
    if (pcsQuerying || rcsQuerying || fieldsQuerying) {
      homeStyle.cursor = 'progress'
    }
    const showMenu = mainComponent !== 'exportierenAlt'

    if (
      errors &&
      errors.length > 0
    ) {
      console.log('errors', errors)
    }

    // MenuButton needs to be outside of the menu
    // otherwise the menu can't be shown outside when menu is short
    return (
      <div style={homeStyle}>
        {
          showMenu &&
          <div
            id="menu"
            className={css(styles.menu)}
          >
            <div className={css(styles.buttonLine)}>
              <MenuButton />
              <ResizeButton />
            </div>
            {
              showFilter &&
              <Filter />
            }
            {
              showTree &&
              <Tree />
            }
          </div>
        }
        <Symbols />
        {
          showMain &&
          <Main />
        }
        {
          showLogin &&
          <Login />
        }
        {
          errors &&
          errors.length > 0 &&
          <ErrorsCt />
        }
      </div>
    )
  }
})
