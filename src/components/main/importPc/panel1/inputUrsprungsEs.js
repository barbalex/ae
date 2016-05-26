'use strict'

import React from 'react'
import { OverlayTrigger, Popover } from 'react-bootstrap'
import { map } from 'lodash'

const options = (pcs) => {
  // don't want combining pcs
  let myOptions = pcs.filter((pc) => !pc.combining)
  myOptions = map(myOptions, 'name')
  myOptions = myOptions.map((name, index) => (
    <option
      key={index}
      value={name}
    >
      {name}
    </option>
  ))
  // add an empty option at the beginning
  myOptions.unshift(
    <option
      key="noValue"
      value=""
    >
    </option>
  )
  return myOptions
}

const popover = () => (
  <Popover
    id="InputUrsprungsEsPopover"
    title='Was heisst "eigenständig"?'
  >
    <p>
      Eine zusammenfassende Eigenschaftensammlung wird zwei mal importiert:
    </p>
    <ol>
      <li>
        Als <strong>eigenständige</strong> Eigenschaftensammlung.
      </li>
      <li>
        Gemeinsam mit bzw. zusätzlich zu anderen in eine
        <strong>zusammenfassende</strong> Eigenschaftensammlung.
      </li>
    </ol>
    <p>
      Wählen Sie hier den Namen der eigenständigen Sammlung.
    </p>
    <p>
      <strong>Zweck:</strong> In der zusammenfassenden Sammlung ist
      bei jedem Datensatz beschrieben, woher er stammt.
    </p>
  </Popover>
)

const InputUrsprungsEs = ({
  nameUrsprungsEs,
  validUrsprungsEs,
  pcs,
  onChangeNameUrsprungsEs
}) =>
  <div
    className={validUrsprungsEs ? 'form-group' : 'form-group has-error'}
  >
    <OverlayTrigger
      trigger={['click', 'focus']}
      rootClose
      placement="right"
      overlay={popover()}
    >
      <label
        className="control-label withPopover"
        id="dsUrsprungsDsLabel"
      >
        eigenständige Eigenschaftensammlung
      </label>
    </OverlayTrigger>
    <select
      className="form-control controls input-sm"
      selected={nameUrsprungsEs}
      onChange={(event) =>
        onChangeNameUrsprungsEs(event.target.value)
      }
    >
      {options(pcs)}
    </select>
    {
      !validUrsprungsEs &&
      <div className="validateDiv feld">
        Bitte wählen Sie die eigenständige Eigenschaftensammlung
      </div>
    }
  </div>

InputUrsprungsEs.displayName = 'InputUrsprungsEs'

InputUrsprungsEs.propTypes = {
  nameUrsprungsEs: React.PropTypes.string,
  pcs: React.PropTypes.array,
  validUrsprungsEs: React.PropTypes.bool,
  onChangeNameUrsprungsEs: React.PropTypes.func
}

export default InputUrsprungsEs
