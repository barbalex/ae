'use strict'

import React from 'react'
import WellSoGehts from './wellSoGehts.js'
import CheckboxIncludeDataFromSynonyms from './checkboxIncludeDataFromSynonyms.js'
import Fields from './fields.js'

const Panel1 = ({
  taxonomyFields,
  pcFields,
  relationFields,
  pcs,
  rcs,
  urlOptions,
  includeDataFromSynonyms,
  onChangeIncludeDataFromSynonyms,
  onChooseField,
  onChooseAllOfCollection,
  collectionsWithAllChoosen,
  oneRowPerRelation,
  onChangeOneRowPerRelation
}) => (
  <div>
    <WellSoGehts />
    <CheckboxIncludeDataFromSynonyms
      includeDataFromSynonyms={includeDataFromSynonyms}
      onChangeIncludeDataFromSynonyms={onChangeIncludeDataFromSynonyms}
    />
    <Fields
      urlOptions={urlOptions}
      taxonomyFields={taxonomyFields}
      pcFields={pcFields}
      pcs={pcs}
      relationFields={relationFields}
      rcs={rcs}
      collectionsWithAllChoosen={collectionsWithAllChoosen}
      oneRowPerRelation={oneRowPerRelation}
      onChooseField={onChooseField}
      onChooseAllOfCollection={onChooseAllOfCollection}
      onClickPanel={this.onClickPanel}
      onChangeOneRowPerRelation={onChangeOneRowPerRelation}
    />
  </div>
)

Panel1.displayName = 'Panel1'

Panel1.propTypes = {
  taxonomyFields: React.PropTypes.object,
  pcFields: React.PropTypes.object,
  relationFields: React.PropTypes.object,
  urlOptions: React.PropTypes.object,
  pcs: React.PropTypes.array,
  rcs: React.PropTypes.array,
  includeDataFromSynonyms: React.PropTypes.bool,
  onChangeIncludeDataFromSynonyms: React.PropTypes.func,
  onChooseField: React.PropTypes.func,
  onChooseAllOfCollection: React.PropTypes.func,
  collectionsWithAllChoosen: React.PropTypes.array,
  oneRowPerRelation: React.PropTypes.bool,
  onChangeOneRowPerRelation: React.PropTypes.func
}

export default Panel1
