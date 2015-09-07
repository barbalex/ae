'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Alert } from 'react-bootstrap'
import _ from 'lodash'
import getPathsFromLocalPathDb from '../../../modules/getPathsFromLocalPathDb.js'

export default React.createClass({
  displayName: 'AlertFirst5Imported',

  propTypes: {
    idsOfAeObjects: React.PropTypes.array,
    idsNotImportable: React.PropTypes.array,
    paths: React.PropTypes.object
  },

  getInitialState () {
    return {
      paths: null
    }
  },

  render () {
    const { idsOfAeObjects, idsNotImportable } = this.props
    const { paths } = this.state
    const idsImported = _.difference(idsOfAeObjects, idsNotImportable)
    const first5Ids = idsImported.slice(0, 5)
    const alertStyle = { marginTop: 11 }

    // only get paths on first render
    if (!paths) {
      getPathsFromLocalPathDb()
        .then((paths) => this.setState({ paths: paths }))
        .catch((error) => app.Actions.showError({title: 'Fehler beim Aufbauen der Beispiele:', msg: error}))
    }

    const examples = first5Ids.map((id, index) => {
      const path = _.findKey(paths, (value) => value === id)
      const href = `${window.location.protocol}//${window.location.host}/${path}?id=${id}`
      return <li key={index}><a href={href} target='_blank'>Beispiel {index + 1}</a></li>
    })

    return (
      <Alert bsStyle='info' style={alertStyle}>
        <p>{idsImported.length} Eigenschaftensammlungen wurden in Arten/Lebensräume importiert.<br/>
          5 Beispiele zur Kontrolle:
        </p>
        {paths ? <ul>{examples}</ul> : null}
      </Alert>
    )
  }
})
