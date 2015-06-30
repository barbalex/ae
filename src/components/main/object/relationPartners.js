/*
 * TODO
 */

'use strict'

import React from 'react'
import { State } from 'react-router'
import _ from 'lodash'
import TextLink from './textLink.js'
import getPathFromGuid from '../../../modules/getPathFromGuid.js'

export default React.createClass({
  displayName: 'RelationPartners',

  mixins: [State],

  propTypes: {
    relation: React.PropTypes.object
  },

  getInitialState () {
    return {
      relation: this.props.relation
    }
  },

  render () {
    const relation = this.state.relation
    let relationPartners = []

    if (relation.Beziehungspartner && relation.Beziehungspartner.length > 0) {
      relationPartners = _.map(relation.Beziehungspartner, function (bezPartner) {
        // label field with Rolle if it exists
        const label = bezPartner.Rolle ? bezPartner.Rolle : 'Beziehungspartner'
        const value = bezPartner.Gruppe + ': ' + (bezPartner.Taxonomie ? bezPartner.Taxonomie + ' > ' : '') + bezPartner.Name
        // can't use getPathFromGuid because it is possible that the relation partner's group was not loaded yet
        const url = window.location.origin + '/' + bezPartner.GUID

        return <TextLink key={label} label={label} value={value} url={url} />
      })
    }

    return (
      <div>
        {relationPartners}
      </div>
    )
  }
})
