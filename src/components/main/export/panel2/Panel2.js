import React from 'react'
import WellSoGehts from './WellSoGehts.js'
import WellTippsTricks from './WellTippsTricks.js'
import CheckboxOnlyObjectsWithCollectionData from './CheckboxOnlyObjectsWithCollectionData.js'
import Fields from './Fields.js'

const Panel2 = ({
  taxonomyFields,
  pcFields,
  relationFields,
  pcs,
  rcs,
  exportOptions,
  onChangeFilterField,
  onChangeCoSelect,
  onlyObjectsWithCollectionData,
  onChangeOnlyObjectsWithCollectionData,
}) => {
  const showFields = (
    Object.keys(taxonomyFields).length > 0 ||
    Object.keys(pcFields).length > 0 ||
    Object.keys(relationFields).length > 0
  )

  return (
    <div>
      <WellSoGehts />
      <WellTippsTricks />
      <CheckboxOnlyObjectsWithCollectionData
        onlyObjectsWithCollectionData={onlyObjectsWithCollectionData}
        onChangeOnlyObjectsWithCollectionData={onChangeOnlyObjectsWithCollectionData}
      />
      {
        showFields &&
        <Fields
          taxonomyFields={taxonomyFields}
          pcFields={pcFields}
          pcs={pcs}
          relationFields={relationFields}
          rcs={rcs}
          exportOptions={exportOptions}
          onChangeFilterField={onChangeFilterField}
          onChangeCoSelect={onChangeCoSelect}
        />
      }
    </div>
  )
}

Panel2.displayName = 'Panel2'

Panel2.propTypes = {
  taxonomyFields: React.PropTypes.object,
  pcFields: React.PropTypes.object,
  relationFields: React.PropTypes.object,
  pcs: React.PropTypes.array,
  rcs: React.PropTypes.array,
  exportOptions: React.PropTypes.object,
  onChangeFilterField: React.PropTypes.func,
  onChangeCoSelect: React.PropTypes.func,
  onChangeOnlyObjectsWithCollectionData: React.PropTypes.func,
  onlyObjectsWithCollectionData: React.PropTypes.bool,
}

export default Panel2
