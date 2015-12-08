'use strict'

import React from 'react'

export default React.createClass({
  displayName: 'InputOrganisationMitSchreibrecht',

  propTypes: {
    orgMitSchreibrecht: React.PropTypes.string,
    organizations: React.PropTypes.array,
    onChangeOrgMitSchreibrecht: React.PropTypes.func
  },

  onChange (event) {
    const orgMitSchreibrecht = event.target.value

  },

  options () {
    const { organizations } = this.props

    console.log('organizations', organizations)

    if (organizations && organizations.length > 0) {
      let options = organizations.map((org, index) => {
        return (
          <option
            key={index}
            value={org.Name}>
            {org.Name}
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
