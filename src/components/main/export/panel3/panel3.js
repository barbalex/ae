'use strict'

import React from 'react'
import WellSoGehts from './WellSoGehts.js'
import CheckboxIncludeDataFromSynonyms from './CheckboxIncludeDataFromSynonyms.js'
import Fields from './Fields.js'

const Panel3 = ({
  taxonomyFields,
  pcFields,
  relationFields,
  pcs,
  rcs,
  exportOptions,
  includeDataFromSynonyms,
  onChangeIncludeDataFromSynonyms,
  onChooseField,
  onChooseAllOfCollection,
  collectionsWithAllChoosen,
  oneRowPerRelation,
  onChangeOneRowPerRelation,
  onClickPanel
}) =>
  <div>
    <WellSoGehts />
    <CheckboxIncludeDataFromSynonyms
      includeDataFromSynonyms={includeDataFromSynonyms}
      onChangeIncludeDataFromSynonyms={onChangeIncludeDataFromSynonyms}
    />
    <Fields
      exportOptions={exportOptions}
      taxonomyFields={taxonomyFields}
      pcFields={pcFields}
      pcs={pcs}
      relationFields={relationFields}
      rcs={rcs}
      collectionsWithAllChoosen={collectionsWithAllChoosen}
      oneRowPerRelation={oneRowPerRelation}
      onChooseField={onChooseField}
      onChooseAllOfCollection={onChooseAllOfCollection}
      onClickPanel={(event) =>
        onClickPanel(3, event)
      }
      onChangeOneRowPerRelation={onChangeOneRowPerRelation}
    />
  </div>


Panel3.displayName = 'Panel3'

Panel3.propTypes = {
  taxonomyFields: React.PropTypes.object,
  pcFields: React.PropTypes.object,
  relationFields: React.PropTypes.object,
  exportOptions: React.PropTypes.object,
  pcs: React.PropTypes.array,
  rcs: React.PropTypes.array,
  includeDataFromSynonyms: React.PropTypes.bool,
  onChangeIncludeDataFromSynonyms: React.PropTypes.func,
  onChooseField: React.PropTypes.func,
  onChooseAllOfCollection: React.PropTypes.func,
  collectionsWithAllChoosen: React.PropTypes.array,
  oneRowPerRelation: React.PropTypes.bool,
  onChangeOneRowPerRelation: React.PropTypes.func,
  onClickPanel: React.PropTypes.func
}

export default Panel3
