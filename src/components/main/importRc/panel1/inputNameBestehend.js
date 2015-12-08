'use strict'

import React from 'react'

export default React.createClass({
  displayName: 'InputNameBestehend',

  propTypes: {
    groupsLoadedOrLoading: React.PropTypes.array,
    nameBestehend: React.PropTypes.string,
    email: React.PropTypes.string,
    rcs: React.PropTypes.array,
    onChangeNameBestehend: React.PropTypes.func,
    userIsEsWriterInOrgs: React.PropTypes.array
  },

  onChange (event) {
    const nameBestehend = event.target.value
    // pass variables to parent component
    this.props.onChangeNameBestehend(nameBestehend)
  },

  options () {
    const { email, rcs, groupsLoadedOrLoading, userIsEsWriterInOrgs } = this.props
    // TODO: check if user is writer in pcs's organization instead of imported by

    if (rcs && rcs.length > 0) {
      let options = rcs.map((rc, index) => {
        const name = rc.name
        const combining = rc.combining
        const importedBy = rc.importedBy
        // mutable: only those imported by user and combining rc's
        // or: user is admin
        const mutable = (importedBy === email || combining || Boolean(window.localStorage.admin))
        const className = mutable ? 'adbGruenFett' : 'adbGrauNormal'
        return <option key={index} value={name} className={className}>{name}</option>
      })
      // add an empty option at the beginning
      options.unshift(<option key='noValue' value={null}></option>)
      return options
    } else if (groupsLoadedOrLoading && groupsLoadedOrLoading.length > 0) {
      // this option is showed while loading
      return <option value={null}>Lade Daten...</option>
    } else {
      return <option value={null}>Keine Gruppe geladen</option>
    }
  },

  render () {
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
          {
            this.options()
          }
        </select>
      </div>
    )
  }
})
