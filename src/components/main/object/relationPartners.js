/*
 * TODO
 */

'use strict'

import React from 'react'
import TextLink from './textLink.js'

export default React.createClass({
  displayName: 'RelationPartners',

  propTypes: {
    relation: React.PropTypes.object
  },

  render () {
    const { relation } = this.props
    let relationPartners = []

    // console.log('relationPartners.js, rendering relations for relation', relation)

    if (relation.Beziehungspartner) {
      relation.Beziehungspartner.forEach((bezPartner, index) => {
        // label field with Rolle if it exists
        let label = bezPartner.Rolle ? bezPartner.Rolle : 'Beziehungspartner'
        // give only the first bezPartner a label
        label = index > 0 ? null : label
        const value = bezPartner.Gruppe + ': ' + (bezPartner.Taxonomie ? bezPartner.Taxonomie + ' > ' : '') + bezPartner.Name

        // console.log('relationPartners.js, bezPartner.GUID', bezPartner.GUID)

        const textLink = <TextLink key={bezPartner.GUID} label={label} value={value} gruppe={bezPartner.Gruppe} guid={bezPartner.GUID} />
        relationPartners.push(textLink)
      })
    }

    return (
      <div>
        {relationPartners}
      </div>
    )
  }
})
