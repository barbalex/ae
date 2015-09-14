'use strict'

import React from 'react'
import { OverlayTrigger, Popover } from 'react-bootstrap'
import _ from 'lodash'

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
    let options = _.filter(rcs, (rc) => !rc.combining)
    options = _.pluck(options, 'name')
    options = options.map((name, index) => <option key={index} value={name}>{name}</option>)
    // add an empty option at the beginning
    options.unshift(<option key='noValue' value=''></option>)
    return options
  },

  popover () {
    return (
      <Popover id='InputUrsprungsBsPopover' title='Was heisst "eigenständig"?'>
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

  render () {
    const { nameUrsprungsBs, validUrsprungsBs } = this.props

    return (
      <div className={validUrsprungsBs ? 'form-group' : 'form-group has-error'}>
        <OverlayTrigger trigger='click' placement='right' overlay={this.popover()}>
          <OverlayTrigger trigger={['hover', 'focus']} placement='right' overlay={this.popover()}>
            <label className='control-label withPopover' htmlFor='dsUrsprungsDs' id='dsUrsprungsDsLabel'>eigenständige Beziehungssammlung</label>
          </OverlayTrigger>
        </OverlayTrigger>
        <select className='form-control controls input-sm' id='dsUrsprungsDs' selected={nameUrsprungsBs} onChange={this.onChange}>{this.options()}</select>
        {validUrsprungsBs ? null : <div className='validateDiv feld'>Bitte wählen Sie die eigenständige Beziehungssammlung</div>}
      </div>
    )
  }
})
