'use strict'

import React from 'react'
import WellAutorenrechte from './wellAutorenrechte.js'
import WellTippsUndTricks from './wellTippsUndTricks.js'
import AlertDeletePcBuildingIndex from './alertDeletePcBuildingIndex.js'
import AlertFirst5Deleted from '../alertFirst5Deleted.js'
import AlertLoadAllGroups from './alertLoadAllGroups.js'
import AlertEditingPcDisallowed from './alertEditingPcDisallowed.js'
import AlertNotEsWriter from './alertNotEsWriter.js'
import ButtonDeletePc from './buttonDeletePc/buttonDeletePc.js'
import ProgressbarDeletePc from './progressbarDeletePc.js'
import InputNameBestehend from './inputNameBestehend.js'
import InputName from './inputName.js'
import InputBeschreibung from './inputBeschreibung.js'
import InputDatenstand from './inputDatenstand.js'
import InputNutzungsbedingungen from './inputNutzungsbedingungen.js'
import InputLink from './inputLink.js'
import InputOrgMitSchreibrecht from './inputOrgMitSchreibrecht.js'
import InputImportiertVon from './inputImportiertVon.js'
import InputZusammenfassend from './inputZusammenfassend.js'
import InputUrsprungsEs from './inputUrsprungsEs.js'

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
    nameUrsprungsEs: React.PropTypes.string,
    email: React.PropTypes.string,
    pcs: React.PropTypes.array,
    idsOfAeObjects: React.PropTypes.array,
    deletingPcProgress: React.PropTypes.number,
    esBearbeitenErlaubt: React.PropTypes.bool,
    ultimatelyAlertLoadAllGroups: React.PropTypes.bool,
    validName: React.PropTypes.bool,
    validBeschreibung: React.PropTypes.bool,
    validDatenstand: React.PropTypes.bool,
    validNutzungsbedingungen: React.PropTypes.bool,
    validLink: React.PropTypes.bool,
    validOrgMitSchreibrecht: React.PropTypes.bool,
    validUrsprungsEs: React.PropTypes.bool,
    replicatingToAe: React.PropTypes.string,
    replicatingToAeTime: React.PropTypes.string,
    onClickDeletePc: React.PropTypes.func,
    onChangeNameUrsprungsEs: React.PropTypes.func,
    onChangeZusammenfassend: React.PropTypes.func,
    onBlurLink: React.PropTypes.func,
    onChangeLink: React.PropTypes.func,
    onChangeNutzungsbedingungen: React.PropTypes.func,
    onChangeDatenstand: React.PropTypes.func,
    onChangeBeschreibung: React.PropTypes.func,
    onBlurName: React.PropTypes.func,
    onChangeName: React.PropTypes.func,
    onChangeNameBestehend: React.PropTypes.func,
    onChangeOrgMitSchreibrecht: React.PropTypes.func,
    organizations: React.PropTypes.array,
    userIsEsWriterInOrgs: React.PropTypes.array
  },

  render () {
    const { onClickDeletePc, onChangeNameUrsprungsEs, onChangeZusammenfassend, onBlurLink, onChangeLink, onChangeNutzungsbedingungen, onChangeDatenstand, onChangeBeschreibung, onBlurName, onChangeName, onChangeNameBestehend, nameBestehend, name, beschreibung, datenstand, nutzungsbedingungen, link, importiertVon, zusammenfassend, nameUrsprungsEs, esBearbeitenErlaubt, idsOfAeObjects, validName, validBeschreibung, validDatenstand, validNutzungsbedingungen, validLink, validOrgMitSchreibrecht, validUrsprungsEs, ultimatelyAlertLoadAllGroups, deletingPcProgress, groupsLoadedOrLoading, email, pcs, allGroupsLoaded, groupsLoadingObjects, replicatingToAe, replicatingToAeTime, onChangeOrgMitSchreibrecht, userIsEsWriterInOrgs, orgMitSchreibrecht } = this.props
    const showLoadAllGroups = email && !allGroupsLoaded
    const showAlertDeletePcBuildingIndex = deletingPcProgress && deletingPcProgress < 100
    const alertAllGroupsBsStyle = ultimatelyAlertLoadAllGroups ? 'danger' : 'info'
    const enableDeletePcButton = !!nameBestehend
    const alertNotEsWriter = email && (!userIsEsWriterInOrgs || userIsEsWriterInOrgs.length === 0)

    return (
      <div>
        {showLoadAllGroups
          ? <AlertLoadAllGroups
              open='true'
              groupsLoadingObjects={groupsLoadingObjects}
              alertAllGroupsBsStyle={alertAllGroupsBsStyle} />
          : null
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
          pcs={pcs}
          groupsLoadedOrLoading={groupsLoadedOrLoading}
          onChangeNameBestehend={onChangeNameBestehend}
          userIsEsWriterInOrgs={userIsEsWriterInOrgs} />
        {
          alertNotEsWriter
          ? <AlertNotEsWriter />
          : null
        }
        <ButtonDeletePc
          nameBestehend={nameBestehend}
          enableDeletePcButton={enableDeletePcButton}
          deletingPcProgress={deletingPcProgress}
          onClickDeletePc={onClickDeletePc} />
        {
          showAlertDeletePcBuildingIndex
          ? <AlertDeletePcBuildingIndex />
          : null
        }
        {
          deletingPcProgress !== null
          ? <ProgressbarDeletePc
              progress={deletingPcProgress} />
          : null
        }
        {
          deletingPcProgress === 100
          ? <div className='feld'>
              <AlertFirst5Deleted
                idsOfAeObjects={idsOfAeObjects}
                nameBestehend={nameBestehend}
                replicatingToAe={replicatingToAe}
                replicatingToAeTime={replicatingToAeTime} />
            </div>
          : null
        }
        <hr />
        <InputName
          name={name}
          validName={validName}
          onChangeName={onChangeName}
          onBlurName={onBlurName} />
        {
          esBearbeitenErlaubt
          ? null
          : <AlertEditingPcDisallowed />
        }
        <InputBeschreibung
          beschreibung={beschreibung}
          validBeschreibung={validBeschreibung}
          onChangeBeschreibung={onChangeBeschreibung} />
        <InputDatenstand
          datenstand={datenstand}
          validDatenstand={validDatenstand}
          onChangeDatenstand={onChangeDatenstand} />
        <InputNutzungsbedingungen
          nutzungsbedingungen={nutzungsbedingungen}
          validNutzungsbedingungen={validNutzungsbedingungen}
          onChangeNutzungsbedingungen={onChangeNutzungsbedingungen} />
        <InputLink
          link={link}
          validLink={validLink}
          onChangeLink={onChangeLink}
          onBlurLink={onBlurLink} />
        <InputOrgMitSchreibrecht
          orgMitSchreibrecht={orgMitSchreibrecht}
          validOrgMitSchreibrecht={validOrgMitSchreibrecht}
          onChangeOrgMitSchreibrecht={onChangeOrgMitSchreibrecht}
          userIsEsWriterInOrgs={userIsEsWriterInOrgs} />
        <InputImportiertVon
          importiertVon={importiertVon} />
        <InputZusammenfassend
          zusammenfassend={zusammenfassend}
          onChangeZusammenfassend={onChangeZusammenfassend} />
        {
          zusammenfassend
          ? <InputUrsprungsEs
              nameUrsprungsEs={nameUrsprungsEs}
              pcs={pcs}
              validUrsprungsEs={validUrsprungsEs}
              onChangeNameUrsprungsEs={onChangeNameUrsprungsEs} />
          : null
        }
      </div>
    )
  }
})
