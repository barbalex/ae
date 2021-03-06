import React from 'react'
import WellAutorenrechte from './WellAutorenrechte.js'
import WellTippsUndTricks from './WellTippsUndTricks.js'
import AlertDeletePcBuildingIndex from './AlertDeletePcBuildingIndex.js'
import AlertFirst5Deleted from '../AlertFirst5Deleted.js'
import AlertEditingPcDisallowed from './AlertEditingPcDisallowed.js'
import AlertNotEsWriter from './AlertNotEsWriter.js'
import ButtonDeletePc from './buttonDeletePc/ButtonDeletePc.js'
import ProgressbarDeletePc from './ProgressbarDeletePc.js'
import InputNameBestehend from './InputNameBestehend.js'
import InputName from './InputName.js'
import InputBeschreibung from './InputBeschreibung.js'
import InputDatenstand from './InputDatenstand.js'
import InputNutzungsbedingungen from './InputNutzungsbedingungen.js'
import InputLink from './InputLink.js'
import InputOrgMitSchreibrecht from './InputOrgMitSchreibrecht.js'
import InputImportiertVon from './InputImportiertVon.js'
import InputZusammenfassend from './InputZusammenfassend.js'
import InputUrsprungsEs from './InputUrsprungsEs.js'
import isUserServerAdmin from '../../../../modules/isUserServerAdmin.js'
import isUserOrgAdminAnywhere from '../../../../modules/isUserOrgAdminAnywhere.js'
import isUserEsWriterAnywhere from '../../../../modules/isUserEsWriter.js'

const Panel1 = ({
  onClickDeletePc,
  onChangeNameUrsprungsEs,
  onChangeZusammenfassend,
  onBlurLink,
  onChangeLink,
  onChangeNutzungsbedingungen,
  onChangeDatenstand,
  onChangeBeschreibung,
  onBlurName,
  onChangeName,
  onChangeNameBestehend,
  nameBestehend,
  name,
  beschreibung,
  datenstand,
  nutzungsbedingungen,
  link,
  importiertVon,
  zusammenfassend,
  nameUrsprungsEs,
  esBearbeitenErlaubt,
  idsOfAeObjects,
  validName,
  validBeschreibung,
  validDatenstand,
  validNutzungsbedingungen,
  validLink,
  validOrgMitSchreibrecht,
  validUrsprungsEs,
  deletingPcProgress,
  email,
  userRoles,
  pcs,
  onChangeOrgMitSchreibrecht,
  userIsEsWriterInOrgs,
  orgMitSchreibrecht
}) => {
  const showAlertDeletePcBuildingIndex = (
    deletingPcProgress &&
    deletingPcProgress < 100
  )
  const enableDeletePcButton = !!nameBestehend
  const alertNotEsWriter = !(
    isUserServerAdmin(userRoles) ||
    isUserOrgAdminAnywhere(userRoles) ||
    isUserEsWriterAnywhere(userRoles)
  )

  return (
    <div>
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
        pcs={pcs}
        onChangeNameBestehend={onChangeNameBestehend}
        userIsEsWriterInOrgs={userIsEsWriterInOrgs}
      />
      {
        alertNotEsWriter &&
        <AlertNotEsWriter />
      }
      {
        nameBestehend &&
        <ButtonDeletePc
          nameBestehend={nameBestehend}
          enableDeletePcButton={enableDeletePcButton}
          deletingPcProgress={deletingPcProgress}
          onClickDeletePc={onClickDeletePc}
        />
      }
      {
        showAlertDeletePcBuildingIndex &&
        <AlertDeletePcBuildingIndex />
      }
      {
        deletingPcProgress !== null &&
        <ProgressbarDeletePc
          progress={deletingPcProgress}
        />
      }
      {
        deletingPcProgress === 100 &&
        <AlertFirst5Deleted
          idsOfAeObjects={idsOfAeObjects}
          nameBestehend={nameBestehend}
        />
      }
      <hr />
      <InputName
        name={name}
        validName={validName}
        onChangeName={onChangeName}
        onBlurName={onBlurName}
      />
      {
        !esBearbeitenErlaubt &&
        <AlertEditingPcDisallowed />
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
        onBlurLink={onBlurLink}
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
        <InputUrsprungsEs
          nameUrsprungsEs={nameUrsprungsEs}
          pcs={pcs}
          validUrsprungsEs={validUrsprungsEs}
          onChangeNameUrsprungsEs={onChangeNameUrsprungsEs}
        />
      }
    </div>
  )
}

Panel1.displayName = 'Panel1'

Panel1.propTypes = {
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
  userRoles: React.PropTypes.array,
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
}

export default Panel1
