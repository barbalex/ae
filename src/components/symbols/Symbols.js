import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import Email from './Email.js'
import TcsQuerying from './TcsQuerying.js'
import PcsQuerying from './PcsQuerying.js'
import RcsQuerying from './RcsQuerying.js'
import FieldsQuerying from './FieldsQuerying.js'

const styles = StyleSheet.create({
  rootDiv: {
    position: 'absolute',
    right: 8,
    marginTop: 3,
    zIndex: 1
  },
  symbolDiv: {
    float: 'right'
  }
})

const Symbols = ({
  email,
  tcsQuerying,
  pcsQuerying,
  rcsQuerying,
  fieldsQuerying,
}) =>
  <div id="symbols" className={css(styles.rootDiv)}>
    <div className="pull-right">
      <div className={css(styles.symbolDiv)}>
        <Email email={email} />
      </div>
      <div className={css(styles.symbolDiv)}>
        {
          tcsQuerying &&
          <TcsQuerying />
        }
      </div>
      <div className={css(styles.symbolDiv)}>
        {
          pcsQuerying &&
          <PcsQuerying />
        }
      </div>
      <div className={css(styles.symbolDiv)}>
        {
          rcsQuerying &&
          <RcsQuerying />
        }
      </div>
      <div className={css(styles.symbolDiv)}>
        {
          fieldsQuerying &&
          <FieldsQuerying />
        }
      </div>
    </div>
  </div>

Symbols.displayName = 'Symbols'

Symbols.propTypes = {
  tcsQuerying: React.PropTypes.bool,
  pcsQuerying: React.PropTypes.bool,
  rcsQuerying: React.PropTypes.bool,
  fieldsQuerying: React.PropTypes.bool,
  email: React.PropTypes.string,
}

export default Symbols
