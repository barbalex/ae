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
import Organizations from './organizations.js'
import Errors from './errors.js'

export default React.createClass({
  displayName: 'Main',

  mixins: [ListenerMixin],

  propTypes: {
    object: React.PropTypes.object,
    synonymObjects: React.PropTypes.array,
    showImportPc: React.PropTypes.bool,
    showImportRc: React.PropTypes.bool,
    showOrganizations: React.PropTypes.bool,
    email: React.PropTypes.string,
    allGroupsLoaded: React.PropTypes.bool,
    groupsLoadedOrLoading: React.PropTypes.array,
    groupsLoadingObjects: React.PropTypes.array,
    errors: React.PropTypes.array,
    replicatingToAe: React.PropTypes.string,
    replicatingToAeTime: React.PropTypes.string
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
    const { allGroupsLoaded, groupsLoadedOrLoading, groupsLoadingObjects, object, synonymObjects, showImportPc, showImportRc, showOrganizations, email, replicatingToAe, replicatingToAeTime } = this.props
    const { formClassNames, errors } = this.state
    const showObject = object !== undefined

    return (
      <fieldset id='main'>
        <form className={formClassNames} autoComplete='off'>
          <Errors errors={errors} />
          {showObject ?
            <Objekt
              object={object}
              synonymObjects={synonymObjects} />
            : ''
          }
          {showImportPc ?
            <ImportPc
              email={email}
              groupsLoadedOrLoading={groupsLoadedOrLoading}
              groupsLoadingObjects={groupsLoadingObjects}
              allGroupsLoaded={allGroupsLoaded}
              replicatingToAe={replicatingToAe}
              replicatingToAeTime={replicatingToAeTime} />
            : ''
          }
          {showImportRc ?
            <ImportRc
              email={email}
              groupsLoadedOrLoading={groupsLoadedOrLoading}
              groupsLoadingObjects={groupsLoadingObjects}
              allGroupsLoaded={allGroupsLoaded}
              replicatingToAe={replicatingToAe}
              replicatingToAeTime={replicatingToAeTime} />
            : ''
          }
          {showOrganizations ?
            <Organizations
              email={email} />
            : ''
          }
        </form>
      </fieldset>
    )
  }
})
