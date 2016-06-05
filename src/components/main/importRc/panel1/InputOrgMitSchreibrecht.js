'use strict'

import React from 'react'
import { OverlayTrigger, Popover, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { StyleSheet, css } from 'aphrodite'
import labelWithPopover from '../../../../styles/labelWithPopover.js'
import validateDiv from '../../../../styles/validateDiv.js'

const styles = StyleSheet.create({
  label: labelWithPopover(),
  validateDiv: validateDiv()
})

const options = (userIsEsWriterInOrgs) => {
  if (userIsEsWriterInOrgs && userIsEsWriterInOrgs.length > 0) {
    const myOptions = userIsEsWriterInOrgs.map((org, index) => (
      <option
        key={index}
        value={org}
      >
        {org}
      </option>
    ))
    // add an empty option at the beginning
    myOptions.unshift(
      <option
        key="noValue"
        value={null}
      >
      </option>
    )
    return myOptions
  }
  return (
    <option value={null}>
      Keine Organisation geladen
    </option>
  )
}

const popover = () =>
  <Popover
    id="inputOrganisationMitSchreibrechtPopover"
    title="Was heisst das?"
  >
    <p>
      Diese Organisation verwaltet die Beziehungssammlung.
    </p>
    <p>
      Sie bestimmt, wer sie verändern kann, bzw. wer importieren kann.
    </p>
  </Popover>

const InputOrganisationMitSchreibrecht = ({
  orgMitSchreibrecht,
  onChangeOrgMitSchreibrecht,
  userIsEsWriterInOrgs,
  validOrgMitSchreibrecht
}) => (
  <div>
    <FormGroup
      validationState={validOrgMitSchreibrecht ? null : 'error'}
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
          Organisation mit Schreibrecht
        </ControlLabel>
      </OverlayTrigger>
      <FormControl
        componentClass="select"
        value={orgMitSchreibrecht}
        onChange={onChangeOrgMitSchreibrecht}
      >
        {options(userIsEsWriterInOrgs)}
      </FormControl>
    </FormGroup>
    {
      !validOrgMitSchreibrecht &&
      <FormGroup>
        <ControlLabel style={{ display: 'block' }} />
        <div style={{ width: '100%', marginTop: '-14px' }} className={css(styles.validateDiv)}>
          Es muss eine Organisation mit Schreibrecht gewählt sein
        </div>
      </FormGroup>
    }
  </div>
)


InputOrganisationMitSchreibrecht.displayName = 'InputOrganisationMitSchreibrecht'

InputOrganisationMitSchreibrecht.propTypes = {
  orgMitSchreibrecht: React.PropTypes.string,
  validOrgMitSchreibrecht: React.PropTypes.bool,
  onChangeOrgMitSchreibrecht: React.PropTypes.func,
  userIsEsWriterInOrgs: React.PropTypes.array
}

export default InputOrganisationMitSchreibrecht
