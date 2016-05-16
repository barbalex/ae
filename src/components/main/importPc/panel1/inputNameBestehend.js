'use strict'

import React from 'react'
import isUserServerAdmin from '../../../../modules/isUserServerAdmin.js'
import isUserOrgAdmin from '../../../../modules/isUserOrgAdmin.js'
import isUserEsWriter from '../../../../modules/isUserEsWriter.js'

export default React.createClass({
  displayName: 'InputNameBestehend',

  propTypes: {
    groupsLoadedOrLoading: React.PropTypes.array,
    nameBestehend: React.PropTypes.string,
    email: React.PropTypes.string,
    userRoles: React.PropTypes.array,
    pcs: React.PropTypes.array,
    onChangeNameBestehend: React.PropTypes.func,
    userIsEsWriterInOrgs: React.PropTypes.array
  },

  onChangeCoSelect (fName, event) {
    console.log('coSelect for ' + fName + ':', event.target.value)
  },

  onChange(event) {
    const nameBestehend = event.target.value
    // pass variables to parent component
    this.props.onChangeNameBestehend(nameBestehend)
  },

  options () {
    const { userRoles, pcs, groupsLoadedOrLoading } = this.props
    // TODO: check if user is writer in pcs's organization instead of imported by

    if (pcs && pcs.length > 0) {
      let options = pcs.map((pc, index) => {
        const { name, combining, organization } = pc
        // mutable if user is: esWriter of org, admin of org, db/server-Admin
        const mutable = isUserServerAdmin(userRoles) || isUserOrgAdmin(userRoles, organization) || isUserEsWriter(userRoles, organization) || combining
        const className = mutable ? 'adbGruenFett' : 'adbGrauNormal'
        return (
          <option
            key={index}
            value={name}
            className={className}>
            {name}
          </option>
        )
      })
      // add an empty option at the beginning
      options.unshift(
        <option
          key='noValue'
          value={null}>
        </option>
      )
      return options
    } else if (groupsLoadedOrLoading.length > 0) {
      // this option is showed while loading
      return (
        <option
          value={null}>
          Lade Daten...
        </option>
      )
    } else {
      return (
        <option
          value={null}>
          Keine Gruppe geladen
        </option>
      )
    }
  },

  render() {
    const { nameBestehend } = this.props

    return (
      <div
        className='form-group'>
        <label
          className='control-label'
          htmlFor='nameBestehend'>
          Bestehende wählen
        </label>
        <select
          id='nameBestehend'
          className='form-control controls'
          selected={nameBestehend}
          onChange={this.onChange}>
          {this.options()}
        </select>
      </div>
    )
  }
})
