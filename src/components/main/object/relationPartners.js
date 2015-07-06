/*
 * TODO
 */

'use strict'

import React from 'react'
import _ from 'lodash'
import TextLink from './textLink.js'

export default React.createClass({
  displayName: 'RelationPartners',

  propTypes: {
    relation: React.PropTypes.object
  },

  render () {
    const { relation } = this.props
    let relationPartners = []

    if (relation.Beziehungspartner && relation.Beziehungspartner.length > 0) {
      relationPartners = _.map(relation.Beziehungspartner, function (bezPartner) {

        // label field with Rolle if it exists
        const label = bezPartner.Rolle ? bezPartner.Rolle : 'Beziehungspartner'
        const value = bezPartner.Gruppe + ': ' + (bezPartner.Taxonomie ? bezPartner.Taxonomie + ' > ' : '') + bezPartner.Name
        // can't use getPathFromGuid because it is possible that the relation partner's group was not loaded yet
        const url = '/' + bezPartner.GUID

        return <TextLink key={'textlink' + bezPartner.GUID} label={label} value={value} url={url} gruppe={bezPartner.Gruppe} guid={bezPartner.GUID} />
      })
    }

    return (
      <div>
        {relationPartners}
      </div>
    )
  }
})
