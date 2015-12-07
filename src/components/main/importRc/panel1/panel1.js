'use strict'

import React from 'react'
import { ListenerMixin } from 'reflux'
import WellTippsUndTricks from './wellTippsUndTricks.js'
import WellAutorenrechte from './wellAutorenrechte.js'
import InputNameBestehend from './inputNameBestehend.js'
import ButtonDeleteRc from './buttonDeleteRc/buttonDeleteRc.js'
import InputName from './inputName.js'
import AlertEditingRcDisallowed from './alertEditingRcDisallowed.js'
import InputBeschreibung from './inputBeschreibung.js'
import InputDatenstand from './inputDatenstand.js'
import InputNutzungsbedingungen from './inputNutzungsbedingungen.js'
import InputLink from './inputLink.js'
import InputImportiertVon from './inputImportiertVon.js'
import InputZusammenfassend from './inputZusammenfassend.js'
import InputUrsprungsBs from './inputUrsprungsBs.js'
import ProgressbarDeleteRc from './progressbarDeleteRc.js'
import AlertDeleteRcBuildingIndex from './alertDeleteRcBuildingIndex.js'
import AlertFirst5Deleted from '../alertFirst5Deleted.js'
import AlertLoadAllGroups from '../alertLoadAllGroups.js'

export default React.createClass({
  displayName: 'DescribeRC',

  mixins: [ListenerMixin],

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
    importiertVon: React.PropTypes.string,
    zusammenfassend: React.PropTypes.bool,
    nameUrsprungsBs: React.PropTypes.string,
    email: React.PropTypes.string,
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
    onChangeNameBestehend: React.PropTypes.func
  },

  // nameBestehend ... nameUrsprungsBs: input fields
  // validXxx: to check validity of these fields
  getInitialState () {
    return {
      nameBestehend: null,
      name: null,
      beschreibung: null,
      datenstand: null,
      nutzungsbedingungen: null,
      link: null,
      importiertVon: this.props.email,
      zusammenfassend: null,
      nameUrsprungsBs: null,
      bsBearbeitenErlaubt: true,
      idsOfAeObjects: [],
      deletingRcProgress: null,
      ultimatelyAlertLoadAllGroups: false,
      validName: true,
      validBeschreibung: true,
      validDatenstand: true,
      validNutzungsbedingungen: true,
      validLink: true,
      validUrsprungsBs: true
    }
  },

  onBlurName (name) {
    const { isEditingRcAllowed } = this.props
    isEditingRcAllowed(name)
  },

  onBlurLink () {
    const { isLinkValid } = this.props
    isLinkValid()
  },

  render () {
    const { groupsLoadedOrLoading, email, rcs, allGroupsLoaded, groupsLoadingObjects, replicatingToAe, replicatingToAeTime, organizations, onClickDeleteRc, onChangeNameUrsprungsBs, onChangeZusammenfassend, onChangeLink, onChangeNutzungsbedingungen, onChangeDatenstand, onChangeBeschreibung, onChangeName, onChangeNameBestehend, bsBearbeitenErlaubt, idsOfAeObjects, validName, validBeschreibung, validDatenstand, validNutzungsbedingungen, validLink, validUrsprungsBs, beschreibung, datenstand, nutzungsbedingungen, link, importiertVon, zusammenfassend, nameUrsprungsBs, name, nameBestehend, ultimatelyAlertLoadAllGroups, deletingRcProgress } = this.props
    const showLoadAllGroups = email && !allGroupsLoaded
    const showAlertDeleteRcBuildingIndex = deletingRcProgress && deletingRcProgress < 100
    const alertAllGroupsBsStyle = ultimatelyAlertLoadAllGroups ? 'danger' : 'info'
    const enableDeleteRcButton = !!nameBestehend

    return (
      <div>
        {
          showLoadAllGroups
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
          rcs={rcs}
          groupsLoadedOrLoading={groupsLoadedOrLoading}
          onChangeNameBestehend={onChangeNameBestehend} />
        <ButtonDeleteRc
          nameBestehend={nameBestehend}
          enableDeleteRcButton={enableDeleteRcButton}
          deletingRcProgress={deletingRcProgress}
          onClickDeleteRc={onClickDeleteRc} />
        {
          showAlertDeleteRcBuildingIndex
          ? <AlertDeleteRcBuildingIndex />
          : null
        }
        {
          deletingRcProgress !== null
          ? <ProgressbarDeleteRc
              progress={deletingRcProgress} />
          : null
        }
        {
          deletingRcProgress === 100
          ? <div
              className='feld'>
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
          onBlurName={this.onBlurName} />
        {
          bsBearbeitenErlaubt
          ? null
          : <AlertEditingRcDisallowed />
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
          onBlurLink={this.onBlurLink} />
        <InputImportiertVon
          importiertVon={importiertVon} />
        <InputZusammenfassend
          zusammenfassend={zusammenfassend}
          onChangeZusammenfassend={onChangeZusammenfassend} />
        {
          zusammenfassend
          ? <InputUrsprungsBs
              nameUrsprungsBs={nameUrsprungsBs}
              rcs={rcs}
              validUrsprungsBs={validUrsprungsBs}
              onChangeNameUrsprungsBs={onChangeNameUrsprungsBs} />
          : null
        }
      </div>
    )
  }
})
