'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Accordion, Panel, ProgressBar, Button, Glyphicon } from 'react-bootstrap'
import _ from 'lodash'
import { ListenerMixin } from 'reflux'
import Panel1 from './panel1/panel1.js'
import Panel2 from './panel2/panel2.js'
import ButtonDeletePcInstances from './buttonDeletePcInstances/buttonDeletePcInstances.js'
import AlertIdsAnalysisResult from './alertIdsAnalysisResult.js'
import InputImportFields from './inputImportFields.js'
import InputAeId from './inputAeId.js'
import ProgressbarImport from './progressbarImport.js'
import AlertFirst5Imported from './alertFirst5Imported.js'
import AlertFirst5Deleted from './alertFirst5Deleted.js'
import getObjectsFromFile from './getObjectsFromFile.js'
import isValidUrl from '../../../modules/isValidUrl.js'
import getSuccessTypeFromAnalysis from './getSuccessTypeFromAnalysis.js'
import getGuidsById from '../../../modules/getGuidsById.js'

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
    deletingPcInstancesProgress: React.PropTypes.number,
    deletingPcProgress: React.PropTypes.number,
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
    validPcsToImport: React.PropTypes.bool,
    replicatingToAe: React.PropTypes.string,
    replicatingToAeTime: React.PropTypes.string,
    offlineIndexes: React.PropTypes.bool
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
      deletingPcInstancesProgress: null,
      deletingPcProgress: null,
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
    this.listenTo(app.objectsPcsStore, this.onChangeObjectsPcsStore)
    // show login of not logged in
    const { email, offlineIndexes } = this.props
    if (!email) {
      const loginVariables = {
        logIn: true,
        email: undefined
      }
      app.Actions.login(loginVariables)
    }
    // get property collections
    app.Actions.queryPropertyCollections(offlineIndexes)
  },

  onChangeObjectsPcsStore (state) {
    this.setState(state)
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
            let state = { beschreibung, datenstand, nutzungsbedingungen, link, zusammenfassend }
            state = Object.assign(state, this.stateFollowingPanel1Reset())
            if (editingPcIsAllowed) state = Object.assign(state, { nameBestehend, name })
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
      deletingPcInstancesProgress: null,
      deletingPcProgress: null,
      panel2Done: false,
      panel3Done: false
    }
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

  onChangeFile (event) {
    // always empty pcsToImport first
    // otherwise weird things happen
    // also reset analysis
    let state = {
      pcsToImport: [],
      idsAnalysisComplete: false,
      idsAeIdField: null,
      idsImportIdField: null
    }
    state = Object.assign(state, this.stateFollowingPanel2Reset())
    this.setState(state)
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

  stateFollowingPanel2Reset () {
    return {
      idsOfAeObjects: [],
      idsNumberOfRecordsWithIdValue: 0,
      idsDuplicate: [],
      idsNumberImportable: 0,
      idsNotImportable: [],
      idsNotANumber: [],
      importingProgress: null,
      deletingPcInstancesProgress: null,
      deletingPcProgress: null,
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

  onChangeId () {
    const { idsAeIdField, idsImportIdField, pcsToImport } = this.state
    const { offlineIndexes } = this.props

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
      getGuidsById(idsAeIdField, ids, offlineIndexes)
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
          // extracting from keys converts numbers to strings! Convert back
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

  stateFollowingPanel3Reset () {
    return {
      importingProgress: null,
      deletingPcInstancesProgress: null,
      deletingPcProgress: null
    }
  },

  onClickImportieren () {
    const { pcsToImport, idsImportIdField, name, beschreibung, datenstand, nutzungsbedingungen, link, importiertVon, zusammenfassend, nameUrsprungsEs } = this.state
    app.Actions.importPcs({ pcsToImport, idsImportIdField, name, beschreibung, datenstand, nutzungsbedingungen, link, importiertVon, zusammenfassend, nameUrsprungsEs })
  },

  onClickDeletePc () {
    const { name } = this.state
    const { offlineIndexes } = this.props
    // first remove progressbar and alert from last import
    const importingProgress = null
    const pcsRemoved = false
    const deletingPcProgress = 0
    this.setState({ importingProgress, pcsRemoved, deletingPcProgress }, () => app.Actions.deletePcByName(name, offlineIndexes))
  },

  onClickRemovePcInstances () {
    const { name, idsOfAeObjects } = this.state
    // first remove progressbar and alert from last import
    const importingProgress = null
    const pcsRemoved = false
    this.setState({ importingProgress, pcsRemoved }, () => app.Actions.deletePcInstances(name, idsOfAeObjects))
  },

  onClickPanel (number, event) {
    let { activePanel } = this.state
    const { allGroupsLoaded } = this.props

    // make sure the heading was clicked
    const parent = event.target.parentElement
    const headingWasClicked = _.includes(parent.className, 'panel-title') || _.includes(parent.className, 'panel-heading')
    if (headingWasClicked) {
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
    let state = { panel1Done }
    if (!panel1Done) state = Object.assign(state, { activePanel: 1 })
    this.setState(state)
    return panel1Done
  },

  isPanel2Done () {
    const validPcsToImport = this.validPcsToImport()
    const panel1Done = this.isPanel1Done()
    const panel2Done = panel1Done && validPcsToImport
    let state = { panel2Done }
    if (panel1Done && !panel2Done) state = Object.assign(state, { activePanel: 2 })
    this.setState(state)
    return panel2Done
  },

  isPanel3Done () {
    const { idsOfAeObjects, pcsToImport, idsNumberImportable, idsNotImportable, idsNotANumber, idsDuplicate } = this.state
    const isPanel2Done = this.isPanel2Done()
    const variablesToPass = {pcsToImport, idsNumberImportable, idsNotImportable, idsNotANumber, idsDuplicate}
    const idsAnalysisResultType = getSuccessTypeFromAnalysis(variablesToPass)
    const panel3Done = idsAnalysisResultType !== 'danger' && idsOfAeObjects.length > 0
    let state = { panel3Done }
    if (isPanel2Done && !panel3Done) state = Object.assign(state, { activePanel: 3 })
    this.setState(state)
    return panel3Done
  },

  isEditingPcAllowed (name) {
    const { email, pcs } = this.props
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
      setTimeout(() => this.setState({
          nameBestehend: null,
          name: null
        }), 1000)
      // close alert after 8 seconds
      setTimeout(() => this.setState({ esBearbeitenErlaubt: true }), 8000)
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
    const { nameBestehend, name, beschreibung, datenstand, nutzungsbedingungen, link, importiertVon, zusammenfassend, nameUrsprungsEs, esBearbeitenErlaubt, pcsToImport, pcsRemoved, idsOfAeObjects, validName, validBeschreibung, validDatenstand, validNutzungsbedingungen, validLink, validUrsprungsEs, validPcsToImport, activePanel, idsAeIdField, idsImportIdField, idsNumberOfRecordsWithIdValue, idsDuplicate, idsNumberImportable, idsNotImportable, idsNotANumber, idsAnalysisComplete, ultimatelyAlertLoadAllGroups, panel3Done, importingProgress, deletingPcInstancesProgress, deletingPcProgress } = this.state
    const { groupsLoadedOrLoading, email, pcs, allGroupsLoaded, groupsLoadingObjects, replicatingToAe, replicatingToAeTime } = this.props
    const showDeletePcInstancesButton = panel3Done
    const showProgressbarImport = importingProgress !== null && !pcsRemoved
    const showAlertFirst5Imported = importingProgress === 100 && !pcsRemoved

    return (
      <div id='importieren' className='formContent'>
        <h4>Eigenschaften importieren</h4>
        <Accordion activeKey={activePanel}>
          <Panel collapsible header='1. Eigenschaftensammlung beschreiben' eventKey={1} onClick={this.onClickPanel.bind(this, 1)}>
            {activePanel === 1 ?
              <Panel1
                groupsLoadingObjects={groupsLoadingObjects}
                allGroupsLoaded={allGroupsLoaded}
                groupsLoadedOrLoading={groupsLoadedOrLoading}
                nameBestehend={nameBestehend}
                name={name}
                beschreibung={beschreibung}
                datenstand={datenstand}
                nutzungsbedingungen={nutzungsbedingungen}
                link={link}
                importiertVon={importiertVon}
                zusammenfassend={zusammenfassend}
                nameUrsprungsEs={nameUrsprungsEs}
                email={email}
                pcs={pcs}
                idsOfAeObjects={idsOfAeObjects}
                deletingPcProgress={deletingPcProgress}
                esBearbeitenErlaubt={esBearbeitenErlaubt}
                ultimatelyAlertLoadAllGroups={ultimatelyAlertLoadAllGroups}
                validName={validName}
                validBeschreibung={validBeschreibung}
                validDatenstand={validDatenstand}
                validNutzungsbedingungen={validNutzungsbedingungen}
                validLink={validLink}
                validUrsprungsEs={validUrsprungsEs}
                replicatingToAe={replicatingToAe}
                replicatingToAeTime={replicatingToAeTime}
                onClickDeletePc={this.onClickDeletePc}
                onChangeNameUrsprungsEs={this.onChangeNameUrsprungsEs}
                onChangeZusammenfassend={this.onChangeZusammenfassend}
                onBlurLink={this.onBlurLink}
                onChangeLink={this.onChangeLink}
                onChangeNutzungsbedingungen={this.onChangeNutzungsbedingungen}
                onChangeDatenstand={this.onChangeDatenstand}
                onChangeBeschreibung={this.onChangeBeschreibung}
                onBlurName={this.onBlurName}
                onChangeName={this.onChangeName}
                onChangeNameBestehend={this.onChangeNameBestehend} />
              : null
            }
          </Panel>

          <Panel collapsible header='2. Eigenschaften laden' eventKey={2} onClick={this.onClickPanel.bind(this, 2)}>
            {activePanel === 2 ?
              <Panel2
                pcsToImport={pcsToImport}
                validPcsToImport={validPcsToImport}
                onChangeFile={this.onChangeFile} />
              : null
            }
          </Panel>

          <Panel collapsible header="3. ID's identifizieren" eventKey={3} onClick={this.onClickPanel.bind(this, 3)}>
            {pcsToImport.length > 0 ? <InputImportFields idsImportIdField={idsImportIdField} pcsToImport={pcsToImport} onChangeImportId={this.onChangeImportId} /> : null}
            <InputAeId idsAeIdField={idsAeIdField} onChangeAeId={this.onChangeAeId} />
            {idsImportIdField && idsAeIdField ? <AlertIdsAnalysisResult idsImportIdField={idsImportIdField} idsAeIdField={idsAeIdField} pcsToImport={pcsToImport} idsNumberOfRecordsWithIdValue={idsNumberOfRecordsWithIdValue} idsDuplicate={idsDuplicate} idsNumberImportable={idsNumberImportable} idsNotImportable={idsNotImportable} idsAnalysisComplete={idsAnalysisComplete} idsNotANumber={idsNotANumber} /> : null}
          </Panel>

          <Panel collapsible header='4. importieren' eventKey={4} onClick={this.onClickPanel.bind(this, 4)}>
            {panel3Done ? <Button className='btn-primary' onClick={this.onClickImportieren}><Glyphicon glyph='download-alt'/> Eigenschaftensammlung "{name}" importieren</Button> : null }
            {showDeletePcInstancesButton ? <ButtonDeletePcInstances name={name} pcsRemoved={pcsRemoved} deletingPcInstancesProgress={deletingPcInstancesProgress} onClickRemovePcInstances={this.onClickRemovePcInstances} /> : null}
            {showProgressbarImport ? <ProgressbarImport importingProgress={importingProgress} /> : null}
            {showAlertFirst5Imported ? <AlertFirst5Imported idsOfAeObjects={idsOfAeObjects} idsNotImportable={idsNotImportable} replicatingToAe={replicatingToAe} replicatingToAeTime={replicatingToAeTime} /> : null}
            {deletingPcInstancesProgress !== null ? <ProgressBar bsStyle='success' now={deletingPcInstancesProgress} label={`${deletingPcInstancesProgress}% entfernt`} /> : null}
            {deletingPcInstancesProgress === 100 ? <AlertFirst5Deleted idsOfAeObjects={idsOfAeObjects} nameBestehend={name} replicatingToAe={replicatingToAe} replicatingToAeTime={replicatingToAeTime} /> : null}
          </Panel>

        </Accordion>
      </div>
    )
  }
})
