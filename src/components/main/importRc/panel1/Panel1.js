'use strict'

import React from 'react'
import WellTippsUndTricks from './WellTippsUndTricks.js'
import WellAutorenrechte from './WellAutorenrechte.js'
import InputNameBestehend from './InputNameBestehend.js'
import ButtonDeleteRc from './buttonDeleteRc/ButtonDeleteRc.js'
import InputName from './InputName.js'
import AlertEditingRcDisallowed from './AlertEditingRcDisallowed.js'
import AlertNotEsWriter from './AlertNotEsWriter.js'
import InputBeschreibung from './InputBeschreibung.js'
import InputDatenstand from './InputDatenstand.js'
import InputNutzungsbedingungen from './InputNutzungsbedingungen.js'
import InputLink from './InputLink.js'
import InputOrgMitSchreibrecht from './InputOrgMitSchreibrecht.js'
import InputImportiertVon from './InputImportiertVon.js'
import InputZusammenfassend from './InputZusammenfassend.js'
import InputUrsprungsBs from './InputUrsprungsBs.js'
import ProgressbarDeleteRc from './ProgressbarDeleteRc.js'
import AlertDeleteRcBuildingIndex from './AlertDeleteRcBuildingIndex.js'
import AlertFirst5Deleted from '../AlertFirst5Deleted.js'
import AlertLoadAllGroups from '../AlertLoadAllGroups.js'
import isUserServerAdmin from '../../../../modules/isUserServerAdmin.js'
import isUserOrgAdminAnywhere from '../../../../modules/isUserOrgAdminAnywhere.js'
import isUserEsWriterAnywhere from '../../../../modules/isUserEsWriter.js'

export default React.createClass({
  displayName: 'Panel1',

  propTypes: {
    groupsLoadingObjects: React.PropTypes.array,
    allGroupsLoaded: React.PropTypes.bool,
    groupsLoadedOrLoading: React.PropTypes.array,
    nameBestehend: React.PropTypes.string,
    name: React.PropTypes.string,
    beschreibung: React.PropTypes.string,
    datenstand: React.PropTypes.string,
    nutzungsbedingungen: React.PropTypes.string,
    link: React.PropTypes.string,
    orgMitSchreibrecht: React.PropTypes.string,
    importiertVon: React.PropTypes.string,
    zusammenfassend: React.PropTypes.bool,
    nameUrsprungsBs: React.PropTypes.string,
    email: React.PropTypes.string,
    userRoles: React.PropTypes.array,
    rcs: React.PropTypes.array,
    idsOfAeObjects: React.PropTypes.array,
    deletingRcProgress: React.PropTypes.number,
    bsBearbeitenErlaubt: React.PropTypes.bool,
    ultimatelyAlertLoadAllGroups: React.PropTypes.bool,
    validName: React.PropTypes.bool,
    validBeschreibung: React.PropTypes.bool,
    validDatenstand: React.PropTypes.bool,
    validNutzungsbedingungen: React.PropTypes.bool,
    validLink: React.PropTypes.bool,
    validOrgMitSchreibrecht: React.PropTypes.bool,
    validUrsprungsBs: React.PropTypes.bool,
    replicatingToAe: React.PropTypes.string,
    replicatingToAeTime: React.PropTypes.string,
    organizations: React.PropTypes.array,
    isUrsprungsBsValid: React.PropTypes.func,
    isLinkValid: React.PropTypes.func,
    isEditingRcAllowed: React.PropTypes.func,
    onClickDeleteRc: React.PropTypes.func,
    onChangeNameUrsprungsBs: React.PropTypes.func,
    onChangeZusammenfassend: React.PropTypes.func,
    onChangeLink: React.PropTypes.func,
    onChangeNutzungsbedingungen: React.PropTypes.func,
    onChangeDatenstand: React.PropTypes.func,
    onChangeBeschreibung: React.PropTypes.func,
    onChangeName: React.PropTypes.func,
    onChangeNameBestehend: React.PropTypes.func,
    onChangeOrgMitSchreibrecht: React.PropTypes.func,
    userIsEsWriterInOrgs: React.PropTypes.array
  },

  onBlurName(name) {
    const { isEditingRcAllowed } = this.props
    isEditingRcAllowed(name)
  },

  onBlurLink() {
    const { isLinkValid } = this.props
    isLinkValid()
  },

  render() {
    const {
      groupsLoadedOrLoading,
      email,
      userRoles,
      rcs,
      allGroupsLoaded,
      groupsLoadingObjects,
      replicatingToAe,
      replicatingToAeTime,
      onClickDeleteRc,
      onChangeNameUrsprungsBs,
      onChangeZusammenfassend,
      onChangeLink,
      onChangeNutzungsbedingungen,
      onChangeDatenstand,
      onChangeBeschreibung,
      onChangeName,
      onChangeNameBestehend,
      bsBearbeitenErlaubt,
      idsOfAeObjects,
      validName,
      validBeschreibung,
      validDatenstand,
      validNutzungsbedingungen,
      validLink,
      validOrgMitSchreibrecht,
      validUrsprungsBs,
      beschreibung,
      datenstand,
      nutzungsbedingungen,
      link,
      importiertVon,
      zusammenfassend,
      nameUrsprungsBs,
      name,
      nameBestehend,
      ultimatelyAlertLoadAllGroups,
      deletingRcProgress,
      onChangeOrgMitSchreibrecht,
      userIsEsWriterInOrgs,
      orgMitSchreibrecht,
      isEditingRcAllowed,
      isLinkValid
    } = this.props
    const showLoadAllGroups = email && !allGroupsLoaded
    const showAlertDeleteRcBuildingIndex = (
      deletingRcProgress &&
      deletingRcProgress < 100
    )
    const alertAllGroupsBsStyle = (
      ultimatelyAlertLoadAllGroups ?
      'danger' :
      'info'
    )
    const enableDeleteRcButton = !!nameBestehend
    const alertNotEsWriter = !(
      isUserServerAdmin(userRoles) ||
      isUserOrgAdminAnywhere(userRoles) ||
      isUserEsWriterAnywhere(userRoles)
    )

    return (
      <div>
        {
          showLoadAllGroups &&
          <AlertLoadAllGroups
            open="true"
            groupsLoadingObjects={groupsLoadingObjects}
            alertAllGroupsBsStyle={alertAllGroupsBsStyle}
          />
        }
        <WellTippsUndTricks />
        <WellAutorenrechte />

        <InputNameBestehend
          nameBestehend={nameBestehend}
          beschreibung={beschreibung}
          datenstand={datenstand}
          nutzungsbedingungen={nutzungsbedingungen}
          link={link}
          zusammenfassend={zusammenfassend}
          email={email}
          userRoles={userRoles}
          rcs={rcs}
          groupsLoadedOrLoading={groupsLoadedOrLoading}
          onChangeNameBestehend={onChangeNameBestehend}
          userIsEsWriterInOrgs={userIsEsWriterInOrgs}
        />
        {
          alertNotEsWriter &&
          <AlertNotEsWriter />
        }
        {
          nameBestehend &&
          <ButtonDeleteRc
            nameBestehend={nameBestehend}
            enableDeleteRcButton={enableDeleteRcButton}
            deletingRcProgress={deletingRcProgress}
            onClickDeleteRc={onClickDeleteRc}
          />
        }
        {
          showAlertDeleteRcBuildingIndex &&
          <AlertDeleteRcBuildingIndex />
        }
        {
          deletingRcProgress !== null &&
          <ProgressbarDeleteRc
            progress={deletingRcProgress}
          />
        }
        {
          deletingRcProgress === 100 &&
          <AlertFirst5Deleted
            idsOfAeObjects={idsOfAeObjects}
            nameBestehend={nameBestehend}
            replicatingToAe={replicatingToAe}
            replicatingToAeTime={replicatingToAeTime}
          />
        }

        <hr />

        <InputName
          name={name}
          validName={validName}
          onChangeName={onChangeName}
          onBlurName={(event) => isEditingRcAllowed(event.target.value)}
        />
        {
          !bsBearbeitenErlaubt &&
          <AlertEditingRcDisallowed />
        }
        <InputBeschreibung
          beschreibung={beschreibung}
          validBeschreibung={validBeschreibung}
          onChangeBeschreibung={onChangeBeschreibung}
        />
        <InputDatenstand
          datenstand={datenstand}
          validDatenstand={validDatenstand}
          onChangeDatenstand={onChangeDatenstand}
        />
        <InputNutzungsbedingungen
          nutzungsbedingungen={nutzungsbedingungen}
          validNutzungsbedingungen={validNutzungsbedingungen}
          onChangeNutzungsbedingungen={onChangeNutzungsbedingungen}
        />
        <InputLink
          link={link}
          validLink={validLink}
          onChangeLink={onChangeLink}
          onBlurLink={this.onBlurLink}
        />
        <InputOrgMitSchreibrecht
          orgMitSchreibrecht={orgMitSchreibrecht}
          validOrgMitSchreibrecht={validOrgMitSchreibrecht}
          onChangeOrgMitSchreibrecht={onChangeOrgMitSchreibrecht}
          userIsEsWriterInOrgs={userIsEsWriterInOrgs}
        />
        <InputImportiertVon
          importiertVon={importiertVon}
        />
        <InputZusammenfassend
          zusammenfassend={zusammenfassend}
          onChangeZusammenfassend={onChangeZusammenfassend}
        />
        {
          zusammenfassend &&
          <InputUrsprungsBs
            nameUrsprungsBs={nameUrsprungsBs}
            rcs={rcs}
            validUrsprungsBs={validUrsprungsBs}
            onChangeNameUrsprungsBs={onChangeNameUrsprungsBs}
          />
        }
      </div>
    )
  }
})
