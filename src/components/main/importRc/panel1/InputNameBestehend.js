import React from 'react'
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap'
import { StyleSheet, css } from 'aphrodite'
import isUserServerAdmin from '../../../../modules/isUserServerAdmin.js'
import isUserOrgAdmin from '../../../../modules/isUserOrgAdmin.js'
import isUserEsWriter from '../../../../modules/isUserEsWriter.js'

const styles = StyleSheet.create({
  mutable: {
    color: 'black',
    fontWeight: 'bold',
  },
  immutable: {
    color: '#B2B2B2',
    fontWeight: 'normal',
  }
})

const options = (userRoles, rcs) => {
  if (rcs && rcs.length > 0) {
    const myOptions = rcs.map((rc, index) => {
      const { name, combining, organization } = rc
      // mutable if user is: esWriter of org, admin of org, db/server-Admin
      const mutable = (
        isUserServerAdmin(userRoles) ||
        isUserOrgAdmin(userRoles, organization) ||
        isUserEsWriter(userRoles, organization) ||
        combining
      )
      return (
        <option
          key={index}
          value={name}
          className={css(styles[mutable ? 'mutable' : 'immutable'])}
        >
          {name}
        </option>
      )
    })
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
      Keine Gruppe geladen
    </option>
  )
}

const InputNameBestehend = ({
  nameBestehend,
  onChangeNameBestehend,
  userRoles,
  rcs
}) =>
  <FormGroup controlId="nameBestehend">
    <ControlLabel>
      Bestehende wählen
    </ControlLabel>
    <FormControl
      componentClass="select"
      selected={nameBestehend}
      onChange={(event) =>
        onChangeNameBestehend(event.target.value)
      }
    >
      {options(userRoles, rcs)}
    </FormControl>
  </FormGroup>

InputNameBestehend.displayName = 'InputNameBestehend'

InputNameBestehend.propTypes = {
  nameBestehend: React.PropTypes.string,
  email: React.PropTypes.string,
  userRoles: React.PropTypes.array,
  rcs: React.PropTypes.array,
  onChangeNameBestehend: React.PropTypes.func,
  userIsEsWriterInOrgs: React.PropTypes.array
}

export default InputNameBestehend
