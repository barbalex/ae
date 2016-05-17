'use strict'

import React from 'react'
import { OverlayTrigger } from 'react-bootstrap'
import { map } from 'lodash'
import inputUrsprungsBsPopover from './inputUrsprungsBsPopover'

const nameUrsprungsBsOptions = (rcs) => {
  // don't want combining rcs
  let options = rcs.filter((rc) => !rc.combining)
  options = map(options, 'name')
  options = options.map((name, index) => <option key={index} value={name}>{name}</option>)
  // add an empty option at the beginning
  options.unshift(<option key="noValue" value=""></option>)
  return options
}

const InputUrsprungsBs = ({ nameUrsprungsBs, validUrsprungsBs, onChangeNameUrsprungsBs, rcs }) => (
  <div
    className={validUrsprungsBs ? 'form-group' : 'form-group has-error'}
  >
    <OverlayTrigger
      trigger={['click', 'focus']}
      rootClose
      placement="right"
      overlay={inputUrsprungsBsPopover}
    >
      <label
        className="control-label withPopover"
        id="dsUrsprungsDsLabel"
      >
        eigenständige Beziehungssammlung
      </label>
    </OverlayTrigger>
    <select
      className="form-control controls input-sm"
      selected={nameUrsprungsBs}
      onChange={(event) => onChangeNameUrsprungsBs(event.target.value)}
    >
      {nameUrsprungsBsOptions(rcs)}
    </select>
    {
      !validUrsprungsBs &&
      <div
        className="validateDiv feld"
      >
        Bitte wählen Sie die eigenständige Beziehungssammlung
      </div>
    }
  </div>
)

InputUrsprungsBs.displayName = 'InputUrsprungsBs'

InputUrsprungsBs.propTypes = {
  nameUrsprungsBs: React.PropTypes.string,
  rcs: React.PropTypes.array,
  validUrsprungsBs: React.PropTypes.bool,
  onChangeNameUrsprungsBs: React.PropTypes.func
}

export default InputUrsprungsBs
