'use strict'

import React from 'react'
import { OverlayTrigger, Popover } from 'react-bootstrap'
import _ from 'lodash'

export default React.createClass({
  displayName: 'InputUrsprungsEs',

  propTypes: {
    nameUrsprungsEs: React.PropTypes.string,
    pcs: React.PropTypes.array,
    validUrsprungsEs: React.PropTypes.bool,
    onChangeNameUrsprungsEs: React.PropTypes.func
  },

  onChange (event) {
    const nameUrsprungsEs = event.target.value
    // tell parent component
    this.props.onChangeNameUrsprungsEs(nameUrsprungsEs)
  },

  options () {
    const { pcs } = this.props
    // don't want combining pcs
    let options = pcs.filter((pc) => !pc.combining)
    options = _.pluck(options, 'name')
    options = options.map((name, index) => <option key={index} value={name}>{name}</option>)
    // add an empty option at the beginning
    options.unshift(<option key='noValue' value=''></option>)
    return options
  },

  popover () {
    return (
      <Popover id='InputUrsprungsEsPopover' title='Was heisst "eigenständig"?'>
        <p>Eine zusammenfassende Eigenschaftensammlung wird zwei mal importiert:</p>
        <ol>
          <li>Als <strong>eigenständige</strong> Eigenschaftensammlung.</li>
          <li>Gemeinsam mit bzw. zusätzlich zu anderen in eine <strong>zusammenfassende</strong> Eigenschaftensammlung.</li>
        </ol>
        <p>Wählen Sie hier den Namen der eigenständigen Sammlung.</p>
        <p><strong>Zweck:</strong> In der zusammenfassenden Sammlung ist bei jedem Datensatz beschrieben, woher er stammt.</p>
      </Popover>
    )
  },

  render () {
    const { nameUrsprungsEs, validUrsprungsEs } = this.props

    return (
      <div className={validUrsprungsEs ? 'form-group' : 'form-group has-error'}>
        <OverlayTrigger trigger={['click', 'focus']} rootClose placement='right' overlay={this.popover()}>
          <label className='control-label withPopover' id='dsUrsprungsDsLabel'>eigenständige Eigenschaftensammlung</label>
        </OverlayTrigger>
        <select className='form-control controls input-sm' selected={nameUrsprungsEs} onChange={this.onChange}>{this.options()}</select>
        {validUrsprungsEs ? null : <div className='validateDiv feld'>Bitte wählen Sie die eigenständige Eigenschaftensammlung</div>}
      </div>
    )
  }
})
