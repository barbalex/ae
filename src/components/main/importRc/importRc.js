'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Accordion, Panel } from 'react-bootstrap'
import { difference, get, map, omitBy, values } from 'lodash'
import { ListenerMixin } from 'reflux'
import getObjectsFromFile from './getObjectsFromFile.js'
import isValidUrl from '../../../modules/isValidUrl.js'
import getSuccessTypeFromAnalysis from './getSuccessTypeFromAnalysis.js'
import getGuidsById from '../../../modules/getGuidsById.js'
import Panel1 from './panel1/panel1.js'
import Panel2 from './panel2/panel2.js'
import Panel3 from './panel3/panel3.js'
import Panel4 from './panel4/panel4.js'
import isUserServerAdmin from '../../../modules/isUserServerAdmin.js'
import isUserOrgAdmin from '../../../modules/isUserOrgAdmin.js'
import isUserEsWriter from '../../../modules/isUserEsWriter.js'

export default React.createClass({
  displayName: 'ImportRelationCollections',

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
    validOrgMitSchreibrecht: React.PropTypes.bool,
    validUrsprungsBs: React.PropTypes.bool,
    validRcsToImport: React.PropTypes.bool,
    replicatingToAe: React.PropTypes.string,
    replicatingToAeTime: React.PropTypes.string,
    offlineIndexes: React.PropTypes.bool,
    organizations: React.PropTypes.array,
    userIsEsWriterInOrgs: React.PropTypes.array
  },

  mixins: [ListenerMixin],

  // nameBestehend ... nameUrsprungsBs: input fields
  // idsAnalysisComplete ... idsNotANumber: for analysing import file and id fields
  // panel1Done, panel2Done, panel3Done: to guide inputting
  // validXxx: to check validity of these fields
  getInitialState() {
    return {
      nameBestehend: null,
      name: null,
      beschreibung: null,
      datenstand: null,
      nutzungsbedingungen: null,
      link: null,
      orgMitSchreibrecht: null,
      importiertVon: this.props.email,
      zusammenfassend: null,
      nameUrsprungsBs: null,
      bsBearbeitenErlaubt: true,
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
      validOrgMitSchreibrecht: true,
      validUrsprungsBs: true,
      validRcsToImport: true
    }
  },

  componentDidMount() {
    this.listenTo(app.objectsRcsStore, this.onChangeObjectsRcsStore)
    // show login of not logged in
    const { offlineIndexes, email } = this.props
    if (!email) {
      const logIn = true
      app.Actions.login({ logIn })
    }
    // get relation collections
    app.Actions.queryRelationCollections(offlineIndexes)
    app.Actions.getOrganizations(email)
  },

  onChangeObjectsRcsStore(state) {
    this.setState(state)
  },

  onChangeNameBestehend(nameBestehend) {
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
        .catch((error) => app.Actions.showError({ msg: error }))
    } else {
      this.setState({ nameBestehend: null })
    }
  },

  onChangeOrgMitSchreibrecht(event) {
    const orgMitSchreibrecht = event.target.value
    this.setState({ orgMitSchreibrecht })
  },

  onChangeName(name) {
    this.setState({ name })
  },

  onBlurName(name) {
    this.isEditingRcAllowed(name)
  },

  onChangeBeschreibung(beschreibung) {
    this.setState({ beschreibung })
  },

  onChangeDatenstand(datenstand) {
    this.setState({ datenstand })
  },

  onChangeNutzungsbedingungen(nutzungsbedingungen) {
    this.setState({ nutzungsbedingungen })
  },

  onChangeLink(link) {
    this.setState({ link })
  },

  onBlurLink() {
    this.isLinkValid()
  },

  onChangeZusammenfassend(zusammenfassend) {
    const nameUrsprungsBs = null
    this.setState({ zusammenfassend, nameUrsprungsBs })
  },

  onChangeNameUrsprungsBs(nameUrsprungsBs) {
    this.setState({ nameUrsprungsBs })
    this.isUrsprungsBsValid(nameUrsprungsBs)
  },

  onChangeFile(event) {
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
          this.isRcsToImportValid()
        })
        .catch((error) => app.Actions.showError({ title: 'Fehler beim Lesen der Datei:', msg: error }))
    }
  },

  onChangeAeId(idsAeIdField) {
    const idsAnalysisComplete = false
    let state = { idsAeIdField, idsAnalysisComplete }
    state = Object.assign(state, this.stateFollowingPanel3Reset())
    this.setState(state, this.onChangeId)
  },

  onChangeImportId(idsImportIdField) {
    const idsAnalysisComplete = false
    let state = { idsImportIdField, idsAnalysisComplete }
    state = Object.assign(state, this.stateFollowingPanel3Reset())
    this.setState(state, this.onChangeId)
  },

  onChangeId() {
    const { idsAeIdField, idsImportIdField, rcsToImport } = this.state
    const { offlineIndexes } = this.props

    if (idsAeIdField && idsImportIdField) {
      // start analysis
      // make sure data in idsImportIdField is a number, if idsAeIdField is not a GUID
      const idsNotANumber = []
      if (idsAeIdField !== 'GUID') {
        // the id field in the import data should be a number
        rcsToImport.forEach((rc) => {
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
      const idsWithoutPartner = []
      const rPartnerIdsToImport = []
      const rPartnerIdsImportable = []

      rcsToImport.forEach((rc) => {
        // Beziehungspartner in import data can be a single guid or a list of guids split by ', '
        // in ae it needs to be an array of objects
        const rPartnerIds = rc.Beziehungspartner.split(', ')
        // analyse
        if (rPartnerIds.length === 0) idsWithoutPartner.push(rc[idsImportIdField])
        rPartnerIdsToImport.push(rPartnerIds)
        // build rc.Beziehungspartner
        const rPartners = []
        // get an array of all partner objects
        Promise.all(rPartnerIds.map((id) =>
          app.objectStore.getObject(id)
        ))
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
        // ignore error - can simply be that no object was found for id
        .catch(() => {})
      })
      const rcPartnerState = { idsWithoutPartner, rPartnerIdsToImport, rPartnerIdsImportable }

      const ids = map(rcsToImport, idsImportIdField)
      // if ids should be numbers but some are not, an error can occur when fetching from the database
      // so dont fetch
      const idsAnalysisComplete = true
      if (idsNotANumber.length > 0) {
        const state = Object.assign(rcPartnerState, { idsAnalysisComplete, idsNotANumber })
        return this.setState(state)
      }
      getGuidsById(idsAeIdField, ids, offlineIndexes)
        .then((idGuidObject) => {
          // now add guids to rcsToImport
          rcsToImport.forEach((rc) => {
            const importId = rc[idsImportIdField]
            rc._id = idGuidObject[importId]
          })
          let idsToImportWithDuplicates = map(rcsToImport, idsImportIdField)
          // remove emtpy values
          idsToImportWithDuplicates = idsToImportWithDuplicates.filter((id) => !!id)
          const idsNumberOfRecordsWithIdValue = idsToImportWithDuplicates.length
          const idsOfAeObjects = values(idGuidObject)
          const idGuidImportable = omitBy(idGuidObject, (guid, id) => !guid)
          const idsImportable = Object.keys(idGuidImportable)
          // extracting from keys converts numbers to strings! Convert back
          idsImportable.forEach((id, index) => {
            if (!isNaN(id)) idsImportable[index] = parseInt(id, 10)
          })

          let idsNumberImportable = 0
          idsToImportWithDuplicates.forEach((id) => {
            if (idsImportable.includes(id)) idsNumberImportable++
          })
          // get ids not fetched
          const idsNotImportable = difference(idsToImportWithDuplicates, idsImportable)
          // finished? render...
          const relationState = {
            rcsToImport,
            idsNumberImportable,
            idsNotImportable,
            idsAnalysisComplete,
            idsOfAeObjects,
            idsNumberOfRecordsWithIdValue,
            idsNotANumber
          }
          const state = Object.assign(rcPartnerState, relationState)
          this.setState(state)
        })
        .catch((error) => app.Actions.showError({ msg: error }))
    }
  },

  onClickImportieren() {
    const {
      rcsToImport,
      idsImportIdField,
      name,
      beschreibung,
      datenstand,
      nutzungsbedingungen,
      link,
      importiertVon,
      orgMitSchreibrecht,
      zusammenfassend,
      nameUrsprungsBs
    } = this.state
    app.Actions.importRcs({
      rcsToImport,
      idsImportIdField,
      name,
      beschreibung,
      datenstand,
      nutzungsbedingungen,
      link,
      importiertVon,
      orgMitSchreibrecht,
      zusammenfassend,
      nameUrsprungsBs
    })
  },

  onClickDeleteRc() {
    const { name } = this.state
    const { offlineIndexes } = this.props
    // first remove progressbar and alert from last import
    const importingProgress = null
    const rcsRemoved = false
    const deletingRcProgress = 0
    this.setState({
      importingProgress,
      rcsRemoved,
      deletingRcProgress
    }, () => app.Actions.deleteRcByName(name, offlineIndexes))
  },

  onClickRemoveRcInstances() {
    const { name, idsOfAeObjects } = this.state
    // first remove progressbar and alert from last import
    const importingProgress = null
    const rcsRemoved = false
    this.setState({ importingProgress, rcsRemoved }, () => app.Actions.deleteRcInstances(name, idsOfAeObjects))
  },

  onClickPanel(number, event) {
    const { activePanel } = this.state
    const { allGroupsLoaded } = this.props

    // make sure the heading was clicked
    const parent = event.target.parentElement
    const headingWasClicked = parent.className.includes('panel-title') || parent.className.includes('panel-heading')
    if (headingWasClicked) {
      // always close panel if it is open
      if (activePanel === number) return this.setState({ activePanel: '' })

      switch (number) {
        case 1:
          this.setState({ activePanel: 1 })
          break
        case 2: {
          if (!allGroupsLoaded) this.setState({ ultimatelyAlertLoadAllGroups: true })
          const isPanel1Done = this.isPanel1Done()
          if (isPanel1Done && allGroupsLoaded) this.setState({ activePanel: 2 })
          break
        }
        case 3: {
          const isPanel2Done = this.isPanel2Done()
          if (isPanel2Done) this.setState({ activePanel: 3 })
          break
        }
        case 4: {
          const isPanel3Done = this.isPanel3Done()
          if (isPanel3Done) this.setState({ activePanel: 4 })
          break
        }
        default:
          this.setState({ activePanel: 1 })
      }
    } else {
      event.stopPropagation()
    }
  },

  stateFollowingPanel1Reset() {
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

  stateFollowingPanel2Reset() {
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

  buildPartnerFromObject(object) {
    const standardtaxonomie = object.Taxonomien.find((taxonomy) => taxonomy.Standardtaxonomie)
    const partner = {}
    partner.Gruppe = object.Gruppe
    if (object.Gruppe === 'Lebensräume') {
      partner.Taxonomie = get(standardtaxonomie, 'Name')
      const label = get(standardtaxonomie, 'Eigenschaften.Label')
      const einheit = get(standardtaxonomie, 'Eigenschaften.Einheit')
      if (label) {
        partner.Name = `${label}: ${einheit}`
      } else {
        partner.Name = einheit
      }
    } else {
      partner.Name = standardtaxonomie.Eigenschaften['Artname vollständig']
    }
    partner.GUID = object._id
    return partner
  },

  stateFollowingPanel3Reset() {
    return {
      importingProgress: null,
      deletingRcInstancesProgress: null,
      deletingRcProgress: null
    }
  },

  isPanel1Done() {
    const { email } = this.props
    // run all validation
    const validName = this.isNameValid()
    const validBeschreibung = this.isBeschreibungValid()
    const validDatenstand = this.isDatenstandValid()
    const validNutzungsbedingungen = this.isNutzungsbedingungenValid()
    const validLink = this.isLinkValid()
    const validUrsprungsBs = this.isUrsprungsBsValid()
    const validOrgMitSchreibrecht = this.validOrgMitSchreibrecht()
    const validEmail = !!email
    // check if panel 1 is done
    const panel1Done = (
      validName &&
      validBeschreibung &&
      validDatenstand &&
      validNutzungsbedingungen &&
      validLink &&
      validUrsprungsBs &&
      validOrgMitSchreibrecht &&
      validEmail
    )
    let state = { panel1Done }
    if (!panel1Done) state = Object.assign(state, { activePanel: 1 })
    this.setState(state)
    return panel1Done
  },

  isPanel2Done() {
    const validRcsToImport = this.isRcsToImportValid()
    const panel1Done = this.isPanel1Done()
    const panel2Done = panel1Done && validRcsToImport
    let state = { panel2Done }
    if (panel1Done && !panel2Done) state = Object.assign(state, { activePanel: 2 })
    this.setState(state)
    return panel2Done
  },

  isPanel3Done() {
    const {
      idsOfAeObjects,
      rcsToImport,
      idsNumberImportable,
      idsNotImportable,
      idsNotANumber
    } = this.state
    const isPanel2Done = this.isPanel2Done()
    const variablesToPass = {
      rcsToImport,
      idsNumberImportable,
      idsNotImportable,
      idsNotANumber
    }
    const idsAnalysisResultType = getSuccessTypeFromAnalysis(variablesToPass)
    const panel3Done = idsAnalysisResultType !== 'danger' && idsOfAeObjects.length > 0
    let state = { panel3Done }
    if (isPanel2Done && !panel3Done) state = Object.assign(state, { activePanel: 3 })
    this.setState(state)
    return panel3Done
  },

  isEditingRcAllowed(name) {
    const { userRoles, rcs } = this.props
    // set editing allowed to true
    // reason: close alert if it is still shown from last select
    this.setState({ bsBearbeitenErlaubt: true })
    // check if this name exists
    // if so and it is not combining: check if it was imported by the user
    const sameRc = rcs.find((rc) => rc.name === name)
    const organization = sameRc ? sameRc.organization : null
    const bsBearbeitenErlaubt = (
      !sameRc ||
      (
        sameRc &&
        (
          sameRc.combining ||
          isUserServerAdmin(userRoles) ||
          isUserOrgAdmin(userRoles, organization) ||
          isUserEsWriter(userRoles, organization)
        )
      )
    )
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

  isNameValid() {
    const validName = !!this.state.name
    this.setState({ validName })
    return validName
  },

  isBeschreibungValid() {
    const validBeschreibung = !!this.state.beschreibung
    this.setState({ validBeschreibung })
    return validBeschreibung
  },

  isDatenstandValid() {
    const validDatenstand = !!this.state.datenstand
    this.setState({ validDatenstand })
    return validDatenstand
  },

  isNutzungsbedingungenValid() {
    const validNutzungsbedingungen = !!this.state.nutzungsbedingungen
    this.setState({ validNutzungsbedingungen })
    return validNutzungsbedingungen
  },

  isLinkValid() {
    const link = this.state.link
    const validLink = !link || isValidUrl(link)
    this.setState({ validLink })
    return validLink
  },

  validOrgMitSchreibrecht() {
    const orgMitSchreibrecht = this.state.orgMitSchreibrecht
    const validOrgMitSchreibrecht = !!orgMitSchreibrecht
    this.setState({ validOrgMitSchreibrecht })
    return validOrgMitSchreibrecht
  },

  isUrsprungsBsValid(nameUrsprungsBs) {
    /**
     * when nameUrsprungsBs is passed back from child component,
     * this function is called right after setting state of nameUrsprungsBs
     * so state would not yet be updated! > needs to be passed directly
     */
    const { zusammenfassend } = this.state
    if (!nameUrsprungsBs) nameUrsprungsBs = this.state.nameUrsprungsBs
    let validUrsprungsBs = true
    if (zusammenfassend && !nameUrsprungsBs) validUrsprungsBs = false
    this.setState({ validUrsprungsBs })
    return validUrsprungsBs
  },

  isRcsToImportValid() {
    const validRcsToImport = this.state.rcsToImport.length > 0
    this.setState({ validRcsToImport })
    return validRcsToImport
  },

  render() {
    const {
      nameBestehend,
      name,
      beschreibung,
      datenstand,
      nutzungsbedingungen,
      link,
      importiertVon,
      zusammenfassend,
      nameUrsprungsBs,
      bsBearbeitenErlaubt,
      rcsToImport,
      rcsRemoved,
      idsOfAeObjects,
      validName,
      validBeschreibung,
      validDatenstand,
      validNutzungsbedingungen,
      validLink,
      validOrgMitSchreibrecht,
      validUrsprungsBs,
      validRcsToImport,
      activePanel,
      idsAeIdField,
      idsImportIdField,
      idsNumberOfRecordsWithIdValue,
      idsNumberImportable,
      idsNotImportable,
      idsNotANumber,
      idsAnalysisComplete,
      ultimatelyAlertLoadAllGroups,
      panel3Done,
      importingProgress,
      deletingRcInstancesProgress,
      deletingRcProgress,
      idsWithoutPartner,
      rPartnerIdsToImport,
      rPartnerIdsImportable,
      orgMitSchreibrecht
    } = this.state
    const {
      groupsLoadedOrLoading,
      email,
      userRoles,
      rcs,
      allGroupsLoaded,
      groupsLoadingObjects,
      replicatingToAe,
      replicatingToAeTime,
      organizations,
      userIsEsWriterInOrgs
    } = this.props

    return (
      <div
        id="importieren"
        className="formContent"
      >
        <h4>
          Beziehungen importieren
        </h4>
        <Accordion
          activeKey={activePanel}
        >
          <Panel
            collapsible
            header="1. Beziehungssammlung beschreiben"
            eventKey={1}
            onClick={this.onClickPanel.bind(this, 1)}
          >
            {
              activePanel === 1 &&
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
                orgMitSchreibrecht={orgMitSchreibrecht}
                importiertVon={importiertVon}
                zusammenfassend={zusammenfassend}
                nameUrsprungsBs={nameUrsprungsBs}
                email={email}
                userRoles={userRoles}
                rcs={rcs}
                idsOfAeObjects={idsOfAeObjects}
                deletingRcProgress={deletingRcProgress}
                bsBearbeitenErlaubt={bsBearbeitenErlaubt}
                ultimatelyAlertLoadAllGroups={ultimatelyAlertLoadAllGroups}
                validName={validName}
                validBeschreibung={validBeschreibung}
                validDatenstand={validDatenstand}
                validNutzungsbedingungen={validNutzungsbedingungen}
                validLink={validLink}
                validOrgMitSchreibrecht={validOrgMitSchreibrecht}
                validUrsprungsBs={validUrsprungsBs}
                replicatingToAe={replicatingToAe}
                replicatingToAeTime={replicatingToAeTime}
                organizations={organizations}
                onClickDeleteRc={this.onClickDeleteRc}
                isUrsprungsBsValid={this.isUrsprungsBsValid}
                onChangeNameBestehend={this.onChangeNameBestehend}
                onChangeOrgMitSchreibrecht={this.onChangeOrgMitSchreibrecht}
                onChangeNameUrsprungsBs={this.onChangeNameUrsprungsBs}
                onChangeZusammenfassend={this.onChangeZusammenfassend}
                onChangeLink={this.onChangeLink}
                onChangeNutzungsbedingungen={this.onChangeNutzungsbedingungen}
                onChangeDatenstand={this.onChangeDatenstand}
                onChangeBeschreibung={this.onChangeBeschreibung}
                onChangeName={this.onChangeName}
                isLinkValid={this.isLinkValid}
                isEditingRcAllowed={this.isEditingRcAllowed}
                userIsEsWriterInOrgs={userIsEsWriterInOrgs}
              />
            }
          </Panel>

          <Panel
            collapsible
            header="2. Beziehungen laden"
            eventKey={2}
            onClick={this.onClickPanel.bind(this, 2)}
          >
            {
              activePanel === 2 &&
              <Panel2
                rcsToImport={rcsToImport}
                validRcsToImport={validRcsToImport}
                onChangeFile={this.onChangeFile}
              />
            }
          </Panel>

          <Panel
            collapsible
            header="3. ID's identifizieren"
            eventKey={3}
            onClick={this.onClickPanel.bind(this, 3)}
          >
            {
              activePanel === 3 &&
              <Panel3
                rcsToImport={rcsToImport}
                idsImportIdField={idsImportIdField}
                idsAeIdField={idsAeIdField}
                idsAnalysisComplete={idsAnalysisComplete}
                idsNumberOfRecordsWithIdValue={idsNumberOfRecordsWithIdValue}
                idsNumberImportable={idsNumberImportable}
                idsNotImportable={idsNotImportable}
                idsNotANumber={idsNotANumber}
                idsWithoutPartner={idsWithoutPartner}
                rPartnerIdsToImport={rPartnerIdsToImport}
                rPartnerIdsImportable={rPartnerIdsImportable}
                onChangeAeId={this.onChangeAeId}
                onChangeImportId={this.onChangeImportId}
              />
            }
          </Panel>

          <Panel
            collapsible
            header="4. importieren"
            eventKey={4}
            onClick={this.onClickPanel.bind(this, 4)}
          >
            {
              activePanel === 4 &&
              <Panel4
                name={name}
                rcsRemoved={rcsRemoved}
                idsOfAeObjects={idsOfAeObjects}
                idsNotImportable={idsNotImportable}
                importingProgress={importingProgress}
                deletingRcInstancesProgress={deletingRcInstancesProgress}
                panel3Done={panel3Done}
                replicatingToAe={replicatingToAe}
                replicatingToAeTime={replicatingToAeTime}
                onClickImportieren={this.onClickImportieren}
                onClickRemoveRcInstances={this.onClickRemoveRcInstances}
              />
            }
          </Panel>

        </Accordion>
      </div>
    )
  }
})
