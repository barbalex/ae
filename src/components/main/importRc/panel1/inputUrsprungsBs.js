'use strict'

import React from 'react'
import { OverlayTrigger, Popover } from 'react-bootstrap'
import { map } from 'lodash'

export default React.createClass({
  displayName: 'InputUrsprungsBs',

  propTypes: {
    nameUrsprungsBs: React.PropTypes.string,
    rcs: React.PropTypes.array,
    validUrsprungsBs: React.PropTypes.bool,
    onChangeNameUrsprungsBs: React.PropTypes.func
  },

  onChange (event) {
    const nameUrsprungsBs = event.target.value
    // tell parent component
    this.props.onChangeNameUrsprungsBs(nameUrsprungsBs)
  },

  options () {
    const { rcs } = this.props
    // don't want combining rcs
    let options = rcs.filter((rc) => !rc.combining)
    options = map(options, 'name')
    options = options.map((name, index) => <option key={index} value={name}>{name}</option>)
    // add an empty option at the beginning
    options.unshift(<option key='noValue' value=''></option>)
    return options
  },

  popover() {
    return (
      <Popover id='InputUrsprungsBsPopover' trigger={['click', 'focus']} title='Was heisst "eigenständig"?'>
        <p>Eine zusammenfassende Beziehungssammlung wird zwei mal importiert:</p>
        <ol>
          <li>Als <strong>eigenständige</strong> Beziehungssammlung.</li>
          <li>Gemeinsam mit bzw. zusätzlich zu anderen in eine <strong>zusammenfassende</strong> Beziehungssammlung.</li>
        </ol>
        <p>Wählen Sie hier den Namen der eigenständigen Sammlung.</p>
        <p><strong>Zweck:</strong> In der zusammenfassenden Sammlung ist bei jedem Datensatz beschrieben, woher er stammt.</p>
      </Popover>
    )
  },

  render() {
    const { nameUrsprungsBs, validUrsprungsBs } = this.props

    return (
      <div className={validUrsprungsBs ? 'form-group' : 'form-group has-error'}>
        <OverlayTrigger trigger={['click', 'focus']} rootClose placement='right' overlay={this.popover()}>
          <label className='control-label withPopover' id='dsUrsprungsDsLabel'>eigenständige Beziehungssammlung</label>
        </OverlayTrigger>
        <select className='form-control controls input-sm' selected={nameUrsprungsBs} onChange={this.onChange}>{this.options()}</select>
        {validUrsprungsBs ? null : <div className='validateDiv feld'>Bitte wählen Sie die eigenständige Beziehungssammlung</div>}
      </div>
    )
  }
})
