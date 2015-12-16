'use strict'

import React from 'react'
import { OverlayTrigger, Popover } from 'react-bootstrap'

export default React.createClass({
  displayName: 'InputOrganisationMitSchreibrecht',

  propTypes: {
    orgMitSchreibrecht: React.PropTypes.string,
    validOrgMitSchreibrecht: React.PropTypes.bool,
    onChangeOrgMitSchreibrecht: React.PropTypes.func,
    userIsEsWriterInOrgs: React.PropTypes.array
  },

  popover () {
    return (
      <Popover
        id='inputOrganisationMitSchreibrechtPopover'
        title='Was heisst das?'>
        <p>Diese Organisation verwaltet die Eigenschaftensammlung.</p>
        <p>Sie bestimmt, wer sie verändern kann, bzw. wer importieren kann.</p>
      </Popover>
    )
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
    const { orgMitSchreibrecht, onChangeOrgMitSchreibrecht, userIsEsWriterInOrgs, validOrgMitSchreibrecht } = this.props
    // const selected = userIsEsWriterInOrgs && userIsEsWriterInOrgs.length === 1 ? userIsEsWriterInOrgs[0] : null

    return (
      <div
        className={validOrgMitSchreibrecht ? 'form-group' : 'form-group has-error'}>
        <OverlayTrigger
          trigger={['click', 'focus']}
          rootClose
          placement='right'
          overlay={this.popover()}>
          <label
            className='control-label withPopover'>
            Organisation mit Schreibrecht
          </label>
        </OverlayTrigger>
        <select
          className='form-control controls'
          value={orgMitSchreibrecht}
          onChange={onChangeOrgMitSchreibrecht}>
          {this.options()}
        </select>
        {
          validOrgMitSchreibrecht
          ? null
          : <div
              className='validateDiv feld'>
              Es muss eine Organisation mit Schreibrecht gewählt sein
            </div>
        }
      </div>
    )
  }
})
