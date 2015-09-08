'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Accordion, Panel, Well, ProgressBar, Button, Glyphicon } from 'react-bootstrap'
import _ from 'lodash'
import { ListenerMixin } from 'reflux'
import WellAutorenrechte from './wellAutorenrechte.js'
import WellTechnAnforderungenAnDatei from './wellTechnAnforderungenAnDatei.js'
import WellAnforderungenAnCsv from './wellAnforderungenAnCsv.js'
import WellAnforderungenInhaltlich from './wellAnforderungenInhaltlich.js'
import InputNameBestehend from './inputNameBestehend.js'
import ButtonDeletePc from './buttonDeletePc.js'
import ButtonDeletePcInstances from './buttonDeletePcInstances.js'
import InputName from './inputName.js'
import AlertEditingPcDisallowed from './alertEditingPcDisallowed.js'
import InputBeschreibung from './inputBeschreibung.js'
import InputDatenstand from './inputDatenstand.js'
import InputNutzungsbedingungen from './inputNutzungsbedingungen.js'
import InputLink from './inputLink.js'
import InputImportiertVon from './inputImportiertVon.js'
import InputZusammenfassend from './inputZusammenfassend.js'
import InputUrsprungsEs from './inputUrsprungsEs.js'
import AlertIdsAnalysisResult from './alertIdsAnalysisResult.js'
import TablePreview from './tablePreview.js'
import InputImportFields from './inputImportFields.js'
import InputAeId from './inputAeId.js'
import ProgressbarImport from './progressbarImport.js'
import AlertFirst5Imported from './alertFirst5Imported.js'
import AlertFirst5Deleted from './alertFirst5Deleted.js'
import getObjectsFromFile from './getObjectsFromFile.js'
import isValidUrl from '../../../modules/isValidUrl.js'
import getSuccessTypeFromAnalysis from './getSuccessTypeFromAnalysis.js'
import getGuidsById from '../../../modules/getGuidsById.js'
import convertValue from '../../../modules/convertValue.js'
import sortObjectArrayByName from '../../../modules/sortObjectArrayByName.js'
import AlertLoadAllGroups from './alertLoadAllGroups.js'

export default React.createClass({
  displayName: 'ImportPropertyCollections',

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
    nameUrsprungsEs: React.PropTypes.string,
    email: React.PropTypes.string,
    pcs: React.PropTypes.array,
    pcsToImport: React.PropTypes.array,
    pcsRemoved: React.PropTypes.bool,
    idsOfAeObjects: React.PropTypes.array,
    idsImportIdField: React.PropTypes.string,
    idsAeIdField: React.PropTypes.string,
    idsAnalysisComplete: React.PropTypes.bool,
    idsNumberOfRecordsWithIdValue: React.PropTypes.number,
    idsDuplicate: React.PropTypes.array,
    idsNumberImportable: React.PropTypes.number,
    idsNotImportable: React.PropTypes.array,
    idsNotANumber: React.PropTypes.array,
    importingProgress: React.PropTypes.number,
    deletingProgress: React.PropTypes.number,
    esBearbeitenErlaubt: React.PropTypes.bool,
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
    validUrsprungsEs: React.PropTypes.bool,
    validPcsToImport: React.PropTypes.bool
  },

  // nameBestehend ... nameUrsprungsEs: input fields
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
      nameUrsprungsEs: null,
      esBearbeitenErlaubt: true,
      pcs: [],
      pcsToImport: [],
      pcsRemoved: false,
      idsOfAeObjects: [],
      idsImportIdField: null,
      idsAeIdField: null,
      idsAnalysisComplete: false,
      idsNumberOfRecordsWithIdValue: 0,
      idsDuplicate: [],
      idsNumberImportable: 0,
      idsNotImportable: [],
      idsNotANumber: [],
      importingProgress: null,
      deletingProgress: null,
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
      validUrsprungsEs: true,
      validPcsToImport: true
    }
  },

  componentDidMount () {
    this.listenTo(app.propertyCollectionsStore, this.onChangePropertyCollectionsStore)
    this.listenTo(app.objectsPcsStore, this.onChangeObjectsPcsStore)
    // show login of not logged in
    const { email } = this.props
    if (!email) {
      const loginVariables = {
        logIn: true,
        email: undefined
      }
      app.Actions.login(loginVariables)
    }
    // get property collections
    app.Actions.queryPropertyCollections()
  },

  onChangePropertyCollectionsStore (pcs) {
    this.setState({ pcs })
  },

  onChangeObjectsPcsStore (stateVariables) {
    this.setState(stateVariables)
  },

  onChangeNameBestehend (nameBestehend) {
    const editingPcIsAllowed = this.isEditingPcAllowed(nameBestehend)
    if (nameBestehend) {
      app.propertyCollectionsStore.getPcByName(nameBestehend)
        .then((pc) => {
          // only go on if pc exists (prevent error)
          if (pc) {
            const beschreibung = pc.fields.Beschreibung
            const datenstand = pc.fields.Datenstand
            const nutzungsbedingungen = pc.fields.Nutzungsbedingungen
            const link = pc.fields.Link
            const zusammenfassend = pc.combining
            const name = nameBestehend
            this.setState({ beschreibung, datenstand, nutzungsbedingungen, link, zusammenfassend })
            this.resetStateFollowingPanel1()
            if (editingPcIsAllowed) this.setState({ nameBestehend, name })
          }
        })
        .catch((error) => app.Actions.showError({msg: error}))
    } else {
      this.setState({ nameBestehend: null })
    }
  },

  resetStateFollowingPanel1 () {
    this.setState({
      pcsToImport: [],
      idsOfAeObjects: [],
      idsImportIdField: null,
      idsAeIdField: null,
      idsAnalysisComplete: false,
      idsNumberOfRecordsWithIdValue: 0,
      idsDuplicate: [],
      idsNumberImportable: 0,
      idsNotImportable: [],
      idsNotANumber: [],
      importingProgress: null,
      deletingProgress: null,
      panel2Done: false,
      panel3Done: false
    })
  },

  addNewNameBestehend () {
    /**
     * goal is to update the list of pcs and therewith the dropdown lists in nameBestehend and ursprungsEs
     * we could do it by querying the db again with app.Actions.queryPropertyCollections()
     * but this is 1. very slow so happens too late and 2. uses lots of ressources
     * so we build a new pc
     * and add it to the propertyCollectionsStore
     * propertyCollectionsStore triggers new pcs and lists get refreshed
     */
    let { name, beschreibung, datenstand, nutzungsbedingungen, link, importiertVon, zusammenfassend } = this.state
    const pc = {
      name: name,
      combining: zusammenfassend,
      importedBy: importiertVon,
      fields: {
        Beschreibung: beschreibung,
        Datenstand: datenstand,
        Nutzungsbedingungen: nutzungsbedingungen,
        Link: link,
        'importiert von': importiertVon
      },
      count: 0
    }
    app.propertyCollectionsStore.savePc(pc)
  },

  resetUiAfterDeleting () {
    /**
     * this is passed as a callback to ButtonDeletePc.js > ModalDeletePc.js
     * objects are deleted in ModalDeletePc.js
     *
     * goal is to update the list of pcs and therewith the dropdown lists in nameBestehend and ursprungsEs
     * we could do it by querying the db again with app.Actions.queryPropertyCollections()
     * but this is 1. very slow so happens too late and 2. uses lots of ressources
     * so we manually remove the new pc from pcs
     * and then update pcs in state and store (this is done when propertyCollectionsStore triggers new pcs)
     */
    // let { nameBestehend } = this.state
    // app.propertyCollectionsStore.removePcByName(nameBestehend)
    const nameBestehend = null
    this.setState({ nameBestehend })
  },

  onChangeName (name) {
    this.setState({ name })
  },

  onBlurName (name) {
    this.isEditingPcAllowed(name)
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
    const nameUrsprungsEs = null
    this.setState({ zusammenfassend, nameUrsprungsEs })
  },

  onChangeNameUrsprungsEs (nameUrsprungsEs) {
    this.setState({ nameUrsprungsEs })
    this.validUrsprungsEs(nameUrsprungsEs)
  },

  onChangePcFile (event) {
    // always empty pcsToImport first
    // otherwise weird things happen
    // also reset analysis
    this.setState({
      pcsToImport: [],
      idsAnalysisComplete: false,
      idsAeIdField: null,
      idsImportIdField: null
    })
    this.resetStateFollowingPanel2()
    if (event.target.files[0] !== undefined) {
      const file = event.target.files[0]
      getObjectsFromFile(file)
        .then((pcsToImport) => {
          this.setState({ pcsToImport })
          this.validPcsToImport()
        })
        .catch((error) => app.Actions.showError({title: 'error reading file:', msg: error}))
    }
  },

  resetStateFollowingPanel2 () {
    this.setState({
      idsOfAeObjects: [],
      idsNumberOfRecordsWithIdValue: 0,
      idsDuplicate: [],
      idsNumberImportable: 0,
      idsNotImportable: [],
      idsNotANumber: [],
      importingProgress: null,
      deletingProgress: null,
      panel3Done: false
    })
  },

  onChangeAeId (idsAeIdField) {
    const idsAnalysisComplete = false
    this.setState({ idsAeIdField, idsAnalysisComplete }, this.onChangeId)
  },

  onChangeImportId (idsImportIdField) {
    const idsAnalysisComplete = false
    this.setState({ idsImportIdField, idsAnalysisComplete }, this.onChangeId)
  },

  // need to get values directly because state has not been updated yet
  onChangeId () {
    const { idsAeIdField, idsImportIdField, pcsToImport } = this.state

    this.resetStateFollowingPanel3()

    if (idsAeIdField && idsImportIdField) {
      // start analysis

      // make sure data in idsImportIdField is a number, if idsAeIdField is not a GUID
      let idsNotANumber = []
      if (idsAeIdField !== 'GUID') {
        // the id field in the import data should be a number
        pcsToImport.forEach((pc, index) => {
          if (!isNaN(pc[idsImportIdField])) {
            // the data in the field is a number
            // force it to be one
            pc[idsImportIdField] = parseInt(pc[idsImportIdField], 10)
          } else {
            // the data in the field is not a number!
            idsNotANumber.push(pc[idsImportIdField])
          }
        })
      }
      const ids = _.pluck(pcsToImport, idsImportIdField)
      // if ids should be numbers but some are not, an error can occur when fetching from the database
      // so dont fetch
      if (idsNotANumber.length > 0) return this.setState({ idsAnalysisComplete: true, idsNotANumber: idsNotANumber })
      getGuidsById(idsAeIdField, ids)
        .then((idGuidObject) => {
          // now add guids to pcsToImport
          pcsToImport.forEach((pc) => {
            const importId = pc[idsImportIdField]
            pc._id = idGuidObject[importId]
          })
          let idsToImportWithDuplicates = _.pluck(pcsToImport, idsImportIdField)
          // remove emtpy values
          idsToImportWithDuplicates = _.filter(idsToImportWithDuplicates, (id) => !!id)
          // remove duplicates
          const idsToImport = _.unique(idsToImportWithDuplicates)
          const idsNumberOfRecordsWithIdValue = idsToImportWithDuplicates.length
          const idsDuplicate = _.difference(idsToImportWithDuplicates, idsToImport)
          // go on with analysis
          const idsOfAeObjects = _.values(idGuidObject)

          const idGuidImportable = _.omit(idGuidObject, (guid, id) => !guid)
          const idsImportable = _.keys(idGuidImportable)
          // Problem: extracting from keys converts numbers to strings! Convert back
          idsImportable.forEach((id, index) => {
            if (!isNaN(id)) idsImportable[index] = parseInt(id, 10)
          })

          const idsNumberImportable = idsImportable.length
          // get ids not fetched
          const idsNotImportable = _.difference(idsToImport, idsImportable)
          const idsAnalysisComplete = true
          // finished? render...
          this.setState({ idsNumberImportable, idsNotImportable, idsAnalysisComplete, idsOfAeObjects, idsNumberOfRecordsWithIdValue, idsDuplicate, idsNotANumber })
        })
        .catch((error) => app.Actions.showError({msg: error}))
    }
  },

  resetStateFollowingPanel3 () {
    this.setState({
      importingProgress: null,
      deletingProgress: null
    })
  },

  onClickImportieren () {
    const { pcsToImport, idsImportIdField, name, beschreibung, datenstand, nutzungsbedingungen, link, importiertVon, zusammenfassend, nameUrsprungsEs } = this.state

    let importingProgress = 0
    let idsImported = []
    // alert say "Daten werden vorbereitet..."
    this.setState({ importingProgress }, () => {
      // loop pcsToImport
      pcsToImport.forEach((pcToImport, index) => {
        // get the object to add it to
        const guid = pcToImport._id
        if (guid) {
          app.objectStore.getItem(guid)
            .then((objectToImportPcInTo) => {
              // build pc
              let pc = {}
              pc.Name = name
              pc.Beschreibung = beschreibung
              pc.Datenstand = datenstand
              pc.Nutzungsbedingungen = nutzungsbedingungen
              if (link) pc.Link = link
              pc['importiert von'] = importiertVon
              if (zusammenfassend) pc.zusammenfassend = zusammenfassend
              if (nameUrsprungsEs) pc.Ursprungsdatensammlung = nameUrsprungsEs
              pc.Eigenschaften = {}
              // now add fields of pc
              _.forEach(pcToImport, (value, field) => {
                // dont import _id, idField or empty fields
                if (field !== '_id' && field !== idsImportIdField && value !== '' && value !== null) {
                  // convert values / types if necessary
                  pc.Eigenschaften[field] = convertValue(value)
                }
              })
              // make sure, Eigenschaftensammlungen exists
              if (!objectToImportPcInTo.Eigenschaftensammlungen) objectToImportPcInTo.Eigenschaftensammlungen = []
              // if a pc with this name existed already, remove it
              objectToImportPcInTo.Eigenschaftensammlungen = _.reject(objectToImportPcInTo.Eigenschaftensammlungen, (es) => es.name === name)
              objectToImportPcInTo.Eigenschaftensammlungen.push(pc)
              objectToImportPcInTo.Eigenschaftensammlungen = sortObjectArrayByName(objectToImportPcInTo.Eigenschaftensammlungen)
              // write to db
              return app.localDb.put(objectToImportPcInTo)
            })
            .then(() => {
              importingProgress = Math.round((index + 1) / pcsToImport.length * 100)
              this.setState({ importingProgress }, () => idsImported.push(pcToImport._id))
            })
            .catch((error) => app.Actions.showError({title: 'Fehler beim Importieren:', msg: error}))
        }
      })
      // reset pcsRemoved to show button to remove again
      const pcsRemoved = false
      this.setState({ pcsRemoved })
      // update nameBestehend
      this.addNewNameBestehend()
    })
  },

  onClickRemovePcInstances () {
    const { name, idsOfAeObjects } = this.state
    // first remove progressbar and alert from last import
    let deletingProgress = 0
    let pcsRemoved = false
    this.setState({ deletingProgress, pcsRemoved }, () => app.Actions.removePcInstances(name, idsOfAeObjects))
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
    const validUrsprungsEs = this.validUrsprungsEs()
    const validEmail = !!email
    // check if panel 1 is done
    const panel1Done = validName && validBeschreibung && validDatenstand && validNutzungsbedingungen && validLink && validUrsprungsEs && validEmail
    this.setState({ panel1Done })
    if (!panel1Done) this.setState({ activePanel: 1 })
    return panel1Done
  },

  isPanel2Done () {
    const validPcsToImport = this.validPcsToImport()
    const panel1Done = this.isPanel1Done()
    const panel2Done = panel1Done && validPcsToImport
    this.setState({ panel2Done })
    if (panel1Done && !panel2Done) this.setState({ activePanel: 2 })
    return panel2Done
  },

  isPanel3Done () {
    const { idsOfAeObjects, pcsToImport, idsNumberImportable, idsNotImportable, idsNotANumber, idsDuplicate } = this.state
    const isPanel2Done = this.isPanel2Done()
    const variablesToPass = {pcsToImport, idsNumberImportable, idsNotImportable, idsNotANumber, idsDuplicate}
    const idsAnalysisResultType = getSuccessTypeFromAnalysis(variablesToPass)
    const panel3Done = idsAnalysisResultType !== 'danger' && idsOfAeObjects.length > 0
    this.setState({ panel3Done })
    if (isPanel2Done && !panel3Done) this.setState({ activePanel: 3 })
    return panel3Done
  },

  isEditingPcAllowed (name) {
    const { pcs } = this.state
    const { email } = this.props
    // set editing allowed to true
    // reason: close alert if it is still shown from last select
    this.setState({ esBearbeitenErlaubt: true })
    // check if this name exists
    // if so and it is not combining: check if it was imported by the user
    const samePc = _.find(pcs, (pc) => pc.name === name)
    const esBearbeitenErlaubt = !samePc || (samePc && (samePc.combining || samePc.importedBy === email))
    if (!esBearbeitenErlaubt) {
      this.setState({ esBearbeitenErlaubt: false })
      // delete text after a second
      setTimeout(() => {
        this.setState({
          nameBestehend: null,
          name: null
        })
      }, 1000)
      // close alert after 8 seconds
      setTimeout(() => {
        this.setState({ esBearbeitenErlaubt: true })
      }, 8000)
    }
    return esBearbeitenErlaubt
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

  validUrsprungsEs (nameUrsprungsEs) {
    // when nameUrsprungsEs is passed back from child component, this function is called right after setting state of nameUrsprungsEs
    // so state would not yet be updated! > needs to be passed directly
    const { zusammenfassend } = this.state
    if (!nameUrsprungsEs) nameUrsprungsEs = this.state.nameUrsprungsEs
    let validUrsprungsEs = true
    if (zusammenfassend && !nameUrsprungsEs) validUrsprungsEs = false
    this.setState({ validUrsprungsEs })
    return validUrsprungsEs
  },

  validPcsToImport () {
    const validPcsToImport = this.state.pcsToImport.length > 0
    this.setState({ validPcsToImport })
    return validPcsToImport
  },

  render () {
    const { nameBestehend, name, beschreibung, datenstand, nutzungsbedingungen, link, importiertVon, zusammenfassend, nameUrsprungsEs, esBearbeitenErlaubt, pcsToImport, pcsRemoved, idsOfAeObjects, validName, validBeschreibung, validDatenstand, validNutzungsbedingungen, validLink, validUrsprungsEs, validPcsToImport, activePanel, idsAeIdField, idsImportIdField, pcs, idsNumberOfRecordsWithIdValue, idsDuplicate, idsNumberImportable, idsNotImportable, idsNotANumber, idsAnalysisComplete, ultimatelyAlertLoadAllGroups, panel3Done, importingProgress, deletingProgress } = this.state
    const { groupsLoadedOrLoading, email, allGroupsLoaded, groupsLoadingObjects } = this.props
    const showLoadAllGroups = email && !allGroupsLoaded
    const alertAllGroupsBsStyle = ultimatelyAlertLoadAllGroups ? 'danger' : 'info'
    const enableDeletePcButton = !!nameBestehend
    const showDeletePcInstancesButton = panel3Done
    const showProgressbarImport = importingProgress !== null && !pcsRemoved
    const showAlertFirst5Imported = importingProgress === 100 && !pcsRemoved

    return (
      <div id='importieren'>
        <h4>Eigenschaften importieren</h4>
        <Accordion activeKey={activePanel}>
          <Panel collapsible header='1. Eigenschaftensammlung beschreiben' eventKey={1} onClick={this.onClickPanel.bind(this, 1)}>
            {showLoadAllGroups ? <AlertLoadAllGroups open='true' groupsLoadingObjects={groupsLoadingObjects} alertAllGroupsBsStyle={alertAllGroupsBsStyle} /> : null}
            <Well className='well-sm'><a href='//youtu.be/nqd-v6YxkOY' target='_blank'><b>Auf Youtube sehen, wie es geht</b></a></Well>
            <WellAutorenrechte />

            <InputNameBestehend nameBestehend={nameBestehend} beschreibung={beschreibung} datenstand={datenstand} nutzungsbedingungen={nutzungsbedingungen} link={link} zusammenfassend={zusammenfassend} email={email} pcs={pcs} groupsLoadedOrLoading={groupsLoadedOrLoading} onChangeNameBestehend={this.onChangeNameBestehend} />
            <ButtonDeletePc nameBestehend={nameBestehend} enableDeletePcButton={enableDeletePcButton} resetUiAfterDeleting={this.resetUiAfterDeleting} />

            <hr />

            <InputName name={name} validName={validName} onChangeName={this.onChangeName} onBlurName={this.onBlurName} />
            {esBearbeitenErlaubt ? null : <AlertEditingPcDisallowed />}
            <InputBeschreibung beschreibung={beschreibung} validBeschreibung={validBeschreibung} onChangeBeschreibung={this.onChangeBeschreibung} />
            <InputDatenstand datenstand={datenstand} validDatenstand={validDatenstand} onChangeDatenstand={this.onChangeDatenstand} />
            <InputNutzungsbedingungen nutzungsbedingungen={nutzungsbedingungen} validNutzungsbedingungen={validNutzungsbedingungen} onChangeNutzungsbedingungen={this.onChangeNutzungsbedingungen} />
            <InputLink link={link} validLink={validLink} onChangeLink={this.onChangeLink} onBlurLink={this.onBlurLink} />
            <InputImportiertVon importiertVon={importiertVon} />
            <InputZusammenfassend zusammenfassend={zusammenfassend} onChangeZusammenfassend={this.onChangeZusammenfassend} />
            {zusammenfassend ? <InputUrsprungsEs nameUrsprungsEs={nameUrsprungsEs} pcs={pcs} validUrsprungsEs={validUrsprungsEs} onChangeNameUrsprungsEs={this.onChangeNameUrsprungsEs} /> : null}
          </Panel>

          <Panel collapsible header='2. Eigenschaften laden' eventKey={2} onClick={this.onClickPanel.bind(this, 2)}>
            <WellTechnAnforderungenAnDatei />
            <WellAnforderungenAnCsv />
            <WellAnforderungenInhaltlich />

            <input type='file' className='form-control' id='pcFile' onChange={this.onChangePcFile} />
            {validPcsToImport ? null : <div className='validateDiv'>Bitte wählen Sie eine Datei</div>}

            {pcsToImport.length > 0 ? <TablePreview pcsToImport={pcsToImport} /> : null}
          </Panel>

          <Panel collapsible header="3. ID's identifizieren" eventKey={3} onClick={this.onClickPanel.bind(this, 3)}>
            {pcsToImport.length > 0 ? <InputImportFields idsImportIdField={idsImportIdField} pcsToImport={pcsToImport} onChangeImportId={this.onChangeImportId} /> : null}
            <InputAeId idsAeIdField={idsAeIdField} onChangeAeId={this.onChangeAeId} />
            {idsImportIdField && idsAeIdField ? <AlertIdsAnalysisResult idsImportIdField={idsImportIdField} pcsToImport={pcsToImport} idsNumberOfRecordsWithIdValue={idsNumberOfRecordsWithIdValue} idsDuplicate={idsDuplicate} idsNumberImportable={idsNumberImportable} idsNotImportable={idsNotImportable} idsAnalysisComplete={idsAnalysisComplete} idsNotANumber={idsNotANumber} /> : null}
          </Panel>

          <Panel collapsible header='4. Import ausführen' eventKey={4} onClick={this.onClickPanel.bind(this, 4)}>
            {panel3Done ? <Button className='btn-primary' onClick={this.onClickImportieren}><Glyphicon glyph='download-alt'/> Eigenschaftensammlung "{name}" importieren</Button> : null }
            {showDeletePcInstancesButton ? <ButtonDeletePcInstances name={name} idsOfAeObjects={idsOfAeObjects} pcsRemoved={pcsRemoved} deletingProgress={deletingProgress} onClickRemovePcInstances={this.onClickRemovePcInstances} /> : null}
            {showProgressbarImport ? <ProgressbarImport importingProgress={importingProgress} /> : null}
            {showAlertFirst5Imported ? <AlertFirst5Imported idsOfAeObjects={idsOfAeObjects} idsNotImportable={idsNotImportable} /> : null}
            {deletingProgress !== null ? <ProgressBar bsStyle='success' now={deletingProgress} label={`${deletingProgress}% entfernt`} /> : null}
            {deletingProgress === 100 ? <AlertFirst5Deleted idsOfAeObjects={idsOfAeObjects} nameBestehend={name} /> : null}
          </Panel>

        </Accordion>
      </div>
    )
  }
})
