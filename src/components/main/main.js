/*
 * contains ui for main
 * changes ui depending on size of window
 */

'use strict'

import { debounce } from 'lodash'
import { ListenerMixin } from 'reflux'
import React from 'react'
import ReactDOM from 'react-dom'
import { Form } from 'react-bootstrap'
import { StyleSheet, css } from 'aphrodite'
import Objekt from './object/object.js'
import ImportPc from './importPc/importPc.js'
import ImportRc from './importRc/importRc.js'
import Export from './export/export.js'
import ExportAlt from './exportAlt/exportAlt.js'
import Organizations from './organizations/organizations.js'
import Errors from './errors.js'

// wenn main unter menu kommt muss ein margin vorhanden sein
// bootstrap-glyphicons.css vergibt Eigenschaften > korrigieren
const styles = StyleSheet.create({
  mainRootDiv: {
    margin: '0 0 7px 0',
    border: 'none',
    padding: 0,
    position: 'relative',
    width: '100%'
  }
})

export default React.createClass({
  displayName: 'Main',

  propTypes: {
    object: React.PropTypes.object,
    onSaveObjectField: React.PropTypes.func,
    editObjects: React.PropTypes.bool,
    toggleEditObjects: React.PropTypes.func,
    addNewObject: React.PropTypes.func,
    removeObject: React.PropTypes.func,
    synonymObjects: React.PropTypes.array,
    tcs: React.PropTypes.array,
    tcsQuerying: React.PropTypes.bool,
    pcs: React.PropTypes.array,
    pcsQuerying: React.PropTypes.bool,
    rcs: React.PropTypes.array,
    rcsQuerying: React.PropTypes.bool,
    mainComponent: React.PropTypes.string,
    fieldsQuerying: React.PropTypes.bool,
    fieldsQueryingError: React.PropTypes.object,
    taxonomyFields: React.PropTypes.object,
    pcFields: React.PropTypes.object,
    relationFields: React.PropTypes.object,
    email: React.PropTypes.string,
    userRoles: React.PropTypes.array,
    allGroupsLoaded: React.PropTypes.bool,
    groupsLoadedOrLoading: React.PropTypes.array,
    groupsLoadingObjects: React.PropTypes.array,
    errors: React.PropTypes.array,
    replicatingToAe: React.PropTypes.string,
    replicatingToAeTime: React.PropTypes.string,
    offlineIndexes: React.PropTypes.bool,
    organizations: React.PropTypes.array,
    activeOrganization: React.PropTypes.object,
    tcsOfActiveOrganization: React.PropTypes.array,
    pcsOfActiveOrganization: React.PropTypes.array,
    rcsOfActiveOrganization: React.PropTypes.array,
    onChangeActiveOrganization: React.PropTypes.func,
    userIsAdminInOrgs: React.PropTypes.array,
    userIsEsWriterInOrgs: React.PropTypes.array
  },

  mixins: [ListenerMixin],

  getInitialState() {
    const formHorizontal = window.innerWidth > 700
    return { formHorizontal }
  },

  componentDidMount() {
    window.addEventListener('resize', debounce(this.onResize, 150))
  },

  componentWillUnmount() {
    window.removeEventListener('resize')
  },

  onResize() {
    const thisWidth = ReactDOM.findDOMNode(this).offsetWidth
    const formHorizontal = thisWidth > 700
    this.setState({ formHorizontal })
  },

  render() {
    const {
      allGroupsLoaded,
      groupsLoadedOrLoading,
      groupsLoadingObjects,
      object,
      onSaveObjectField,
      editObjects,
      toggleEditObjects,
      addNewObject,
      removeObject,
      synonymObjects,
      tcs,
      tcsQuerying,
      pcs,
      pcsQuerying,
      rcs,
      rcsQuerying,
      mainComponent,
      fieldsQuerying,
      fieldsQueryingError,
      taxonomyFields,
      pcFields,
      relationFields,
      email,
      userRoles,
      replicatingToAe,
      replicatingToAeTime,
      offlineIndexes,
      organizations,
      activeOrganization,
      onChangeActiveOrganization,
      userIsAdminInOrgs,
      userIsEsWriterInOrgs,
      tcsOfActiveOrganization,
      pcsOfActiveOrganization,
      rcsOfActiveOrganization,
      errors
    } = this.props
    const { formHorizontal } = this.state
    const showObject = (
      object &&
      Object.keys(object).length > 0 &&
      !mainComponent
    )

    return (
      <Form
        id="main"
        horizontal={formHorizontal}
        className={css(styles.mainRootDiv)}
      >
        <Errors errors={errors} />
        {
          showObject &&
          <Objekt
            object={object}
            onSaveObjectField={onSaveObjectField}
            synonymObjects={synonymObjects}
            userRoles={userRoles}
            editObjects={editObjects}
            toggleEditObjects={toggleEditObjects}
            addNewObject={addNewObject}
            removeObject={removeObject}
          />
        }
        {
          mainComponent === 'importPc' &&
          <ImportPc
            email={email}
            userRoles={userRoles}
            pcs={pcs}
            offlineIndexes={offlineIndexes}
            groupsLoadedOrLoading={groupsLoadedOrLoading}
            groupsLoadingObjects={groupsLoadingObjects}
            allGroupsLoaded={allGroupsLoaded}
            replicatingToAe={replicatingToAe}
            replicatingToAeTime={replicatingToAeTime}
            organizations={organizations}
            userIsEsWriterInOrgs={userIsEsWriterInOrgs}
          />
        }
        {
          mainComponent === 'importRc' &&
          <ImportRc
            email={email}
            userRoles={userRoles}
            rcs={rcs}
            offlineIndexes={offlineIndexes}
            groupsLoadedOrLoading={groupsLoadedOrLoading}
            groupsLoadingObjects={groupsLoadingObjects}
            allGroupsLoaded={allGroupsLoaded}
            replicatingToAe={replicatingToAe}
            replicatingToAeTime={replicatingToAeTime}
            organizations={organizations}
            userIsEsWriterInOrgs={userIsEsWriterInOrgs}
          />
        }
        {
          mainComponent === 'exportieren' &&
          <Export
            groupsLoadedOrLoading={groupsLoadedOrLoading}
            groupsLoadingObjects={groupsLoadingObjects}
            fieldsQuerying={fieldsQuerying}
            fieldsQueryingError={fieldsQueryingError}
            taxonomyFields={taxonomyFields}
            pcFields={pcFields}
            relationFields={relationFields}
            pcs={pcs}
            rcs={rcs}
            pcsQuerying={pcsQuerying}
            rcsQuerying={rcsQuerying}
            offlineIndexes={offlineIndexes}
          />
        }
        {
          mainComponent === 'exportierenAlt' &&
          <ExportAlt
            groupsLoadedOrLoading={groupsLoadedOrLoading}
            groupsLoadingObjects={groupsLoadingObjects}
            fieldsQuerying={fieldsQuerying}
            fieldsQueryingError={fieldsQueryingError}
            taxonomyFields={taxonomyFields}
            pcFields={pcFields}
            relationFields={relationFields}
            pcs={pcs}
            rcs={rcs}
            pcsQuerying={pcsQuerying}
            rcsQuerying={rcsQuerying}
            offlineIndexes={offlineIndexes}
          />
        }
        {
          mainComponent === 'organizations' &&
          <Organizations
            tcs={tcs}
            tcsQuerying={tcsQuerying}
            email={email}
            userRoles={userRoles}
            organizations={organizations}
            activeOrganization={activeOrganization}
            tcsOfActiveOrganization={tcsOfActiveOrganization}
            pcsOfActiveOrganization={pcsOfActiveOrganization}
            rcsOfActiveOrganization={rcsOfActiveOrganization}
            onChangeActiveOrganization={onChangeActiveOrganization}
            userIsAdminInOrgs={userIsAdminInOrgs}
            offlineIndexes={offlineIndexes}
          />
        }
      </Form>
    )
  }
})
