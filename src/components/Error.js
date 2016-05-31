'use strict'

import React from 'react'
import { StyleSheet, css } from 'aphrodite'

/**
 * need to stringify error.msg
 * because it seems that in some cases
 * it is an object and contains < and >
 * and this creates an error in jsx
 */
const Error = ({ errors, error, index }) => {
  const styles = StyleSheet.create({
    errorContainer: {
      border: 'none'
    },
    hr: {
      marginTop: 8,
      marginBottom: 8,
      boxShadow: '0 5px 10px rgba(0, 0, 0, 0.2)',
      border: '1px solid #CCC'
    },
    error: {
      paddingLeft: 10,
      // make room for the remove symbol
      paddingRight: index === 0 ? 27 : 10
    },
    errorTitleP: {
      // less margin if there is a msg
      marginBottom: error.msg ? 0 : 10
    },
    errorMsgP: {
      // more margin, if there is no title
      marginBottom: error.title ? '-2px' : 10
    }
  })

  return (
    <div className={css(styles.errorContainer)}>
      <div className={css(styles.error)}>
        {
          error.title &&
          <p className={css(styles.errorTitleP)}>
            {error.title}
          </p>
        }
        <p className={css(styles.errorMsgP)}>
          <em>
            {error.msg.toString()}
          </em>
        </p>
      </div>
      {
        index + 1 < errors.length &&
        <hr className={css(styles.hr)} />
      }
    </div>
  )
}

Error.displays = 'Error'

Error.propTypes = {
  errors: React.PropTypes.array,
  error: React.PropTypes.object,
  index: React.PropTypes.number
}

export default Error
