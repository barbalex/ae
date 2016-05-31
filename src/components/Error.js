'use strict'

import React from 'react'
import { StyleSheet, css } from 'aphrodite'

const styles = StyleSheet.create({
  errorContainer: {
    border: 'none'
  },
  hr: {
    marginTop: 8,
    marginBottom: 8,
    boxShadow: '0 5px 10px rgba(0, 0, 0, 0.2)',
    border: '1px solid #CCC'
  }
})

const Error = ({ error, errorFollows }) =>
  <div
    className={css(styles.errorContainer)}
  >
    <div className="error">
      {
        error.title &&
        <p>
          {error.title}
        </p>
      }
      <p>
        <em>
          {error.msg}
        </em>
      </p>
    </div>
    {
      errorFollows &&
      <hr className={css(styles.hr)} />
    }
  </div>

Error.displays = 'Error'

Error.propTypes = {
  error: React.PropTypes.object,
  errorFollows: React.PropTypes.bool
}

export default Error
