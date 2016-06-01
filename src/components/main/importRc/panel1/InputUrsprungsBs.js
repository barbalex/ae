'use strict'

import React from 'react'
import { OverlayTrigger, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { map } from 'lodash'
import { StyleSheet, css } from 'aphrodite'
import inputUrsprungsBsPopover from './InputUrsprungsBsPopover'
import labelWithPopover from '../../../../styles/labelWithPopover.js'

const styles = StyleSheet.create({
  label: labelWithPopover()
})

const nameUrsprungsBsOptions = (rcs) => {
  // don't want combining rcs
  let options = rcs.filter((rc) =>
    !rc.combining
  )
  options = map(options, 'name')
  options = options.map((name, index) =>
    <option key={index} value={name}>{name}</option>
  )
  // add an empty option at the beginning
  options.unshift(<option key="noValue" value=""></option>)
  return options
}

const InputUrsprungsBs = ({
  nameUrsprungsBs,
  validUrsprungsBs,
  onChangeNameUrsprungsBs,
  rcs
}) => (
  <div>
    <FormGroup
      validationState={validUrsprungsBs ? null : 'error'}
    >
      <OverlayTrigger
        trigger={['click', 'focus']}
        rootClose
        placement="right"
        overlay={inputUrsprungsBsPopover}
      >
        <ControlLabel
          className={css(styles.label)}
        >
          eigenständige Beziehungssammlung
        </ControlLabel>
      </OverlayTrigger>
      <FormControl
        componentClass="select"
        selected={nameUrsprungsBs}
        onChange={(event) =>
          onChangeNameUrsprungsBs(event.target.value)
        }
      >
        {nameUrsprungsBsOptions(rcs)}
      </FormControl>
    </FormGroup>
    {
      !validUrsprungsBs &&
      <FormGroup>
        <ControlLabel style={{ display: 'block' }} />
        <div style={{ width: '100%', marginTop: '-14px' }} className="validateDiv">
          Bitte wählen Sie die eigenständige Beziehungssammlung
        </div>
      </FormGroup>
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
