'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Accordion, Panel, ProgressBar, Button, Glyphicon } from 'react-bootstrap'
import _ from 'lodash'
import { ListenerMixin } from 'reflux'
import WellAutorenrechte from './wellAutorenrechte.js'
import WellTechnAnforderungenAnDatei from './wellTechnAnforderungenAnDatei.js'
import WellAnforderungenAnCsv from './wellAnforderungenAnCsv.js'
import WellAnforderungenInhaltlich from './wellAnforderungenInhaltlich.js'
import InputNameBestehend from './inputNameBestehend.js'
import ButtonDeleteRc from './buttonDeleteRc/buttonDeleteRc.js'
import ButtonDeleteRcInstances from './buttonDeleteRcInstances/buttonDeleteRcInstances.js'
import InputName from './inputName.js'
import AlertEditingRcDisallowed from './alertEditingRcDisallowed.js'
import InputBeschreibung from './inputBeschreibung.js'
import InputDatenstand from './inputDatenstand.js'
import InputNutzungsbedingungen from './inputNutzungsbedingungen.js'
import InputLink from './inputLink.js'
import InputImportiertVon from './inputImportiertVon.js'
import InputZusammenfassend from './inputZusammenfassend.js'
import InputUrsprungsBs from './inputUrsprungsBs.js'
import AlertIdsAnalysisResult from './alertIdsAnalysisResult.js'
import TablePreview from './tablePreview.js'
import InputImportFields from './inputImportFields.js'
import InputAeId from './inputAeId.js'
import ProgressbarImport from './progressbarImport.js'
import ProgressbarDeleteRc from './progressbarDeleteRc.js'
import AlertDeleteRcBuildingIndex from './alertDeleteRcBuildingIndex.js'
import AlertFirst5Imported from './alertFirst5Imported.js'
import AlertFirst5Deleted from './alertFirst5Deleted.js'
import getObjectsFromFile from './getObjectsFromFile.js'
import isValidUrl from '../../../modules/isValidUrl.js'
import getSuccessTypeFromAnalysis from './getSuccessTypeFromAnalysis.js'
import getGuidsById from '../../../modules/getGuidsById.js'
import AlertLoadAllGroups from './alertLoadAllGroups.js'

export default React.createClass({
  displayName: 'ImportRelationCollections',

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
    rcsToImport: React.PropTypes.array,
    rcsRemoved: React.PropTypes.bool,
    idsOfAeObjects: React.PropTypes.array,
    idsImportIdField: React.PropTypes.string,
    idsAeIdField: React.PropTypes.string,
    idsAnalysisComplete: React.PropTypes.bool,
    idsNumberOfRecordsWithIdValue: React.PropTypes.number,
    idsNumberImportable: React.PropTypes.number,
    idsNotImportable: React.PropTypes.array,
    idsNotANumber: React.PropTypes.array,
    idsWithoutPartner: React.PropTypes.array,
    rPartnerIdsToImport: React.PropTypes.array,
    rPartnerIdsImportable: React.PropTypes.array,
    importingProgress: React.PropTypes.number,
    deletingRcInstancesProgress: React.PropTypes.number,
    deletingRcProgress: React.PropTypes.number,
    bsBearbeitenErlaubt: React.PropTypes.bool,
    panel1Done: React.PropTypes.bool,
    panel2Done: React.PropTypes.bool,
    panel3Done: React.PropTypes.bool,
    ultimatelyAlertLoadAllGroups: React.PropTypes.bool,
    activePanel: React.PropTypes.number,
    validName: React.PropTypes.bool,
    validBeschreibung: React.PropTypes.bool,
    validDatenstand: React.PropTypes.bool,
    validNutzungsbedingungen: React.PropTypes.bool,
    validLink: React.PropTypes.bool,
    validUrsprungsBs: React.PropTypes.bool,
    validRcsToImport: React.PropTypes.bool,
    replicatingToAe: React.PropTypes.string,
    replicatingToAeTime: React.PropTypes.string
  },

  // nameBestehend ... nameUrsprungsBs: input fields
  // idsAnalysisComplete ... idsNotANumber: for analysing import file and id fields
  // panel1Done, panel2Done, panel3Done: to guide inputting
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
      rcs: [],
      rcsToImport: [],
      rcsRemoved: false,
      idsOfAeObjects: [],
      idsImportIdField: null,
      idsAeIdField: null,
      idsAnalysisComplete: false,
      idsNumberOfRecordsWithIdValue: 0,
      idsNumberImportable: 0,
      idsNotImportable: [],
      idsNotANumber: [],
      idsWithoutPartner: [],
      rPartnerIdsToImport: [],
      rPartnerIdsImportable: [],
      importingProgress: null,
      deletingRcInstancesProgress: null,
      deletingRcProgress: null,
      panel1Done: false,
      panel2Done: false,
      panel3Done: false,
      ultimatelyAlertLoadAllGroups: false,
      activePanel: 1,
      validName: true,
      validBeschreibung: true,
      validDatenstand: true,
      validNutzungsbedingungen: true,
      validLink: true,
      validUrsprungsBs: true,
      validRcsToImport: true
    }
  },

  componentDidMount () {
    this.listenTo(app.relationCollectionsStore, this.onChangeRelationCollectionsStore)
    this.listenTo(app.objectsRcsStore, this.onChangeObjectsRcsStore)
    // show login of not logged in
    const { email } = this.props
    if (!email) {
      const loginVariables = {
        logIn: true,
        email: undefined
      }
      app.Actions.login(loginVariables)
    }
    // get relation collections
    app.Actions.queryRelationCollections()
  },

  onChangeRelationCollectionsStore (rcs) {
    this.setState({ rcs })
  },

  onChangeObjectsRcsStore (state) {
    this.setState(state)
  },

  onChangeNameBestehend (nameBestehend) {
    const editingRcIsAllowed = this.isEditingRcAllowed(nameBestehend)
    if (nameBestehend) {
      app.relationCollectionsStore.getRcByName(nameBestehend)
        .then((rc) => {
          // only go on if rc exists (prevent error)
          if (rc) {
            const beschreibung = rc.fields.Beschreibung
            const datenstand = rc.fields.Datenstand
            const nutzungsbedingungen = rc.fields.Nutzungsbedingungen
            const link = rc.fields.Link
            const zusammenfassend = rc.combining
            const name = nameBestehend
            let state = { beschreibung, datenstand, nutzungsbedingungen, link, zusammenfassend }
            state = Object.assign(state, this.stateFollowingPanel1Reset())
            if (editingRcIsAllowed) state = Object.assign(state, { nameBestehend, name })
            this.setState(state)
          }
        })
        .catch((error) => app.Actions.showError({msg: error}))
    } else {
      this.setState({ nameBestehend: null })
    }
  },

  stateFollowingPanel1Reset () {
    return {
      rcsToImport: [],
      idsOfAeObjects: [],
      idsImportIdField: null,
      idsAeIdField: null,
      idsAnalysisComplete: false,
      idsNumberOfRecordsWithIdValue: 0,
      idsNumberImportable: 0,
      idsNotImportable: [],
      idsNotANumber: [],
      importingProgress: null,
      deletingRcInstancesProgress: null,
      deletingRcProgress: null,
      panel2Done: false,
      panel3Done: false
    }
  },

  onChangeName (name) {
    this.setState({ name })
  },

  onBlurName (name) {
    this.isEditingRcAllowed(name)
  },

  onChangeBeschreibung (beschreibung) {
    this.setState({ beschreibung })
  },

  onChangeDatenstand (datenstand) {
    this.setState({ datenstand })
  },

  onChangeNutzungsbedingungen (nutzungsbedingungen) {
    this.setState({ nutzungsbedingungen })
  },

  onChangeLink (link) {
    this.setState({ link })
  },

  onBlurLink () {
    this.validLink()
  },

  onChangeZusammenfassend (zusammenfassend) {
    const nameUrsprungsBs = null
    this.setState({ zusammenfassend, nameUrsprungsBs })
  },

  onChangeNameUrsprungsBs (nameUrsprungsBs) {
    this.setState({ nameUrsprungsBs })
    this.validUrsprungsBs(nameUrsprungsBs)
  },

  onChangeFile (event) {
    // always empty rcsToImport first
    // otherwise weird things happen
    // also reset analysis
    let state = {
      rcsToImport: [],
      idsAnalysisComplete: false,
      idsAeIdField: null,
      idsImportIdField: null
    }
    state = Object.assign(state, this.stateFollowingPanel2Reset())
    this.setState(state)
    if (event.target.files[0] !== undefined) {
      const file = event.target.files[0]
      getObjectsFromFile(file)
        .then((rcsToImport) => {
          this.setState({ rcsToImport })
          this.validRcsToImport()
        })
        .catch((error) => app.Actions.showError({title: 'Fehler beim Lesen der Datei:', msg: error}))
    }
  },

  stateFollowingPanel2Reset () {
    return {
      idsOfAeObjects: [],
      idsNumberOfRecordsWithIdValue: 0,
      idsNumberImportable: 0,
      idsNotImportable: [],
      idsNotANumber: [],
      importingProgress: null,
      deletingRcInstancesProgress: null,
      deletingRcProgress: null,
      panel3Done: false
    }
  },

  onChangeAeId (idsAeIdField) {
    const idsAnalysisComplete = false
    let state = { idsAeIdField, idsAnalysisComplete }
    state = Object.assign(state, this.stateFollowingPanel3Reset())
    this.setState(state, this.onChangeId)
  },

  onChangeImportId (idsImportIdField) {
    const idsAnalysisComplete = false
    let state = { idsImportIdField, idsAnalysisComplete }
    state = Object.assign(state, this.stateFollowingPanel3Reset())
    this.setState(state, this.onChangeId)
  },

  buildPartnerFromObject (object) {
    let partner = {}
    partner.Gruppe = object.Gruppe
    if (object.Gruppe === 'Lebensräume') {
      partner.Taxonomie = _.get(object, 'Taxonomie.Name')
      const label = _.get(object, 'Taxonomie.Eigenschaften.Label')
      const einheit = _.get(object, 'Taxonomie.Eigenschaften.Einheit')
      if (label) {
        partner.Name = label + ': ' + einheit
      } else {
        partner.Name = einheit
      }
    } else {
      partner.Name = object.Taxonomie.Eigenschaften['Artname vollständig']
    }
    partner.GUID = object._id
    return partner
  },

  onChangeId () {
    const { idsAeIdField, idsImportIdField, rcsToImport } = this.state

    if (idsAeIdField && idsImportIdField) {
      // start analysis
      // make sure data in idsImportIdField is a number, if idsAeIdField is not a GUID
      let idsNotANumber = []
      if (idsAeIdField !== 'GUID') {
        // the id field in the import data should be a number
        rcsToImport.forEach((rc, index) => {
          if (!isNaN(rc[idsImportIdField])) {
            // the data in the field is a number
            // force it to be one
            rc[idsImportIdField] = parseInt(rc[idsImportIdField], 10)
          } else {
            // the data in the field is not a number!
            idsNotANumber.push(rc[idsImportIdField])
          }
        })
      }
      // now prepare Beziehungspartner for import
      // also: output this info:
      // - idsWithoutPartner
      // - rPartnerIdsToImport
      // - rPartnerIdsImportable
      let idsWithoutPartner = []
      let rPartnerIdsToImport = []
      let rPartnerIdsImportable = []

      rcsToImport.forEach((rc, index) => {
        // Beziehungspartner in import data can be a single guid or a list of guids split by ', '
        // in ae it needs to be an array of objects
        let rPartnerIds = rc.Beziehungspartner.split(', ')
        // analyse
        if (rPartnerIds.length === 0) idsWithoutPartner.push(rc[idsImportIdField])
        rPartnerIdsToImport.push(rPartnerIds)
        // build rc.Beziehungspartner
        let rPartners = []
        // get an array of all partner objects
        Promise.all(rPartnerIds.map((id) => {
          return app.objectStore.getItem(id)
        }))
        .then((objects) => {
          // now build rPartner for each rPartnerId
          objects.forEach((object) => {
            rPartnerIdsImportable.push(object._id)
            rPartners.push(this.buildPartnerFromObject(object))
          })
          // push this in rPartners, not Beziehungssammlungen
          // - that is shown in ui so should not be changed
          rc.rPartners = rPartners
        })
        .catch((error) => {
          // ignore - can simply be that no object was found for id
        })
      })
      const rcPartnerState = { idsWithoutPartner, rPartnerIdsToImport, rPartnerIdsImportable }

      const ids = _.pluck(rcsToImport, idsImportIdField)
      // if ids should be numbers but some are not, an error can occur when fetching from the database
      // so dont fetch
      const idsAnalysisComplete = true
      if (idsNotANumber.length > 0) {
        const state = Object.assign(rcPartnerState, { idsAnalysisComplete, idsNotANumber })
        return this.setState(state)
      }
      getGuidsById(idsAeIdField, ids)
        .then((idGuidObject) => {
          // now add guids to rcsToImport
          rcsToImport.forEach((rc) => {
            const importId = rc[idsImportIdField]
            rc._id = idGuidObject[importId]
          })
          let idsToImportWithDuplicates = _.pluck(rcsToImport, idsImportIdField)
          // remove emtpy values
          idsToImportWithDuplicates = _.filter(idsToImportWithDuplicates, (id) => !!id)
          const idsNumberOfRecordsWithIdValue = idsToImportWithDuplicates.length
          const idsOfAeObjects = _.values(idGuidObject)
          const idGuidImportable = _.omit(idGuidObject, (guid, id) => !guid)
          const idsImportable = _.keys(idGuidImportable)
          // extracting from keys converts numbers to strings! Convert back
          idsImportable.forEach((id, index) => {
            if (!isNaN(id)) idsImportable[index] = parseInt(id, 10)
          })

          let idsNumberImportable = 0
          idsToImportWithDuplicates.forEach((id) => {
            if (_.includes(idsImportable, id)) idsNumberImportable++
          })
          // get ids not fetched
          const idsNotImportable = _.difference(idsToImportWithDuplicates, idsImportable)
          // finished? render...
          const relationState = { rcsToImport, idsNumberImportable, idsNotImportable, idsAnalysisComplete, idsOfAeObjects, idsNumberOfRecordsWithIdValue, idsNotANumber }
          const state = Object.assign(rcPartnerState, relationState)
          this.setState(state)
        })
        .catch((error) => app.Actions.showError({msg: error}))
    }
  },

  stateFollowingPanel3Reset () {
    return {
      importingProgress: null,
      deletingRcInstancesProgress: null,
      deletingRcProgress: null
    }
  },

  onClickImportieren () {
    const { rcsToImport, idsImportIdField, name, beschreibung, datenstand, nutzungsbedingungen, link, importiertVon, zusammenfassend, nameUrsprungsBs } = this.state
    app.Actions.importRcs({ rcsToImport, idsImportIdField, name, beschreibung, datenstand, nutzungsbedingungen, link, importiertVon, zusammenfassend, nameUrsprungsBs })
  },

  onClickDeleteRc () {
    const { name, idsOfAeObjects } = this.state
    // first remove progressbar and alert from last import
    const importingProgress = null
    const rcsRemoved = false
    const deletingRcProgress = 0
    this.setState({ importingProgress, rcsRemoved, deletingRcProgress }, () => app.Actions.deleteRcByName(name, idsOfAeObjects))
  },

  onClickRemoveRcInstances () {
    const { name, idsOfAeObjects } = this.state
    // first remove progressbar and alert from last import
    const importingProgress = null
    const rcsRemoved = false
    this.setState({ importingProgress, rcsRemoved }, () => app.Actions.deleteRcInstances(name, idsOfAeObjects))
  },

  onClickPanel (number, event) {
    let { activePanel } = this.state
    const { allGroupsLoaded } = this.props

    // make sure the heading was clicked
    const parent = event.target.parentElement
    const headingWasClicked = _.includes(parent.className, 'panel-title') || _.includes(parent.className, 'panel-heading')
    if (!headingWasClicked) return event.stopPropagation()

    // always close panel if it is open
    if (activePanel === number) return this.setState({ activePanel: '' })

    switch (number) {
    case 1:
      this.setState({ activePanel: 1 })
      break
    case 2:
      if (!allGroupsLoaded) this.setState({ ultimatelyAlertLoadAllGroups: true })
      const isPanel1Done = this.isPanel1Done()
      if (isPanel1Done && allGroupsLoaded) this.setState({ activePanel: 2 })
      break
    case 3:
      const isPanel2Done = this.isPanel2Done()
      if (isPanel2Done) this.setState({ activePanel: 3 })
      break
    case 4:
      const isPanel3Done = this.isPanel3Done()
      if (isPanel3Done) this.setState({ activePanel: 4 })
      break
    }
  },

  isPanel1Done () {
    const { email } = this.props
    // run all validation
    const validName = this.validName()
    const validBeschreibung = this.validBeschreibung()
    const validDatenstand = this.validDatenstand()
    const validNutzungsbedingungen = this.validNutzungsbedingungen()
    const validLink = this.validLink()
    const validUrsprungsBs = this.validUrsprungsBs()
    const validEmail = !!email
    // check if panel 1 is done
    const panel1Done = validName && validBeschreibung && validDatenstand && validNutzungsbedingungen && validLink && validUrsprungsBs && validEmail
    let state = { panel1Done }
    if (!panel1Done) state = Object.assign(state, { activePanel: 1 })
    this.setState(state)
    return panel1Done
  },

  isPanel2Done () {
    const validRcsToImport = this.validRcsToImport()
    const panel1Done = this.isPanel1Done()
    const panel2Done = panel1Done && validRcsToImport
    let state = { panel2Done }
    if (panel1Done && !panel2Done) state = Object.assign(state, { activePanel: 2 })
    this.setState(state)
    return panel2Done
  },

  isPanel3Done () {
    const { idsOfAeObjects, rcsToImport, idsNumberImportable, idsNotImportable, idsNotANumber } = this.state
    const isPanel2Done = this.isPanel2Done()
    const variablesToPass = {rcsToImport, idsNumberImportable, idsNotImportable, idsNotANumber }
    const idsAnalysisResultType = getSuccessTypeFromAnalysis(variablesToPass)
    const panel3Done = idsAnalysisResultType !== 'danger' && idsOfAeObjects.length > 0
    let state = { panel3Done }
    if (isPanel2Done && !panel3Done) state = Object.assign(state, { activePanel: 3 })
    this.setState(state)
    return panel3Done
  },

  isEditingRcAllowed (name) {
    const { rcs } = this.state
    const { email } = this.props
    // set editing allowed to true
    // reason: close alert if it is still shown from last select
    this.setState({ bsBearbeitenErlaubt: true })
    // check if this name exists
    // if so and it is not combining: check if it was imported by the user
    const sameRc = _.find(rcs, (rc) => rc.name === name)
    const bsBearbeitenErlaubt = !sameRc || (sameRc && (sameRc.combining || sameRc.importedBy === email))
    if (!bsBearbeitenErlaubt) {
      this.setState({ bsBearbeitenErlaubt: false })
      // delete text after a second
      setTimeout(() => this.setState({
          nameBestehend: null,
          name: null
        }), 1000)
      // close alert after 8 seconds
      setTimeout(() => this.setState({ bsBearbeitenErlaubt: true }), 8000)
    }
    return bsBearbeitenErlaubt
  },

  validName () {
    const validName = !!this.state.name
    this.setState({ validName })
    return validName
  },

  validBeschreibung () {
    const validBeschreibung = !!this.state.beschreibung
    this.setState({ validBeschreibung })
    return validBeschreibung
  },

  validDatenstand () {
    const validDatenstand = !!this.state.datenstand
    this.setState({ validDatenstand })
    return validDatenstand
  },

  validNutzungsbedingungen () {
    const validNutzungsbedingungen = !!this.state.nutzungsbedingungen
    this.setState({ validNutzungsbedingungen })
    return validNutzungsbedingungen
  },

  validLink () {
    const link = this.state.link
    const validLink = !link || isValidUrl(link)
    this.setState({ validLink })
    return validLink
  },

  validUrsprungsBs (nameUrsprungsBs) {
    // when nameUrsprungsBs is passed back from child component, this function is called right after setting state of nameUrsprungsBs
    // so state would not yet be updated! > needs to be passed directly
    const { zusammenfassend } = this.state
    if (!nameUrsprungsBs) nameUrsprungsBs = this.state.nameUrsprungsBs
    let validUrsprungsBs = true
    if (zusammenfassend && !nameUrsprungsBs) validUrsprungsBs = false
    this.setState({ validUrsprungsBs })
    return validUrsprungsBs
  },

  validRcsToImport () {
    const validRcsToImport = this.state.rcsToImport.length > 0
    this.setState({ validRcsToImport })
    return validRcsToImport
  },

  render () {
    const { nameBestehend, name, beschreibung, datenstand, nutzungsbedingungen, link, importiertVon, zusammenfassend, nameUrsprungsBs, bsBearbeitenErlaubt, rcsToImport, rcsRemoved, idsOfAeObjects, validName, validBeschreibung, validDatenstand, validNutzungsbedingungen, validLink, validUrsprungsBs, validRcsToImport, activePanel, idsAeIdField, idsImportIdField, rcs, idsNumberOfRecordsWithIdValue, idsNumberImportable, idsNotImportable, idsNotANumber, idsAnalysisComplete, ultimatelyAlertLoadAllGroups, panel3Done, importingProgress, deletingRcInstancesProgress, deletingRcProgress, idsWithoutPartner, rPartnerIdsToImport, rPartnerIdsImportable } = this.state
    const { groupsLoadedOrLoading, email, allGroupsLoaded, groupsLoadingObjects, replicatingToAe, replicatingToAeTime } = this.props
    const showLoadAllGroups = email && !allGroupsLoaded
    const showAlertDeleteRcBuildingIndex = deletingRcProgress && deletingRcProgress < 100
    const alertAllGroupsBsStyle = ultimatelyAlertLoadAllGroups ? 'danger' : 'info'
    const enableDeleteRcButton = !!nameBestehend
    const showDeleteRcInstancesButton = panel3Done
    const showProgressbarImport = importingProgress !== null && !rcsRemoved
    const showAlertFirst5Imported = importingProgress === 100 && !rcsRemoved

    return (
      <div id='importieren' className='formContent'>
        <h4>Beziehungen importieren</h4>
        <Accordion activeKey={activePanel}>
          <Panel collapsible header='1. Beziehungssammlung beschreiben' eventKey={1} onClick={this.onClickPanel.bind(this, 1)}>
            {showLoadAllGroups ? <AlertLoadAllGroups open='true' groupsLoadingObjects={groupsLoadingObjects} alertAllGroupsBsStyle={alertAllGroupsBsStyle} /> : null}
            <WellAutorenrechte />

            <InputNameBestehend nameBestehend={nameBestehend} beschreibung={beschreibung} datenstand={datenstand} nutzungsbedingungen={nutzungsbedingungen} link={link} zusammenfassend={zusammenfassend} email={email} rcs={rcs} groupsLoadedOrLoading={groupsLoadedOrLoading} onChangeNameBestehend={this.onChangeNameBestehend} />
            <ButtonDeleteRc nameBestehend={nameBestehend} enableDeleteRcButton={enableDeleteRcButton} deletingRcProgress={deletingRcProgress} onClickDeleteRc={this.onClickDeleteRc} />
            {showAlertDeleteRcBuildingIndex ? <AlertDeleteRcBuildingIndex /> : null}
            {deletingRcProgress !== null ? <ProgressbarDeleteRc progress={deletingRcProgress} /> : null}
            {deletingRcProgress === 100 ? <div className='feld'><AlertFirst5Deleted idsOfAeObjects={idsOfAeObjects} nameBestehend={nameBestehend} replicatingToAe={replicatingToAe} replicatingToAeTime={replicatingToAeTime} /></div> : null}

            <hr />

            <InputName name={name} validName={validName} onChangeName={this.onChangeName} onBlurName={this.onBlurName} />
            {bsBearbeitenErlaubt ? null : <AlertEditingRcDisallowed />}
            <InputBeschreibung beschreibung={beschreibung} validBeschreibung={validBeschreibung} onChangeBeschreibung={this.onChangeBeschreibung} />
            <InputDatenstand datenstand={datenstand} validDatenstand={validDatenstand} onChangeDatenstand={this.onChangeDatenstand} />
            <InputNutzungsbedingungen nutzungsbedingungen={nutzungsbedingungen} validNutzungsbedingungen={validNutzungsbedingungen} onChangeNutzungsbedingungen={this.onChangeNutzungsbedingungen} />
            <InputLink link={link} validLink={validLink} onChangeLink={this.onChangeLink} onBlurLink={this.onBlurLink} />
            <InputImportiertVon importiertVon={importiertVon} />
            <InputZusammenfassend zusammenfassend={zusammenfassend} onChangeZusammenfassend={this.onChangeZusammenfassend} />
            {zusammenfassend ? <InputUrsprungsBs nameUrsprungsBs={nameUrsprungsBs} rcs={rcs} validUrsprungsBs={validUrsprungsBs} onChangeNameUrsprungsBs={this.onChangeNameUrsprungsBs} /> : null}
          </Panel>

          <Panel collapsible header='2. Beziehungen laden' eventKey={2} onClick={this.onClickPanel.bind(this, 2)}>
            <WellTechnAnforderungenAnDatei />
            <WellAnforderungenAnCsv />
            <WellAnforderungenInhaltlich />

            <input type='file' className='form-control' onChange={this.onChangeFile} />
            {validRcsToImport ? null : <div className='validateDiv'>Bitte wählen Sie eine Datei</div>}

            {rcsToImport.length > 0 ? <TablePreview rcsToImport={rcsToImport} /> : null}
          </Panel>

          <Panel collapsible header="3. ID's identifizieren" eventKey={3} onClick={this.onClickPanel.bind(this, 3)}>
            {rcsToImport.length > 0 ? <InputImportFields idsImportIdField={idsImportIdField} rcsToImport={rcsToImport} onChangeImportId={this.onChangeImportId} /> : null}
            <InputAeId idsAeIdField={idsAeIdField} onChangeAeId={this.onChangeAeId} />
            {idsImportIdField && idsAeIdField ? <AlertIdsAnalysisResult idsImportIdField={idsImportIdField} idsAeIdField={idsAeIdField} rcsToImport={rcsToImport} idsNumberOfRecordsWithIdValue={idsNumberOfRecordsWithIdValue} idsNumberImportable={idsNumberImportable} idsNotImportable={idsNotImportable} idsAnalysisComplete={idsAnalysisComplete} idsNotANumber={idsNotANumber} idsWithoutPartner={idsWithoutPartner} rPartnerIdsToImport={rPartnerIdsToImport} rPartnerIdsImportable={rPartnerIdsImportable} /> : null}
          </Panel>

          <Panel collapsible header='4. Import ausführen' eventKey={4} onClick={this.onClickPanel.bind(this, 4)}>
            {panel3Done ? <Button className='btn-primary' onClick={this.onClickImportieren}><Glyphicon glyph='download-alt'/> Eigenschaftensammlung "{name}" importieren</Button> : null }
            {showDeleteRcInstancesButton ? <ButtonDeleteRcInstances name={name} rcsRemoved={rcsRemoved} deletingRcInstancesProgress={deletingRcInstancesProgress} onClickRemoveRcInstances={this.onClickRemoveRcInstances} /> : null}
            {showProgressbarImport ? <ProgressbarImport importingProgress={importingProgress} /> : null}
            {showAlertFirst5Imported ? <AlertFirst5Imported idsOfAeObjects={idsOfAeObjects} idsNotImportable={idsNotImportable} replicatingToAe={replicatingToAe} replicatingToAeTime={replicatingToAeTime} /> : null}
            {deletingRcInstancesProgress !== null ? <ProgressBar bsStyle='success' now={deletingRcInstancesProgress} label={`${deletingRcInstancesProgress}% entfernt`} /> : null}
            {deletingRcInstancesProgress === 100 ? <AlertFirst5Deleted idsOfAeObjects={idsOfAeObjects} nameBestehend={name} replicatingToAe={replicatingToAe} replicatingToAeTime={replicatingToAeTime} /> : null}
          </Panel>

        </Accordion>
      </div>
    )
  }
})
