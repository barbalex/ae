'use strict'

import React from 'react'

export default React.createClass({
  displayName: 'InputNameBestehend',

  propTypes: {
    nameBestehend: React.PropTypes.string,
    email: React.PropTypes.string,
    pcs: React.PropTypes.array,
    onChangeNameBestehend: React.PropTypes.func
  },

  onChange (event) {
    const nameBestehend = event.target.value
    // pass variables to parent component
    this.props.onChangeNameBestehend(nameBestehend)
  },

  options () {
    const { email, pcs } = this.props

    if (pcs && pcs.length > 0) {
      let options = pcs.map(function (pc) {
        const name = pc.name
        const combining = pc.combining
        const importedBy = pc.importedBy
        // mutable: only those imported by user and combining pc's
        // or: user is admin
        const mutable = (importedBy === email || combining || Boolean(window.localStorage.admin))
        const className = mutable ? 'adbGruenFett' : 'adbGrauNormal'
        return (<option key={name} value={name} className={className} waehlbar={mutable}>{name}</option>)
      })
      // add an empty option at the beginning
      options.unshift(<option key='noValue' value='' waehlbar={true}></option>)
      return options
    } else {
      // this option is showed while loading
      return (<option value='' waehlbar={true}>Lade Daten...</option>)
    }
  },

  render () {
    const { nameBestehend } = this.props

    return (
      <div className='form-group'>
        <label className='control-label' htmlFor='nameBestehend'>Bestehende wählen</label>
        <select id='nameBestehend' className='form-control controls' selected={nameBestehend} onChange={this.onChange}>{this.options()}</select>
      </div>
    )
  }
})
