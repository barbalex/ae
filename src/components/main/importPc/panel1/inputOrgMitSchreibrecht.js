'use strict'

import React from 'react'

export default React.createClass({
  displayName: 'InputOrganisationMitSchreibrecht',

  propTypes: {
    orgMitSchreibrecht: React.PropTypes.string,
    onChangeOrgMitSchreibrecht: React.PropTypes.func,
    userIsEsWriterInOrgs: React.PropTypes.array
  },

  options () {
    const { userIsEsWriterInOrgs } = this.props

    if (userIsEsWriterInOrgs && userIsEsWriterInOrgs.length > 0) {
      let options = userIsEsWriterInOrgs.map((org, index) => {
        return (
          <option
            key={index}
            value={org}>
            {org}
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
    } else {
      return (
        <option
          value={null}>
          Keine Organisation geladen
        </option>
      )
    }
  },

  render () {
    const { orgMitSchreibrecht, onChangeOrgMitSchreibrecht } = this.props

    return (
      <div
        className='form-group'>
        <label
          className='control-label'
          htmlFor='orgMitSchreibrecht'>
          Organisation mit Schreibrecht
        </label>
        <select
          id='orgMitSchreibrecht'
          className='form-control controls'
          selected={orgMitSchreibrecht}
          onChange={onChangeOrgMitSchreibrecht}>
          {this.options()}
        </select>
      </div>
    )
  }
})
