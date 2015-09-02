'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Accordion, Panel, Well, Input, Alert, Button } from 'react-bootstrap'
import _ from 'lodash'
import { ListenerMixin } from 'reflux'
import WellAutorenrechte from './wellAutorenrechte.js'
import WellTechnAnforderungenAnDatei from './wellTechnAnforderungenAnDatei.js'
import WellAnforderungenAnCsv from './wellAnforderungenAnCsv.js'
import WellAnforderungenInhaltlich from './wellAnforderungenInhaltlich.js'
import InputNameBestehend from './inputNameBestehend.js'
import InputName from './inputName.js'
import InputBeschreibung from './inputBeschreibung.js'
import InputDatenstand from './inputDatenstand.js'
import InputNutzungsbedingungen from './inputNutzungsbedingungen.js'
import InputLink from './inputLink.js'
import InputZusammenfassend from './inputZusammenfassend.js'
import InputUrsprungsEs from './inputUrsprungsEs.js'
import AlertIdsAnalysisResult from './alertIdsAnalysisResult.js'
import TablePreview from './tablePreview.js'
import InputImportFields from './inputImportFields.js'
import InputAeId from './inputAeId.js'
import getObjectsFromFile from './getObjectsFromFile.js'
import isValidUrl from '../../../modules/isValidUrl.js'
import getSuccessTypeFromAnalysis from './getSuccessTypeFromAnalysis.js'
import getItemsById from '../../../modules/getItemsById.js'

export default React.createClass({
  displayName: 'ImportPropertyCollections',

  mixins: [ListenerMixin],

  propTypes: {
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
    objectsToImportPcsInTo: React.PropTypes.array,
    idsImportIdField: React.PropTypes.string,
    idsAeIdField: React.PropTypes.string,
    idsAnalysisComplete: React.PropTypes.bool,
    idsNumberOfRecordsWithIdValue: React.PropTypes.number,
    idsDuplicate: React.PropTypes.array,
    idsNumberImportable: React.PropTypes.number,
    idsNotImportable: React.PropTypes.array,
    idsNotANumber: React.PropTypes.array,
    esBearbeitenErlaubt: React.PropTypes.bool,
    panel1Done: React.PropTypes.bool,
    panel2Done: React.PropTypes.bool,
    panel3Done: React.PropTypes.bool,
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
      objectsToImportPcsInTo: [],
      idsImportIdField: null,
      idsAeIdField: null,
      idsAnalysisComplete: false,
      idsNumberOfRecordsWithIdValue: 0,
      idsDuplicate: [],
      idsNumberImportable: 0,
      idsNotImportable: [],
      idsNotANumber: [],
      panel1Done: false,
      panel2Done: false,
      panel3Done: false,
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
    this.listenTo(app.objectStore, this.onObjectStoreChange)
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
    // email has empty values. Set default
    pcs.forEach(function (pc) {
      pc.importedBy = pc.importedBy || 'alex@gabriel-software.ch'
    })
    this.setState({ pcs: pcs })
  },

  onObjectStoreChange () {
    // reload property collections
    app.Actions.queryPropertyCollections()
  },

  onChangeNameBestehend (nameBestehend) {
    const that = this
    const editingPcIsAllowed = this.isEditingPcAllowed(nameBestehend)
    app.propertyCollectionsStore.getPcByName(nameBestehend)
      .then(function (pc) {
        console.log('importPc.js, onChangeNameBestehend: pc', pc)
        // only go on if pc exists (prevent error)
        if (pc) {
          const beschreibung = pc.fields.Beschreibung
          const datenstand = pc.fields.Datenstand
          const nutzungsbedingungen = pc.fields.Nutzungsbedingungen
          const link = pc.fields.Link
          const zusammenfassend = pc.combining
          that.setState({
            beschreibung: beschreibung,
            datenstand: datenstand,
            nutzungsbedingungen: nutzungsbedingungen,
            link: link,
            zusammenfassend: zusammenfassend
          })
          if (editingPcIsAllowed) {
            that.setState({
              nameBestehend: nameBestehend,
              name: nameBestehend
            })
          }
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  },

  onChangeName (name) {
    this.setState({ name: name })
  },

  onBlurName (name) {
    this.isEditingPcAllowed(name)
  },

  onChangeBeschreibung (beschreibung) {
    this.setState({ beschreibung: beschreibung })
  },

  onChangeDatenstand (datenstand) {
    this.setState({ datenstand: datenstand })
  },

  onChangeNutzungsbedingungen (nutzungsbedingungen) {
    this.setState({ nutzungsbedingungen: nutzungsbedingungen })
  },

  onChangeLink (link) {
    this.setState({ link: link })
  },

  onBlurLink () {
    this.validLink()
  },

  onChangeZusammenfassend (zusammenfassend) {
    this.setState({
      zusammenfassend: zusammenfassend,
      nameUrsprungsEs: null
    })
  },

  onChangeNameUrsprungsEs (nameUrsprungsEs) {
    this.setState({
      nameUrsprungsEs: nameUrsprungsEs
    })
    this.validUrsprungsEs(nameUrsprungsEs)
  },

  onChangePcFile (event) {
    const that = this
    // always empty pcsToImport first
    // otherwise weird things happen
    this.setState({
      pcsToImport: []
    })
    if (event.target.files[0] !== undefined) {
      const file = event.target.files[0]
      getObjectsFromFile(file)
        .then(function (pcsToImport) {
          that.setState({
            pcsToImport: pcsToImport
          })
          that.validPcsToImport()
        })
        .catch(function (error) {
          console.log('error reading file:', error)
        })
    }
  },

  onChangeAeId (idsAeIdField) {
    const { idsImportIdField } = this.state
    this.setState({ idsAeIdField: idsAeIdField })
    this.onChangeId(idsAeIdField, idsImportIdField)
  },

  onChangeImportId (idsImportIdField) {
    const { pcsToImport, idsAeIdField } = this.state
    let idsNotANumber = []
    // make sure data in idsImportIdField is a number, if it is not a GUID
    if (idsImportIdField !== 'GUID') {
      pcsToImport.forEach(function (pc, index) {
        if (!isNaN(pc[idsImportIdField])) {
          pc[idsImportIdField] = parseInt(pc[idsImportIdField], 10)
        } else {
          idsNotANumber.push(pc[idsImportIdField])
        }
      })
      this.setState({ idsNotANumber: idsNotANumber })
    }
    this.setState({ idsImportIdField: idsImportIdField })
    this.onChangeId(idsAeIdField, idsImportIdField, idsNotANumber)
  },

  // need to get values directly because state has not been updated yet
  onChangeId (idsAeIdField, idsImportIdField, idsNotANumber) {
    const { pcsToImport } = this.state
    const that = this

    if (idsAeIdField && idsImportIdField) {
      // start analysis
      const ids = _.pluck(pcsToImport, idsImportIdField)
      let idsToImportWithDuplicates = _.pluck(pcsToImport, idsImportIdField)
      idsToImportWithDuplicates = _.filter(idsToImportWithDuplicates, function (id) {
        return !!id
      })
      const idsToImport = _.unique(idsToImportWithDuplicates)
      const idsNumberOfRecordsWithIdValue = idsToImportWithDuplicates.length
      const idsDuplicate = _.difference(idsToImportWithDuplicates, idsToImport)
      this.setState({
        idsNumberOfRecordsWithIdValue: idsNumberOfRecordsWithIdValue,
        idsDuplicate: idsDuplicate
      })
      getItemsById(idsAeIdField, ids)
        .then(function (objectsToImportPcsInTo) {
          // go on with analysis
          const idAttribute = idsAeIdField === 'GUID' ? '_id' : 'Taxonomien[0].Eigenschaften["Taxonomie ID"]'
          const idsFetched = _.pluck(objectsToImportPcsInTo, idAttribute)
          const idsImportable = _.intersection(idsToImport, idsFetched)
          const idsNumberImportable = idsImportable.length
          const idsNotImportable = _.difference(idsToImport, idsFetched)

          // finished? render...
          that.setState({
            idsNumberImportable: idsNumberImportable,
            idsNotImportable: idsNotImportable,
            idsAnalysisComplete: true,
            objectsToImportPcsInTo: objectsToImportPcsInTo
          })
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  },

  onClickPanel (number, event) {
    let { activePanel } = this.state

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
      const isPanel1Done = this.isPanel1Done()
      if (isPanel1Done) this.setState({ activePanel: 2 })
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
    const isPanel1Done = validName && validBeschreibung && validDatenstand && validNutzungsbedingungen && validLink && validUrsprungsEs && validEmail
    this.setState({ panel1Done: isPanel1Done })
    if (!isPanel1Done) this.setState({ activePanel: 1 })
    return isPanel1Done
  },

  isPanel2Done () {
    const validPcsToImport = this.validPcsToImport()
    const isPanel1Done = this.isPanel1Done()
    const isPanel2Done = isPanel1Done && validPcsToImport
    this.setState({ panel2Done: isPanel2Done })
    if (isPanel1Done && !isPanel2Done) this.setState({ activePanel: 2 })
    return isPanel2Done
  },

  isPanel3Done () {
    const { objectsToImportPcsInTo, pcsToImport, idsNumberImportable, idsNotImportable, idsNotANumber, idsDuplicate } = this.state
    const isPanel2Done = this.isPanel2Done()
    const variablesToPass = {
      pcsToImport: pcsToImport,
      idsNumberImportable: idsNumberImportable,
      idsNotImportable: idsNotImportable,
      idsNotANumber: idsNotANumber,
      idsDuplicate: idsDuplicate
    }
    const idsAnalysisResultType = getSuccessTypeFromAnalysis(variablesToPass)
    const isPanel3Done = idsAnalysisResultType !== 'danger' && objectsToImportPcsInTo.length > 0
    this.setState({ panel3Done: isPanel3Done })
    if (isPanel2Done && !isPanel3Done) this.setState({ activePanel: 3 })
    return isPanel3Done
  },

  isEditingPcAllowed (name) {
    const { pcs } = this.state
    const { email } = this.props
    const that = this
    // set editing allowed to true
    // reason: close alert if it is still shown from last select
    this.setState({
      esBearbeitenErlaubt: true
    })
    // check if this name exists
    // if so and it is not combining: check if it was imported by the user
    const samePc = _.find(pcs, function (pc) {
      return pc.name === name
    })
    const esBearbeitenErlaubt = !samePc || (samePc && (samePc.combining || samePc.importedBy === email))
    if (!esBearbeitenErlaubt) {
      this.setState({
        esBearbeitenErlaubt: false
      })
      // delete text after a second
      setTimeout(function () {
        that.setState({
          nameBestehend: null,
          name: null
        })
      }, 1000)
      // close alert after 8 seconds
      setTimeout(function () {
        that.setState({
          esBearbeitenErlaubt: true
        })
      }, 8000)
    }
    return esBearbeitenErlaubt
  },

  validName () {
    const validName = !!this.state.name
    this.setState({ validName: validName })
    return validName
  },

  validBeschreibung () {
    const validBeschreibung = !!this.state.beschreibung
    this.setState({ validBeschreibung: validBeschreibung })
    return validBeschreibung
  },

  validDatenstand () {
    const validDatenstand = !!this.state.datenstand
    this.setState({ validDatenstand: validDatenstand })
    return validDatenstand
  },

  validNutzungsbedingungen () {
    const validNutzungsbedingungen = !!this.state.nutzungsbedingungen
    this.setState({ validNutzungsbedingungen: validNutzungsbedingungen })
    return validNutzungsbedingungen
  },

  validLink () {
    const link = this.state.link
    const validLink = !link || isValidUrl(link)
    this.setState({ validLink: validLink })
    return validLink
  },

  validUrsprungsEs (nameUrsprungsEs) {
    // when nameUrsprungsEs is passed back from child component, this function is called right after setting state of nameUrsprungsEs
    // so state would not yet be updated! > needs to be passed directly
    const { zusammenfassend } = this.state
    if (!nameUrsprungsEs) nameUrsprungsEs = this.state.nameUrsprungsEs
    let validUrsprungsEs = true
    if (zusammenfassend && !nameUrsprungsEs) validUrsprungsEs = false
    this.setState({
      validUrsprungsEs: validUrsprungsEs
    })
    return validUrsprungsEs
  },

  validPcsToImport () {
    const validPcsToImport = this.state.pcsToImport.length > 0
    this.setState({ validPcsToImport: validPcsToImport })
    return validPcsToImport
  },

  alertEditingPcDisallowed () {
    return (
      <Alert className='feld' bsStyle='danger'>
        Sie können nur Eigenschaftensammlungen verändern, die Sie selber importiert haben. Ausnahme: zusammenfassende.<br/>
        Bitte wählen Sie einen anderen Namen.
      </Alert>
    )
  },

  render () {
    const { nameBestehend, name, beschreibung, datenstand, nutzungsbedingungen, link, importiertVon, zusammenfassend, nameUrsprungsEs, esBearbeitenErlaubt, pcsToImport, validName, validBeschreibung, validDatenstand, validNutzungsbedingungen, validLink, validUrsprungsEs, validPcsToImport, activePanel, idsAeIdField, idsImportIdField, pcs, idsNumberOfRecordsWithIdValue, idsDuplicate, idsNumberImportable, idsNotImportable, idsNotANumber, idsAnalysisComplete } = this.state
    const { email } = this.props

    return (
      <div>
        <h4>Eigenschaften importieren</h4>
        <Accordion activeKey={activePanel}>
          <Panel collapsible header='1. Eigenschaftensammlung beschreiben' eventKey={1} onClick={this.onClickPanel.bind(this, 1)}>
            <Well className='well-sm'><a href='//youtu.be/nqd-v6YxkOY' target='_blank'><b>Auf Youtube sehen, wie es geht</b></a></Well>
            <WellAutorenrechte />

            <InputNameBestehend nameBestehend={nameBestehend} beschreibung={beschreibung} datenstand={datenstand} nutzungsbedingungen={nutzungsbedingungen} link={link} zusammenfassend={zusammenfassend} email={email} pcs={pcs} onChangeNameBestehend={this.onChangeNameBestehend} />

            <div className='controls feld'>
              <button type='button' className='btn btn-primary btn-default' style={{'display': 'none', 'marginBottom': 6 + 'px'}}>Gewählte Eigenschaftensammlung und alle ihre Eigenschaften aus allen Arten und/oder Lebensräumen entfernen</button>
            </div>

            <hr />

            <InputName name={name} validName={validName} onChangeName={this.onChangeName} onBlurName={this.onBlurName} />
            {esBearbeitenErlaubt ? null : this.alertEditingPcDisallowed()}
            <InputBeschreibung beschreibung={beschreibung} validBeschreibung={validBeschreibung} onChangeBeschreibung={this.onChangeBeschreibung} />
            <InputDatenstand datenstand={datenstand} validDatenstand={validDatenstand} onChangeDatenstand={this.onChangeDatenstand} />
            <InputNutzungsbedingungen nutzungsbedingungen={nutzungsbedingungen} validNutzungsbedingungen={validNutzungsbedingungen} onChangeNutzungsbedingungen={this.onChangeNutzungsbedingungen} />
            <InputLink link={link} validLink={validLink} onChangeLink={this.onChangeLink} onBlurLink={this.onBlurLink} />
            <Input type='text' label={'importiert von'} className='controls input-sm' value={importiertVon} disabled />
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
            <InputImportFields idsImportIdField={idsImportIdField} pcsToImport={pcsToImport} onChangeImportId={this.onChangeImportId} />
            <InputAeId idsAeIdField={idsAeIdField} onChangeAeId={this.onChangeAeId} />
            <AlertIdsAnalysisResult idsAeIdField={idsAeIdField} idsImportIdField={idsImportIdField} pcsToImport={pcsToImport} idsNumberOfRecordsWithIdValue={idsNumberOfRecordsWithIdValue} idsDuplicate={idsDuplicate} idsNumberImportable={idsNumberImportable} idsNotImportable={idsNotImportable} idsAnalysisComplete={idsAnalysisComplete} idsNotANumber={idsNotANumber} />
          </Panel>

          <Panel collapsible header='4. Import ausführen' eventKey={4} onClick={this.onClickPanel.bind(this, 4)}>
            {/*TODO: depending on onChangeIdsAnalysisResult, show buttons*/}
            <Button className='btn-primary' id='dsImportieren' style={{'marginBottom': 6 + 'px'}}>Eigenschaftensammlung mit allen Eigenschaften importieren</Button>
            <Button className='btn-primary' id='dsEntfernen' style={{'marginBottom': 6 + 'px'}}>Eigenschaftensammlung mit allen Eigenschaften aus den in der geladenen Datei enthaltenen Arten/Lebensräumen entfernen</Button>
            <div className='progress'>
              <div id='dsImportProgressbar' className='progress-bar' role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100'><span id='dsImportProgressbarText'></span>
              </div>
            </div>
            <div id='importDsImportAusfuehrenHinweis' className='alert alert-info'>
              <Button className='close' data-dismiss='alert'>&times;</Button>
              <div id='importDsImportAusfuehrenHinweisText'></div>
            </div>
          </Panel>

        </Accordion>
      </div>
    )
  }
})
