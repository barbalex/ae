'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Alert } from 'react-bootstrap'
import _ from 'lodash'
import getPathsFromLocalPathDb from '../../../modules/getPathsFromLocalPathDb.js'

export default React.createClass({
  displayName: 'AlertFirst5Deleted',

  propTypes: {
    docsToDelete: React.PropTypes.array,
    nameBestehend: React.PropTypes.string,
    paths: React.PropTypes.object
  },

  getInitialState () {
    return {
      paths: null
    }
  },

  render () {
    const { docsToDelete, nameBestehend } = this.props
    const { paths } = this.state
    const idsOfObjects = _.pluck(docsToDelete, '_id')
    const first10Ids = idsOfObjects.slice(0, 5)
    const alertStyle = { marginTop: 11 }

    // only get paths on first render
    if (!paths) {
      getPathsFromLocalPathDb()
        .then((paths) => this.setState({ paths: paths }))
        .catch((error) => app.Actions.showError({title: 'Fehler beim Aufbauen der Beispiele:', msg: error}))
    }

    const examples = first10Ids.map((id, index) => {
      const path = _.findKey(paths, (value) => value === id)
      const href = `${window.location.protocol}//${window.location.host}/${path}?id=${id}`
      return <li key={index}><a href={href} target='_blank'>Beispiel {index + 1}</a></li>
    })

    return (
      <Alert bsStyle='info' style={alertStyle}>
        <p>Aus {docsToDelete.length} Datensätzen wurde die Eigenschaftensammlung "{nameBestehend}" entfernt.<br/>
          5 Beispiele zur Kontrolle:
        </p>
        {paths ? <ul>{examples}</ul> : null}
      </Alert>
    )
  }
})
