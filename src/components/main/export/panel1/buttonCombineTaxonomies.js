'use strict'

import React from 'react'
import { Button } from 'react-bootstrap'

export default React.createClass({
  displayName: 'GroupsToExport',

  propTypes: {
    combineTaxonomies: React.PropTypes.bool,
    onChangeCombineTaxonomies: React.PropTypes.func
  },

  onClick () {
    const { onChangeCombineTaxonomies, combineTaxonomies } = this.props
    onChangeCombineTaxonomies(!combineTaxonomies)
  },

  render() {
    const { combineTaxonomies } = this.props

    const buttonText = combineTaxonomies ? 'Felder der gewählten Taxonomien einzeln behandeln' : 'Felder der gewählten Taxonomien zusammenfassen'

    return (
      <Button onClick={this.onClick}>
        {buttonText}
      </Button>
    )
  }

})
