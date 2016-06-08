import app from 'ampersand-app'
import React from 'react'
import { Alert } from 'react-bootstrap'
import { findKey } from 'lodash'
import ReplicationNotice from './replicationNotice.js'
import getPathsFromLocalDb from '../../../modules/getPathsFromLocalDb.js'

export default React.createClass({
  displayName: 'AlertFirst5Deleted',

  propTypes: {
    idsOfAeObjects: React.PropTypes.array,
    nameBestehend: React.PropTypes.string,
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
      nameBestehend,
      replicatingToAe,
      replicatingToAeTime
    } = this.props
    const { paths } = this.state
    const first5Ids = idsOfAeObjects.slice(0, 5)

    // only get paths on first render
    if (!paths) {
      getPathsFromLocalDb()
        .then((paths) =>
          this.setState({ paths })
        )
        .catch((error) =>
          addError({
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
      <Alert
        bsStyle="info"
      >
        <p>
          Aus {idsOfAeObjects.length} Datensätzen wurde die
          Eigenschaftensammlung "{nameBestehend}" entfernt.<br />
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
