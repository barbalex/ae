'use strict'

import React from 'react'
import { Button } from 'react-bootstrap'

export default React.createClass({
  displayName: 'GroupsToExport',

  propTypes: {
    taxonomienZusammenfassen: React.PropTypes.bool,
    onChangeTaxonomienZusammenfassen: React.PropTypes.func
  },

  onClick () {
    const { onChangeTaxonomienZusammenfassen, taxonomienZusammenfassen } = this.props
    onChangeTaxonomienZusammenfassen(!taxonomienZusammenfassen)
  },

  render () {
    const { taxonomienZusammenfassen } = this.props
    const style = {
      marginBottom: 9
    }

    const buttonText = taxonomienZusammenfassen ? 'Taxonomien einzeln behandeln' : 'Taxonomien zusammenfassen'

    return (
      <Button onClick={this.onClick} style={style}>
        {buttonText}
      </Button>
    )
  }

})
