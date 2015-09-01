'use strict'

import React from 'react'
import { OverlayTrigger, Popover } from 'react-bootstrap'
import _ from 'lodash'

export default React.createClass({
  displayName: 'SelectUrsprungsEs',

  propTypes: {
    nameUrsprungsEs: React.PropTypes.string,
    pcs: React.PropTypes.array,
    validUrsprungsEs: React.PropTypes.bool,
    onChangeNameUrsprungsEs: React.PropTypes.func
  },

  getInitialState () {
    return { nameUrsprungsEs: null }
  },

  onChangeNameUrsprungsEs (event) {
    const nameUrsprungsEs = event.target.value
    this.setState({ nameUrsprungsEs: nameUrsprungsEs })
    // tell parent component
    const { onChangeNameUrsprungsEs } = this.props
    onChangeNameUrsprungsEs(nameUrsprungsEs)
  },

  ursprungsEsOptions () {
    const { pcs } = this.props
    // don't want combining pcs
    let options = _.filter(pcs, function (pc) {
      return !pc.combining
    })
    options = _.pluck(options, 'name')
    options = options.map(function (name) {
      return (<option key={name} value={name}>{name}</option>)
    })
    // add an empty option at the beginning
    options.unshift(<option key='noValue' value=''></option>)
    return options
  },

  ursprungsEsPopover () {
    return (
      <Popover title='Was heisst "eigenständig"?'>
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
    const { nameUrsprungsEs } = this.state
    const { validUrsprungsEs } = this.props

    return (
      <div className={validUrsprungsEs ? 'form-group' : 'form-group has-error'}>
        <OverlayTrigger trigger='click' placement='right' overlay={this.ursprungsEsPopover()}>
          <OverlayTrigger trigger={['hover', 'focus']} placement='right' overlay={this.ursprungsEsPopover()}>
            <label className='control-label withPopover' htmlFor='dsUrsprungsDs' id='dsUrsprungsDsLabel'>eigenständige Eigenschaftensammlung</label>
          </OverlayTrigger>
        </OverlayTrigger>
        <select className='form-control controls input-sm' id='dsUrsprungsDs' selected={nameUrsprungsEs} onChange={this.onChangeNameUrsprungsEs}>{this.ursprungsEsOptions()}</select>
        {validUrsprungsEs ? null : <div className='validateDiv feld'>Bitte wählen Sie die eigenständige Eigenschaftensammlung</div>}
      </div>
    )
  }
})
