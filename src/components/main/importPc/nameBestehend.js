'use strict'

import React from 'react'
import _ from 'lodash'

export default React.createClass({
  displayName: 'NameBestehend',

  propTypes: {
    nameBestehend: React.PropTypes.string,
    email: React.PropTypes.string,
    pcs: React.PropTypes.array,
    onChangeNameBestehend: React.PropTypes.func
  },

  getInitialState () {
    return { nameBestehend: null }
  },

  onChange (event) {
    const nameBestehend = event.target.value
    const editingPcIsAllowed = this.isEditingAllowed(nameBestehend)
    if (editingPcIsAllowed) this.setState({ nameBestehend: nameBestehend })
    // pass variables to parent component
    const { onChangeNameBestehend } = this.props
    onChangeNameBestehend(nameBestehend)
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

  isEditingAllowed (name) {
    const { pcs, email } = this.props
    // check if this name exists
    // if so and it is not combining: check if it was imported by the user
    const samePc = _.find(pcs, function (pc) {
      return pc.name === name
    })
    const editingAllowed = !samePc || (samePc && (samePc.combining || samePc.importedBy === email))
    return editingAllowed
  },

  render () {
    const { nameBestehend } = this.state

    return (
      <div className='form-group'>
        <label className='control-label' htmlFor='nameBestehend'>Bestehende wählen</label>
        <select id='nameBestehend' className='form-control controls' selected={nameBestehend} onChange={this.onChange}>{this.options()}</select>
      </div>
    )
  }
})
