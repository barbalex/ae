/*
 * contains ui for main
 * changes ui depending on size of window
 */

'use strict'

import app from 'ampersand-app'
import _ from 'lodash'
import { ListenerMixin } from 'reflux'
import React from 'react'
import Objekt from './object/object.js'
import ImportPc from './importPc/importPc.js'
import ImportRc from './importRc/importRc.js'
import Export from './export/export.js'
import Organizations from './organizations.js'
import Errors from './errors.js'

export default React.createClass({
  displayName: 'Main',

  mixins: [ListenerMixin],

  propTypes: {
    object: React.PropTypes.object,
    synonymObjects: React.PropTypes.array,
    pcs: React.PropTypes.array,
    pcsQuerying: React.PropTypes.bool,
    rcs: React.PropTypes.array,
    rcsQuerying: React.PropTypes.bool,
    showImportPc: React.PropTypes.bool,
    showImportRc: React.PropTypes.bool,
    showExportieren: React.PropTypes.bool,
    fieldsQuerying: React.PropTypes.bool,
    fieldsQueryingError: React.PropTypes.object,
    taxonomyFields: React.PropTypes.object,
    pcFields: React.PropTypes.object,
    relationFields: React.PropTypes.object,
    showOrganizations: React.PropTypes.bool,
    email: React.PropTypes.string,
    allGroupsLoaded: React.PropTypes.bool,
    groupsLoadedOrLoading: React.PropTypes.array,
    groupsLoadingObjects: React.PropTypes.array,
    errors: React.PropTypes.array,
    replicatingToAe: React.PropTypes.string,
    replicatingToAeTime: React.PropTypes.string,
    offlineIndexes: React.PropTypes.bool
  },

  getInitialState () {
    const formClassNames = window.innerWidth > 700 ? 'form form-horizontal' : 'form'
    return {
      formClassNames: formClassNames,
      errors: []
    }
  },

  componentDidMount () {
    window.addEventListener('resize', _.debounce(this.onResize, 150))
    this.listenTo(app.errorStore, this.onError)
  },

  componentWillUnmount () {
    window.removeEventListener('resize')
  },

  onError (errors) {
    this.setState({ errors })
  },

  onResize () {
    const thisWidth = React.findDOMNode(this).offsetWidth
    const formClassNames = thisWidth > 700 ? 'form form-horizontal' : 'form'
    this.setState({ formClassNames })
  },

  render () {
    const { allGroupsLoaded, groupsLoadedOrLoading, groupsLoadingObjects, object, synonymObjects, pcs, pcsQuerying, rcs, rcsQuerying, showImportPc, showImportRc, showExportieren, fieldsQuerying, fieldsQueryingError, taxonomyFields, pcFields, relationFields, showOrganizations, email, replicatingToAe, replicatingToAeTime, offlineIndexes } = this.props
    const { formClassNames, errors } = this.state
    const showObject = object && Object.keys(object).length > 0

    return (
      <fieldset id='main'>
        <form className={formClassNames} autoComplete='off'>
          <Errors errors={errors} />
          {showObject ?
            <Objekt
              object={object}
              synonymObjects={synonymObjects} />
            : null
          }
          {showImportPc ?
            <ImportPc
              email={email}
              pcs={pcs}
              offlineIndexes={offlineIndexes}
              groupsLoadedOrLoading={groupsLoadedOrLoading}
              groupsLoadingObjects={groupsLoadingObjects}
              allGroupsLoaded={allGroupsLoaded}
              replicatingToAe={replicatingToAe}
              replicatingToAeTime={replicatingToAeTime} />
            : null
          }
          {showImportRc ?
            <ImportRc
              email={email}
              rcs={rcs}
              offlineIndexes={offlineIndexes}
              groupsLoadedOrLoading={groupsLoadedOrLoading}
              groupsLoadingObjects={groupsLoadingObjects}
              allGroupsLoaded={allGroupsLoaded}
              replicatingToAe={replicatingToAe}
              replicatingToAeTime={replicatingToAeTime} />
            : null
          }
          {showExportieren ?
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
              offlineIndexes={offlineIndexes} />
            : null
          }
          {showOrganizations ?
            <Organizations
              email={email} />
            : null
          }
        </form>
      </fieldset>
    )
  }
})
