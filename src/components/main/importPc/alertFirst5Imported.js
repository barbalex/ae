'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Alert } from 'react-bootstrap'
import { difference, findKey } from 'lodash'
import ReplicationNotice from './replicationNotice.js'
import getPathsFromLocalDb from '../../../modules/getPathsFromLocalDb.js'

export default React.createClass({
  displayName: 'AlertFirst5Imported',

  propTypes: {
    idsOfAeObjects: React.PropTypes.array,
    idsNotImportable: React.PropTypes.array,
    paths: React.PropTypes.object,
    replicatingToAe: React.PropTypes.string,
    replicatingToAeTime: React.PropTypes.string
  },

  getInitialState() {
    return {
      paths: null
    }
  },

  render() {
    const {
      idsOfAeObjects,
      idsNotImportable,
      replicatingToAe,
      replicatingToAeTime
    } = this.props
    const { paths } = this.state
    const idsImported = difference(idsOfAeObjects, idsNotImportable)
    const first5Ids = idsImported.slice(0, 5)
    const alertStyle = { marginTop: 11 }

    // only get paths on first render
    if (!paths) {
      getPathsFromLocalDb()
        .then((paths) =>
          this.setState({ paths })
        )
        .catch((error) =>
          app.Actions.showError({
            title: 'Fehler beim Aufbauen der Beispiele:',
            msg: error
          })
        )
    }

    const examples = first5Ids.map((id, index) => {
      const path = findKey(paths, (value) => value === id)
      if (path) {
        const href = `${window.location.protocol}//${window.location.host}/${path}?id=${id}`
        return (
          <li key={index}>
            <a
              href={href}
              target="_blank"
            >
              {path.replace(/\//g, ' > ')}
            </a>
          </li>
        )
      }
      return null
    })

    return (
      <Alert bsStyle="info" style={alertStyle}>
        <p>
          {idsImported.length} Eigenschaftensammlungen wurden
          in Arten/Lebensräume importiert.<br />
          Beispiele zur Kontrolle:
        </p>
        {
          paths &&
          <ul>
            {examples}
          </ul>
        }
        {
          paths &&
          <ReplicationNotice
            replicatingToAe={replicatingToAe}
            replicatingToAeTime={replicatingToAeTime}
          />
        }
      </Alert>
    )
  }
})
