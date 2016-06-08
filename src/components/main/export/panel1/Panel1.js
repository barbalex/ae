import React from 'react'
import { map, difference } from 'lodash'
import WellSoGehts from './WellSoGehts.js'
import GroupsToExport from './GroupsToExport.js'
import WellCombineTaxonomies from './WellCombineTaxonomies.js'
import AlertGroups from './AlertGroups.js'
import AlertLoadGroups from './AlertLoadGroups.js'
import AlertChooseGroup from './AlertChooseGroup.js'

const Panel1 = ({
  groupsLoadedOrLoading,
  groupsLoadingObjects,
  fieldsQuerying,
  fieldsQueryingError,
  taxonomyFields,
  pcsQuerying,
  rcsQuerying,
  onChangeCombineTaxonomies,
  onChangeGroupsToExport,
  panel1Done,
  exportOptions,
  combineTaxonomies,
  errorBuildingExportOptions
}) => {
  const showAlertLoadGroups = groupsLoadedOrLoading.length === 0
  const groupsToExport = exportOptions.object.Gruppen.value
  const showAlertGroups = groupsToExport.length > 0 && !showAlertLoadGroups
  const showAlertChooseGroup = panel1Done === false
  const groupsLoading = map(groupsLoadingObjects, 'group')
  const groupsLoaded = difference(groupsLoadedOrLoading, groupsLoading)

  return (
    <div>
      {
        showAlertLoadGroups &&
        <AlertLoadGroups />
      }
      {
        !showAlertLoadGroups &&
        <WellSoGehts />
      }
      {
        !showAlertLoadGroups &&
        <GroupsToExport
          groupsLoaded={groupsLoaded}
          groupsToExport={groupsToExport}
          onChangeGroupsToExport={onChangeGroupsToExport}
        />
      }
      {
        !showAlertLoadGroups &&
        <WellCombineTaxonomies
          combineTaxonomies={combineTaxonomies}
          onChangeCombineTaxonomies={onChangeCombineTaxonomies}
        />
      }
      {
        showAlertChooseGroup &&
        <AlertChooseGroup />
      }
      {
        showAlertGroups &&
        <AlertGroups
          pcsQuerying={pcsQuerying}
          rcsQuerying={rcsQuerying}
          fieldsQuerying={fieldsQuerying}
          fieldsQueryingError={fieldsQueryingError}
          taxonomyFields={taxonomyFields}
          errorBuildingExportOptions={errorBuildingExportOptions}
          combineTaxonomies={combineTaxonomies}
        />
      }
    </div>
  )
}

Panel1.displayName = 'Panel1'

Panel1.propTypes = {
  groupsLoadingObjects: React.PropTypes.array,
  fieldsQuerying: React.PropTypes.bool,
  fieldsQueryingError: React.PropTypes.object,
  errorBuildingExportOptions: React.PropTypes.string,
  taxonomyFields: React.PropTypes.object,
  groupsLoadedOrLoading: React.PropTypes.array,
  combineTaxonomies: React.PropTypes.bool,
  panel1Done: React.PropTypes.bool,
  exportOptions: React.PropTypes.object,
  pcsQuerying: React.PropTypes.bool,
  rcsQuerying: React.PropTypes.bool,
  onChangeCombineTaxonomies: React.PropTypes.func,
  onChangeGroupsToExport: React.PropTypes.func
}

export default Panel1
