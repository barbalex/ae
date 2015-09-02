/*
 * contains ui for main
 * changes ui depending on size of window
 */

'use strict'

import React from 'react'
import Objekt from './object/object.js'
import ImportPc from './importPc/importPc.js'
import Organizations from './organizations.js'

export default React.createClass({
  displayName: 'Main',

  propTypes: {
    object: React.PropTypes.object,
    synonymObjects: React.PropTypes.array,
    showImportPC: React.PropTypes.bool,
    showImportRC: React.PropTypes.bool,
    showOrganizations: React.PropTypes.bool,
    email: React.PropTypes.string,
    groupsLoadedOrLoading: React.PropTypes.array
  },

  getInitialState () {
    const formClassNames = window.innerWidth > 700 ? 'form form-horizontal' : 'form'
    return {
      formClassNames: formClassNames
    }
  },

  componentDidMount () {
    window.addEventListener('resize', this.onResize)
  },

  componentWillUnmount () {
    window.removeEventListener('resize')
  },

  onResize () {
    const thisWidth = React.findDOMNode(this).offsetWidth
    const formClassNames = thisWidth > 700 ? 'form form-horizontal' : 'form'
    this.setState({
      formClassNames: formClassNames
    })
  },

  render () {
    const { groupsLoadedOrLoading, object, synonymObjects, showImportPC/*, showImportRC*/, showOrganizations, email } = this.props
    const { formClassNames } = this.state
    const showObject = object !== undefined

    return (
      <fieldset id='main'>
        <form className={formClassNames} autoComplete='off'>
          {showObject ? <Objekt object={object} synonymObjects={synonymObjects} /> : ''}
          {showImportPC ? <ImportPc email={email} groupsLoadedOrLoading={groupsLoadedOrLoading} /> : ''}
          {showOrganizations ? <Organizations email={email} /> : ''}
        </form>
      </fieldset>
    )
  }
})
