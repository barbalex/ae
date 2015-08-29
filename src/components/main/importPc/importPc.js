'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Accordion, Panel, Well, Input, Alert, Button, OverlayTrigger, Popover } from 'react-bootstrap'
import _ from 'lodash'
import d3 from 'd3'
import { ListenerMixin } from 'reflux'
import xlsx from 'xlsx'
import WellAutorenrechte from './wellAutorenrechte.js'
import WellTechnAnforderungenAnDatei from './wellTechnAnforderungenAnDatei.js'
import WellAnforderungenAnCsv from './wellAnforderungenAnCsv.js'
import WellAnforderungenInhaltlich from './wellAnforderungenInhaltlich.js'
import TablePreview from './tablePreview.js'
import isValidUrl from '../../../modules/isValidUrl.js'

export default React.createClass({
  displayName: 'Import',

  mixins: [ListenerMixin],

  // TODO: set task props pcDescribed, pcLoaded, idsIdentified
  // and use them to guide inputting
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
    eigenschaftensammlungen: React.PropTypes.array,
    esBearbeitenErlaubt: React.PropTypes.bool,
    pcsToImport: React.PropTypes.array,
    pcDescribed: React.PropTypes.bool,
    pcLoaded: React.PropTypes.bool,
    idsIdentified: React.PropTypes.bool,
    validName: React.PropTypes.bool,
    validBeschreibung: React.PropTypes.bool,
    validDatenstand: React.PropTypes.bool,
    validNutzungsbedingungen: React.PropTypes.bool,
    validLink: React.PropTypes.bool,
    validUrsprungsEs: React.PropTypes.bool
  },

  getInitialState () {
    return {
      eigenschaftensammlungen: [],
      nameBestehend: null,
      nameUrsprungsEs: null,
      name: null,
      beschreibung: null,
      datenstand: null,
      nutzungsbedingungen: null,
      link: null,
      importiertVon: this.props.email,
      zusammenfassend: null,
      esBearbeitenErlaubt: true,
      pcsToImport: [],
      pcDescribed: false,
      pcLoaded: false,
      idsIdentified: false,
      validName: true,
      validBeschreibung: true,
      validDatenstand: true,
      validNutzungsbedingungen: true,
      validLink: true,
      validUrsprungsEs: true
    }
  },

  componentDidMount () {
    // listen to stores
    this.listenTo(app.propertyCollectionsStore, this.onChangePropertyCollectionsStore)
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
    const eigenschaftensammlungen = pcs.forEach(function (pc) {
      pc.importedBy = pc.importedBy || 'alex@gabriel-software.ch'
    })
    this.setState({
      eigenschaftensammlungen: eigenschaftensammlungen
    })
  },

  onChangePcNameExisting (event) {
    const nameBestehend = event.target.value
    const editingPcIsDisallowed = this.isEditingPcDisallowed(nameBestehend)
    const pc = app.propertyCollectionsStore.getPcByName(nameBestehend)
    const beschreibung = pc.fields.Beschreibung
    const datenstand = pc.fields.Datenstand
    const nutzungsbedingungen = pc.fields.Nutzungsbedingungen
    const link = pc.fields.Link
    const zusammenfassend = pc.combining
    this.setState({
      beschreibung: beschreibung,
      datenstand: datenstand,
      nutzungsbedingungen: nutzungsbedingungen,
      link: link,
      zusammenfassend: zusammenfassend
    })
    if (!editingPcIsDisallowed) {
      this.setState({
        nameBestehend: nameBestehend,
        name: nameBestehend
      })
    }
  },

  onChangeName (event) {
    const name = event.target.value
    this.setState({
      name: name
    })
  },

  onBlurPcName (event) {
    const name = event.target.value
    this.isEditingPcDisallowed(name)
  },

  onChangeBeschreibung (event) {
    const beschreibung = event.target.value
    this.setState({
      beschreibung: beschreibung
    })
  },

  onChangeDatenstand (event) {
    const datenstand = event.target.value
    this.setState({
      datenstand: datenstand
    })
  },

  onChangeNutzungsbedingungen (event) {
    const nutzungsbedingungen = event.target.value
    this.setState({
      nutzungsbedingungen: nutzungsbedingungen
    })
  },

  onChangeLink (event) {
    const link = event.target.value
    this.setState({
      link: link
    })
  },

  onBlurLink (event) {
    const link = event.target.value
    const validLink = !link || isValidUrl(link)
    this.setState({
      validLink: validLink
    })
  },

  onChangeZusammenfassend (event) {
    const zusammenfassend = event.target.checked
    this.setState({
      zusammenfassend: zusammenfassend,
      nameUrsprungsEs: null
    })
  },

  onChangeNameUrsprungsEs (event) {
    const nameUrsprungsEs = event.target.value
    const { zusammenfassend } = this.state
    let validUrsprungsEs = true
    if (zusammenfassend && !nameUrsprungsEs) validUrsprungsEs = false
    this.setState({
      nameUrsprungsEs: nameUrsprungsEs,
      validUrsprungsEs: validUrsprungsEs
    })
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
      const fileName = file.name
      const fileType = fileName.split('.').pop()
      let reader = new window.FileReader()

      if (fileType === 'csv') {
        reader.onload = function (onloadEvent) {
          const data = onloadEvent.target.result
          const pcsToImport = d3.csv.parse(data)
          // d3 adds missing fields as '' > remove them
          pcsToImport.forEach(function (pc, index) {
            _.forEach(pc, function (value, key) {
              if (value === '') delete pcsToImport[index][key]
            })
          })
          that.setState({
            pcsToImport: pcsToImport
          })
        }
        reader.readAsText(file)
      }
      if (fileType === 'xlsx') {
        reader.onload = function (onloadEvent) {
          const data = onloadEvent.target.result
          const workbook = xlsx.read(data, {type: 'binary'})
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          const pcsToImport = xlsx.utils.sheet_to_json(worksheet)
          that.setState({
            pcsToImport: pcsToImport
          })
        }
        reader.readAsBinaryString(file)
      }
    }
  },

  nameBestehendOptions () {
    const { eigenschaftensammlungen } = this.state
    const { email } = this.props

    if (eigenschaftensammlungen && eigenschaftensammlungen.length > 0) {
      let options = eigenschaftensammlungen.map(function (pc) {
        const name = pc.name
        const pcCombining = pc.combining
        const pcImportedBy = pc.importedBy
        // mutable: only those imported by user and combining pc's
        // or: user is admin
        const mutable = (pcImportedBy === email || pcCombining || Boolean(window.localStorage.admin))
        const className = mutable ? 'adbGruenFett' : 'adbGrauNormal'
        return (<option key={name} value={name} className={className} waehlbar={mutable}>{name}</option>)
      })
      // add an empty option at the beginning
      options.unshift(<option key='noValue' value='' waehlbar={true}></option>)
      return options
    } else {
      // this option is showed while loading
      return (<option value='' waehlbar={true}>Lade Daten...</option>)
    }
  },

  isEditingPcDisallowed (name) {
    const { eigenschaftensammlungen, email } = this.state
    const that = this
    // set editing allowed to true
    // reaseon: close alert if it is still shown from last select
    this.setState({
      esBearbeitenErlaubt: true
    })
    // check if this name exists
    // if so and it is not combining: check if it was imported by the user
    const samePc = _.find(eigenschaftensammlungen, function (pc) {
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

  ursprungsEsOptions () {
    const { eigenschaftensammlungen } = this.state
    // don't want combining pcs
    let options = _.filter(eigenschaftensammlungen, function (pc) {
      return !pc.combining
    })
    options = _.pluck(options, 'name')
    options = options.map(function (name) {
      return (<option key={name} value={name}>{name}</option>)
    })
    // add an empty option at the beginning
    options.unshift(<option key='noValue' value=''></option>)
    return options
  },

  namePopover () {
    return (
      <Popover title='So wählen Sie einen guten Namen:'>
        <p>Er sollte ungefähr dem ersten Teil eines Literaturzitats entsprechen. Beispiel: "Blaue Liste (1998)".</p>
        <p>Wurden die Informationen spezifisch für einen bestimmten Kanton oder die ganze Schweiz erarbeitet?<br/>Wenn ja: Bitte das entsprechende Kürzel voranstellen. Beispiel: "ZH Artwert (aktuell)".</p>
      </Popover>
    )
  },

  beschreibungPopover () {
    return (
      <Popover title='So beschreiben Sie die Sammlung:'>
        <p>Die Beschreibung sollte im ersten Teil etwa einem klassischen Literaturzitat entsprechen.<br/>
          Beispiel: "Gigon A. et al. (1998): Blaue Listen der erfolgreich erhaltenen oder geförderten Tier- und Pflanzenarten der Roten Listen. Methodik und Anwendung in der nördlichen Schweiz. Veröff. Geobot. Inst. ETH, Stiftung Rübel, Zürich 129: 1-137 + 180 pp. Appendicesn".</p>
        <p>In einem zweiten Teil sollte beschrieben werden, welche Informationen die Eigenschaftensammlung enthält.<br/>
          Beispiel: "Eigenschaften von 207 Tierarten und 885 Pflanzenarten".</p>
        <p>Es kann sehr nützlich sein, zu wissen, wozu die Informationen zusammengestellt wurden.</p>
      </Popover>
    )
  },

  datenstandPopover () {
    return (
      <Popover title='Wozu ein Datenstand?'>
        <p>Hier sieht der Nutzer, wann die Eigenschaftensammlung zuletzt aktualisiert wurde.</p>
      </Popover>
    )
  },

  nutzungsbedingungenPopover () {
    return (
      <Popover title='Wozu Nutzunsbedingungen?'>
        <p>Der Nutzer soll wissen, was er mit den Daten machen darf.</p>
        <p><strong>Beispiele:</strong></p>
        <p>Wenn <strong>fremde Daten</strong> mit Einverständnis des Autors importiert werden:<br/>
        "Importiert mit Einverständnis des Autors. Eine allfällige Weiterverbreitung ist nur mit dessen Zustimmung möglich."</p>
        <p>Wenn <strong>eigene Daten</strong> importiert werden:<br/>
        "Open Data: Die veröffentlichten Daten dürfen mit Hinweis auf die Quelle vervielfältigt, verbreitet und weiter zugänglich gemacht, angereichert und bearbeitet sowie kommerziell genutzt werden. Für die Richtigkeit, Genauigkeit, Zuverlässigkeit und Vollständigkeit der bezogenen, ebenso wie der daraus erzeugten Daten und anderer mit Hilfe dieser Daten hergestellten Produkte wird indessen keine Haftung übernommen."</p>
        <p><em>Tipp: Klicken Sie auf "Nutzungsbedingungen". Dann bleibt diese Meldung offen und Sie können den Beispieltext kopieren.</em></p>
      </Popover>
    )
  },

  linkPopover () {
    return (
      <Popover title='Wozu ein Link?'>
        <p>Kann die Originalpublikation verlinkt werden?</p>
        <p>Oder eine erläuternde Webseite?</p>
      </Popover>
    )
  },

  zusammenfassendPopover () {
    return (
      <Popover title='Was heisst "zusammenfassend"?'>
        <p>Die Informationen in einer zusammenfassenden Eigenschaftensammlung wurden aus mehreren eigenständigen Eigenschaftensammlungen zusammegefasst.</p>
        <p>Zweck: Jede Art bzw. jeder Lebensraum enthält die jeweils aktuellste Information zum Thema.</p>
        <p>Beispiel: Rote Liste.</p>
        <p>Mehr Infos <a href='https://github.com/FNSKtZH/artendb#zusammenfassende-eigenschaftensammlungen' target='_blank'>im Projektbeschrieb</a>.</p>
        <p><em>Tipp: Klicken Sie auf "zusammenfassend", damit diese Meldung offen bleibt.</em></p>
      </Popover>
    )
  },

  ursprungsEsPopover () {
    return (
      <Popover title='Was heisst "eigenständig"?'>
        <p>Eine zusammenfassende Eigenschaftensammlung wird zwei mal importiert:</p>
        <ol>
          <li>Als <strong>eigenständige</strong> Eigenschaftensammlung.</li>
          <li>Gemeinsam mit bzw. zusätzlich zu anderen in eine <strong>zusammenfassende</strong> Eigenschaftensammlung.</li>
        </ol>
        <p>Wählen Sie hier den Namen der eigenständigen Sammlung.</p>
        <p><strong>Zweck:</strong> In der zusammenfassenden Sammlung ist bei jedem Datensatz beschrieben, woher er stammt.</p>
      </Popover>
    )
  },

  // TODO: modularize
  ursprungsEs () {
    const { nameUrsprungsEs, validUrsprungsEs } = this.state
    return (
      <div className={validUrsprungsEs ? 'form-group' : 'form-group has-error'}>
        <OverlayTrigger trigger='click' placement='right' overlay={this.ursprungsEsPopover()}>
          <OverlayTrigger trigger={['hover', 'focus']} placement='right' overlay={this.ursprungsEsPopover()}>
            <label className='control-label withPopover' htmlFor='dsUrsprungsDs' id='dsUrsprungsDsLabel'>eigenständige Eigenschaftensammlung</label>
          </OverlayTrigger>
        </OverlayTrigger>
        <select className='form-control controls input-sm' id='dsUrsprungsDs' selected={nameUrsprungsEs} onChange={this.onChangeNameUrsprungsEs}>{this.ursprungsEsOptions()}</select>
        {validUrsprungsEs ? null : <div className='validateDiv'>Bitte wählen Sie die eigenständige Eigenschaftensammlung</div>}
      </div>
    )
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
    const { nameBestehend, name, beschreibung, datenstand, nutzungsbedingungen, link, importiertVon, zusammenfassend, esBearbeitenErlaubt, pcsToImport, pcDescribed, pcLoaded, idsIdentified, validName, validBeschreibung, validDatenstand, validNutzungsbedingungen, validLink } = this.state

    return (
      <div>
        <h4>Eigenschaften importieren</h4>
        <Accordion defaultActiveKey={1}>
          <Panel header='1. Eigenschaftensammlung beschreiben' eventKey={1}>
            <Well className='well-sm'><a href='//youtu.be/nqd-v6YxkOY' target='_blank'><b>Auf Youtube sehen, wie es geht</b></a></Well>
            <WellAutorenrechte />

            <div className='form-group'>
              <label className='control-label' htmlFor='nameBestehend'>Bestehende wählen</label>
              <select id='nameBestehend' className='form-control controls' selected={nameBestehend} onChange={this.onChangePcNameExisting}>{this.nameBestehendOptions()}</select>
            </div>

            <div className='controls feld'>
              <button type='button' className='btn btn-primary btn-default' style={{'display': 'none', 'marginBottom': 6 + 'px'}}>Gewählte Eigenschaftensammlung und alle ihre Eigenschaften aus allen Arten und/oder Lebensräumen entfernen</button>
            </div>

            <hr />

            <div className={validName ? 'form-group' : 'form-group has-error'}>
              <OverlayTrigger trigger='click' rootClose placement='right' overlay={this.namePopover()}>
                <OverlayTrigger trigger={['hover', 'focus']} placement='right' overlay={this.namePopover()}>
                  <label className='control-label withPopover'>Name</label>
                </OverlayTrigger>
              </OverlayTrigger>
              <input type='text' className='controls input-sm form-control' value={name} onChange={this.onChangeName} onBlur={this.onBlurPcName} />
              {validName ? null : <div className='validateDiv'>Ein Name ist erforderlich</div>}
            </div>
            {esBearbeitenErlaubt ? null : this.alertEditingPcDisallowed()}

            <div className={validBeschreibung ? 'form-group' : 'form-group has-error'}>
              <OverlayTrigger trigger='click' rootClose placement='right' overlay={this.beschreibungPopover()}>
                <OverlayTrigger trigger={['hover', 'focus']} placement='right' overlay={this.beschreibungPopover()}>
                  <label className='control-label withPopover'>Beschreibung</label>
                </OverlayTrigger>
              </OverlayTrigger>
              <input type='textarea' className='form-control controls' value={beschreibung} onChange={this.onChangeBeschreibung} rows={1} />
              {validBeschreibung ? null : <div className='validateDiv'>Eine Beschreibung ist erforderlich</div>}
            </div>

            <div className={validDatenstand ? 'form-group' : 'form-group has-error'}>
              <OverlayTrigger trigger='click' rootClose placement='right' overlay={this.datenstandPopover()}>
                <OverlayTrigger trigger={['hover', 'focus']} placement='right' overlay={this.datenstandPopover()}>
                  <label className='control-label withPopover'>Datenstand</label>
                </OverlayTrigger>
              </OverlayTrigger>
              <input type='textarea' className='form-control controls' rows={1} value={datenstand} onChange={this.onChangeDatenstand} />
              {validDatenstand ? null : <div className='validateDiv'>Ein Datenstand ist erforderlich</div>}
            </div>

            <div className={validNutzungsbedingungen ? 'form-group' : 'form-group has-error'}>
              <OverlayTrigger trigger='click' rootClose placement='right' overlay={this.nutzungsbedingungenPopover()}>
                <OverlayTrigger trigger={['hover', 'focus']} placement='right' overlay={this.nutzungsbedingungenPopover()}>
                  <label className='control-label withPopover'>Nutzungsbedingungen</label>
                </OverlayTrigger>
              </OverlayTrigger>
              <textarea className='form-control controls' rows={1} value={nutzungsbedingungen} onChange={this.onChangeNutzungsbedingungen}></textarea>
              {validNutzungsbedingungen ? null : <div className='validateDiv'>Nutzungsbedingungen sind erforderlich</div>}
            </div>

            <div className={validLink ? 'form-group' : 'form-group has-error'}>
              <OverlayTrigger trigger='click' rootClose placement='right' overlay={this.linkPopover()}>
                <OverlayTrigger trigger={['hover', 'focus']} placement='right' overlay={this.linkPopover()}>
                  <label className='control-label withPopover'>Link</label>
                </OverlayTrigger>
              </OverlayTrigger>
              <input type='textarea' className='form-control controls' value={link} onBlur={this.onBlurLink} onChange={this.onChangeLink} rows={1} />
              {validLink ? null : <div className='validateDiv'>Bitte prüfen Sie den Link</div>}
            </div>

            <Input type='text' label={'importiert von'} className='controls input-sm' value={importiertVon} disabled />

            <div className={'form-group'}>
              <OverlayTrigger trigger='click' rootClose placement='right' overlay={this.zusammenfassendPopover()}>
                <OverlayTrigger trigger={['hover', 'focus']} placement='right' overlay={this.zusammenfassendPopover()}>
                  <label className='control-label withPopover' htmlFor={'dsZusammenfassend'}>zusammenfassend</label>
                </OverlayTrigger>
              </OverlayTrigger>
              <input type='checkbox' label={'zusammenfassend'} checked={zusammenfassend} onChange={this.onChangeZusammenfassend} />
            </div>

            {zusammenfassend ? this.ursprungsEs() : null}

            <div className='form-group'>
              <label className='control-label' htmlFor='dsAnzDs' id='dsAnzDsLabel'></label>
              <div id='dsAnzDs' className='feldtext controls'></div>
            </div>
          </Panel>

          <Panel header='2. Eigenschaften laden' eventKey={2}>
            <WellTechnAnforderungenAnDatei />
            <WellAnforderungenAnCsv />
            <WellAnforderungenInhaltlich />

            <label className='sr-only' htmlFor='pcFile'>Datei wählen</label>
            <input type='file' className='form-control' id='pcFile' onChange={this.onChangePcFile} />

            {pcsToImport.length > 0 ? <TablePreview pcsToImport={pcsToImport} /> : null}
          </Panel>

          <Panel header="3. ID's identifizieren" eventKey={3}>
            <div id='dsFelderDiv' className='form-group'></div>
            <Input type='select' label={'zugehörige ID in ArtenDb'} multiple className='form-control controls input-sm' id='dsId' style={{'height': 101 + 'px'}}>
              <option value='guid'>GUID der ArtenDb</option>
              <option value='Fauna'>ID der Info Fauna (NUESP)</option>
              <option value='Flora'>ID der Info Flora (SISF-NR)</option>
              <option value='Moose'>ID des Datenzentrums Moose Schweiz (TAXONNO)</option>
              <option value='Macromycetes'>ID von Swissfungi (TaxonId)</option>
            </Input>
            <Alert id='importDsIdsIdentifizierenHinweisText' className='alert-info feld' />
          </Panel>

          <Panel header='4. Import ausführen' eventKey={4}>
            <Button className='btn-primary' id='dsImportieren' style={{'marginBottom': 6 + 'px', 'display': 'none'}}>Eigenschaftensammlung mit allen Eigenschaften importieren</Button>
            <Button className='btn-primary' id='dsEntfernen' style={{'marginBottom': 6 + 'px', 'display': 'none'}}>Eigenschaftensammlung mit allen Eigenschaften aus den in der geladenen Datei enthaltenen Arten/Lebensräumen entfernen</Button>
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
