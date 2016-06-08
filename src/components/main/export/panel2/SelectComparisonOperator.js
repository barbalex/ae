import React from 'react'
import { FormControl } from 'react-bootstrap'
import { StyleSheet, css } from 'aphrodite'

const styles = StyleSheet.create({
  coSelect: {
    width: 45,
    paddingLeft: 3,
    paddingRight: 0,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0
  }
})

const SelectComparisonOperator = ({
  cNameKey,
  fNameKey,
  value,
  onChangeCoSelect
}) =>
  <FormControl
    componentClass="select"
    className={css(styles.coSelect)}
    value={value}
    onChange={(event) =>
      onChangeCoSelect(cNameKey, fNameKey, event)
    }
  >
    <option key={1} value={''}></option>
    <option key={2} value="=">&#61;</option>
    <option key={3} value=">">&#62;</option>
    <option key={4} value=">=">&#62;&#61;</option>
    <option key={5} value="<">&#60;</option>
    <option key={6} value="<=">&#60;&#61;</option>
  </FormControl>

SelectComparisonOperator.displayName = 'SelectComparisonOperator'

SelectComparisonOperator.propTypes = {
  cNameKey: React.PropTypes.string,
  fNameKey: React.PropTypes.string,
  onChangeCoSelect: React.PropTypes.func,
  value: React.PropTypes.string
}

export default SelectComparisonOperator
