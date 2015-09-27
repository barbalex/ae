'use strict'

import React from 'react'
import _ from 'lodash'
import WellSoGehts from './wellSoGehts.js'
import GroupsToExport from './groupsToExport.js'
import WellTaxonomienZusammenfassen from './wellTaxonomienZusammenfassen.js'
import AlertGroups from './alertGroups.js'
import AlertLoadGroups from './alertLoadGroups.js'
import AlertChooseGroup from './alertChooseGroup.js'

export default React.createClass({
  displayName: 'Panel1',

  propTypes: {
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
    onChangeTaxonomienZusammenfassen: React.PropTypes.func,
    onChangeGroupsToExport: React.PropTypes.func
  },

  render () {
    const { groupsLoadedOrLoading, groupsLoadingObjects, fieldsQuerying, fieldsQueryingError, taxonomyFields, pcsQuerying, rcsQuerying, onChangeTaxonomienZusammenfassen, onChangeGroupsToExport, panel1Done, exportOptions, combineTaxonomies, errorBuildingExportOptions } = this.props
    const showAlertLoadGroups = groupsLoadedOrLoading.length === 0
    const groupsToExport = exportOptions.object.Gruppen.value
    const showAlertGroups = groupsToExport.length > 0 && !showAlertLoadGroups
    const showAlertChooseGroup = panel1Done === false
    const groupsLoading = _.pluck(groupsLoadingObjects, 'group')
    const groupsLoaded = _.difference(groupsLoadedOrLoading, groupsLoading)

    return (
      <div>
        {showAlertLoadGroups ? <AlertLoadGroups /> : null}
        {!showAlertLoadGroups ? <WellSoGehts /> : null}
        {!showAlertLoadGroups ?
          <GroupsToExport
            groupsLoaded={groupsLoaded}
            groupsToExport={groupsToExport}
            onChangeGroupsToExport={onChangeGroupsToExport} />
          : null
        }
        {!showAlertLoadGroups ?
          <WellTaxonomienZusammenfassen
            combineTaxonomies={combineTaxonomies}
            onChangeTaxonomienZusammenfassen={onChangeTaxonomienZusammenfassen} />
          : null
        }
        {showAlertChooseGroup ?
          <AlertChooseGroup />
          : null
        }
        {showAlertGroups ?
          <AlertGroups
            pcsQuerying={pcsQuerying}
            rcsQuerying={rcsQuerying}
            fieldsQuerying={fieldsQuerying}
            fieldsQueryingError={fieldsQueryingError}
            taxonomyFields={taxonomyFields}
            errorBuildingExportOptions={errorBuildingExportOptions}
            combineTaxonomies={combineTaxonomies} />
          : null
        }
      </div>
    )
  }
})
