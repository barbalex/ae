/*
 * TODO
 */

'use strict'

import React from 'react'
import TextLink from './TextLink.js'

const RelationPartners = ({ relation }) => {
  let relationPartners = []

  if (relation.Beziehungspartner) {
    relation.Beziehungspartner.forEach((bezPartner, index) => {
      // label field with Rolle if it exists
      let label = bezPartner.Rolle ? bezPartner.Rolle : 'Beziehungspartner'
      // give only the first bezPartner a label
      label = index > 0 ? null : label
      const value = `${bezPartner.Gruppe}: ${bezPartner.Taxonomie ? `${bezPartner.Taxonomie} > ` : ''}${bezPartner.Name}`

      const textLink = (
        <TextLink
          key={bezPartner.GUID}
          label={label}
          value={value}
          gruppe={bezPartner.Gruppe}
          guid={bezPartner.GUID}
        />
      )
      relationPartners.push(textLink)
    })
  }

  return (
    <div>
      {relationPartners}
    </div>
  )
}

RelationPartners.displayName = 'RelationPartners'

RelationPartners.propTypes = {
  relation: React.PropTypes.object
}

export default RelationPartners
