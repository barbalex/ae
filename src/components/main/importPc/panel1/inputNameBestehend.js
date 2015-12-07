'use strict'

import React from 'react'

export default React.createClass({
  displayName: 'InputNameBestehend',

  propTypes: {
    groupsLoadedOrLoading: React.PropTypes.array,
    nameBestehend: React.PropTypes.string,
    email: React.PropTypes.string,
    pcs: React.PropTypes.array,
    onChangeNameBestehend: React.PropTypes.func
  },

  onChangeCoSelect (fName, event) {
    console.log('coSelect for ' + fName + ':', event.target.value)
  },

  onChange (event) {
    const nameBestehend = event.target.value
    // pass variables to parent component
    this.props.onChangeNameBestehend(nameBestehend)
  },

  options () {
    const { email, pcs, groupsLoadedOrLoading } = this.props

    if (pcs && pcs.length > 0) {
      let options = pcs.map((pc, index) => {
        const name = pc.name
        const combining = pc.combining
        const importedBy = pc.importedBy
        // mutable: only those imported by user and combining pc's
        // or: user is admin
        const mutable = (importedBy === email || combining || Boolean(window.localStorage.admin))
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
          {this.options()}
        </select>
      </div>
    )
  }
})
