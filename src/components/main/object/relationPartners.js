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
      relationPartners = _.map(relation.Beziehungspartner, (bezPartner) => {
        // label field with Rolle if it exists
        const label = bezPartner.Rolle ? bezPartner.Rolle : 'Beziehungspartner'
        const value = bezPartner.Gruppe + ': ' + (bezPartner.Taxonomie ? bezPartner.Taxonomie + ' > ' : '') + bezPartner.Name

        return <TextLink key={bezPartner.GUID} label={label} value={value} gruppe={bezPartner.Gruppe} guid={bezPartner.GUID} />
      })
    }

    return (
      <div>
        {relationPartners}
      </div>
    )
  }
})
