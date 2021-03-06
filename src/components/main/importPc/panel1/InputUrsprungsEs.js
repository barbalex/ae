import React from 'react'
import { OverlayTrigger, Popover, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { map } from 'lodash'
import { StyleSheet, css } from 'aphrodite'
import labelWithPopover from '../../../../styles/labelWithPopover.js'
import validateDiv from '../../../../styles/validateDiv.js'

const styles = StyleSheet.create({
  label: labelWithPopover(),
  validateDiv: validateDiv()
})

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
  <div>
    <FormGroup
      validationState={validUrsprungsEs ? null : 'error'}
    >
      <OverlayTrigger
        trigger={['click', 'focus']}
        rootClose
        placement="right"
        overlay={popover()}
      >
        <ControlLabel
          className={css(styles.label)}
        >
          eigenständige Eigenschaftensammlung
        </ControlLabel>
      </OverlayTrigger>
      <FormControl
        componentClass="select"
        selected={nameUrsprungsEs}
        onChange={(event) =>
          onChangeNameUrsprungsEs(event.target.value)
        }
      >
        {options(pcs)}
      </FormControl>
    </FormGroup>
    {
      !validUrsprungsEs &&
      <FormGroup>
        <ControlLabel style={{ display: 'block' }} />
        <div style={{ width: '100%', marginTop: '-14px' }} className={css(styles.validateDiv)}>
          Bitte wählen Sie die eigenständige Eigenschaftensammlung
        </div>
      </FormGroup>
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
