import React from 'react'
import { Button } from 'react-bootstrap'

const ButtonCombineTaxonomies = ({
  combineTaxonomies,
  onChangeCombineTaxonomies
}) => {
  const buttonText = (
    combineTaxonomies ?
    'Felder der gewählten Taxonomien einzeln behandeln' :
    'Felder der gewählten Taxonomien zusammenfassen'
  )

  return (
    <Button
      onClick={() =>
        onChangeCombineTaxonomies(!combineTaxonomies)
      }
    >
      {buttonText}
    </Button>
  )
}

ButtonCombineTaxonomies.displayName = 'ButtonCombineTaxonomies'

ButtonCombineTaxonomies.propTypes = {
  combineTaxonomies: React.PropTypes.bool,
  onChangeCombineTaxonomies: React.PropTypes.func
}

export default ButtonCombineTaxonomies
