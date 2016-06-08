import React from 'react'
import { Checkbox } from 'react-bootstrap'
import { StyleSheet, css } from 'aphrodite'

const styles = StyleSheet.create({
  cb: {
    marginTop: 13,
    marginBottom: 13,
    marginLeft: 8
  }
})

const CheckboxIncludeDataFromSynonyms = ({
  onChangeIncludeDataFromSynonyms,
  includeDataFromSynonyms
}) =>
  <Checkbox
    onChange={onChangeIncludeDataFromSynonyms}
    checked={includeDataFromSynonyms}
    className={css(styles.cb)}
  >
    <strong>Informationen von Synonymen berücksichtigen</strong><br />
    Informationen von synonymen Arten werden wie eigene Informationen behandelt
  </Checkbox>

CheckboxIncludeDataFromSynonyms.displayName = 'CheckboxIncludeDataFromSynonyms'

CheckboxIncludeDataFromSynonyms.propTypes = {
  onChangeIncludeDataFromSynonyms: React.PropTypes.func,
  includeDataFromSynonyms: React.PropTypes.bool
}

export default CheckboxIncludeDataFromSynonyms
