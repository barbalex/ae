'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Accordion, Panel, Well, Input, Alert, Button, OverlayTrigger, Popover } from 'react-bootstrap'
import _ from 'lodash'
import { ListenerMixin } from 'reflux'
import WellAutorenrechte from './wellAutorenrechte.js'

export default React.createClass({
  displayName: 'Import',

  mixins: [ListenerMixin],

  propTypes: {
    email: React.PropTypes.string,
    propertyCollections: React.PropTypes.array,
    pcNameExisting: React.PropTypes.string,
    pcNameOrigin: React.PropTypes.string,
    pcName: React.PropTypes.string,
    beschreibung: React.PropTypes.string,
    datenstand: React.PropTypes.string,
    nutzungsbedingungen: React.PropTypes.string,
    link: React.PropTypes.string,
    importiertVon: React.PropTypes.string,
    zusammenfassend: React.PropTypes.bool,
    editingPcDisallowed: React.PropTypes.bool
  },

  getInitialState () {
    return {
      propertyCollections: [],
      pcNameExisting: null,
      pcNameOrigin: null,
      pcName: null,
      beschreibung: null,
      datenstand: null,
      nutzungsbedingungen: null,
      link: null,
      importiertVon: this.props.email,
      zusammenfassend: null,
      editingPcDisallowed: false
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
    const propertyCollections = _.forEach(pcs, function (pc) {
      pc.importedBy = pc.importedBy || 'alex@gabriel-software.ch'
    })
    this.setState({
      propertyCollections: propertyCollections
    })
  },

  onChangePcNameExisting (event) {
    const pcNameExisting = event.target.value
    const editingPcIsDisallowed = this.isEditingPcDisallowed(pcNameExisting)
    const pc = app.propertyCollectionsStore.getPcByName(pcNameExisting)
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
        pcNameExisting: pcNameExisting,
        pcName: pcNameExisting
      })
    }
  },

  onChangePcNameOrigin (event) {
    const pcNameOrigin = event.target.value
    this.setState({
      pcNameOrigin: pcNameOrigin
    })
  },

  onChangePcName (event) {
    const pcName = event.target.value
    this.setState({
      pcName: pcName
    })
  },

  onBlurPcName (event) {
    const pcName = event.target.value
    this.isEditingPcDisallowed(pcName)
  },

  isEditingPcDisallowed (pcName) {
    const { propertyCollections, email } = this.state
    const that = this
    // set editing dissallowed to false
    // reaseon: close alert if it is still shown from last select
    this.setState({
      editingPcDisallowed: false
    })
    // check if this name exists
    // if so and it is not combining: check if it was imported by the user
    const samePc = _.find(propertyCollections, function (pc) {
      return pc.name === pcName
    })
    const editingPcDisallowed = !!samePc && !samePc.combining && samePc.importedBy !== email
    if (editingPcDisallowed) {
      this.setState({
        editingPcDisallowed: true
      })
      // delete text after a second
      setTimeout(function () {
        that.setState({
          pcNameExisting: null,
          pcName: null
        })
      }, 1000)
      // close alert after 8 seconds
      setTimeout(function () {
        that.setState({
          editingPcDisallowed: false
        })
      }, 8000)
    }
    return editingPcDisallowed
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

  onChangeZusammenfassend (event) {
    const zusammenfassend = event.target.checked
    this.setState({
      zusammenfassend: zusammenfassend,
      pcNameOrigin: null
    })
  },

  pcNameExistingOptions () {
    const { propertyCollections } = this.state
    const { email } = this.props

    if (propertyCollections.length > 0) {
      let options = propertyCollections.map(function (pc) {
        const pcName = pc.name
        const pcCombining = pc.combining
        const pcImportedBy = pc.importedBy
        // mutable: only those imported by user and combining pc's
        // or: user is admin
        const mutable = (pcImportedBy === email || pcCombining || Boolean(window.localStorage.admin))
        const className = mutable ? 'adbGruenFett' : 'adbGrauNormal'
        return (<option key={pcName} value={pcName} className={className} waehlbar={mutable}>{pcName}</option>)
      })
      // add an empty option at the beginning
      options.unshift(<option key='noValue' value='' waehlbar={true}></option>)
      return options
    } else {
      // this option is showed while loading
      return (<option value='' waehlbar={true}>Lade Daten...</option>)
    }
  },

  ursprungsEsOptions () {
    const { propertyCollections } = this.state
    // don't want combining pcs
    let options = _.filter(propertyCollections, function (pc) {
      return !pc.combining
    })
    options = _.pluck(options, 'name')
    options = options.map(function (pcName) {
      return (<option key={pcName} value={pcName}>{pcName}</option>)
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

  ursprungsEs () {
    const { pcNameOrigin } = this.state
    return (
      <div className='form-group'>
        <OverlayTrigger trigger='click' placement='right' overlay={this.ursprungsEsPopover()}>
          <OverlayTrigger trigger={['hover', 'focus']} placement='right' overlay={this.ursprungsEsPopover()}>
            <label className='control-label withPopover' htmlFor='dsUrsprungsDs' id='dsUrsprungsDsLabel'>eigenständige Eigenschaftensammlung</label>
          </OverlayTrigger>
        </OverlayTrigger>
        <select className='form-control controls input-sm' id='dsUrsprungsDs' selected={pcNameOrigin} onChange={this.onChangePcNameOrigin}>{this.ursprungsEsOptions()}</select>
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
    const { pcNameExisting, pcName, beschreibung, datenstand, nutzungsbedingungen, link, importiertVon, zusammenfassend, editingPcDisallowed } = this.state

    return (
      <div>
        <h4>Eigenschaften importieren</h4>
        <Accordion>
          <Panel header='1. Eigenschaftensammlung beschreiben' eventKey='1'>
            <Well className='well-sm'><a href='//youtu.be/nqd-v6YxkOY' target='_blank'><b>Auf Youtube sehen, wie es geht</b></a></Well>
            <WellAutorenrechte />

            <div className='form-group'>
              <label className='control-label' htmlFor='pcNameExisting'>Bestehende wählen</label>
              <select id='pcNameExisting' className='form-control controls' selected={pcNameExisting} onChange={this.onChangePcNameExisting}>{this.pcNameExistingOptions()}</select>
            </div>

            <div className='controls feld'>
              <button type='button' className='btn btn-primary btn-default' style={{'display': 'none', 'marginBottom': 6 + 'px'}}>Gewählte Eigenschaftensammlung und alle ihre Eigenschaften aus allen Arten und/oder Lebensräumen entfernen</button>
            </div>

            <hr />

            <div className='form-group'>
              <OverlayTrigger trigger='click' rootClose placement='right' overlay={this.namePopover()}>
                <OverlayTrigger trigger={['hover', 'focus']} placement='right' overlay={this.namePopover()}>
                  <label className='control-label withPopover'>Name</label>
                </OverlayTrigger>
              </OverlayTrigger>
              <input type='text' className='controls input-sm form-control' value={pcName} onChange={this.onChangePcName} onBlur={this.onBlurPcName} />
            </div>
            {editingPcDisallowed ? this.alertEditingPcDisallowed() : null}

            <div className='form-group'>
              <OverlayTrigger trigger='click' rootClose placement='right' overlay={this.beschreibungPopover()}>
                <OverlayTrigger trigger={['hover', 'focus']} placement='right' overlay={this.beschreibungPopover()}>
                  <label className='control-label withPopover'>Beschreibung</label>
                </OverlayTrigger>
              </OverlayTrigger>
              <input type='textarea' className='form-control controls' value={beschreibung} onChange={this.onChangeBeschreibung} rows={1} />
            </div>

            <div className='form-group'>
              <OverlayTrigger trigger='click' rootClose placement='right' overlay={this.datenstandPopover()}>
                <OverlayTrigger trigger={['hover', 'focus']} placement='right' overlay={this.datenstandPopover()}>
                  <label className='control-label withPopover'>Datenstand</label>
                </OverlayTrigger>
              </OverlayTrigger>
              <input type='textarea' className='form-control controls' rows={1} value={datenstand} onChange={this.onChangeDatenstand} />
            </div>

            <div className='form-group'>
              <OverlayTrigger trigger='click' rootClose placement='right' overlay={this.nutzungsbedingungenPopover()}>
                <OverlayTrigger trigger={['hover', 'focus']} placement='right' overlay={this.nutzungsbedingungenPopover()}>
                  <label className='control-label withPopover'>Nutzungsbedingungen</label>
                </OverlayTrigger>
              </OverlayTrigger>
              <textarea className='form-control controls' rows={1} value={nutzungsbedingungen} onChange={this.onChangeNutzungsbedingungen}></textarea>
            </div>

            <div className='form-group'>
              <OverlayTrigger trigger='click' rootClose placement='right' overlay={this.linkPopover()}>
                <OverlayTrigger trigger={['hover', 'focus']} placement='right' overlay={this.linkPopover()}>
                  <label className='control-label withPopover'>Link</label>
                </OverlayTrigger>
              </OverlayTrigger>
              <input type='textarea' className='form-control controls' value={link} onChange={this.onChangeLink} rows={1} />
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
          <Panel header='2. Eigenschaften laden' eventKey='2'>
            <Well className='well-sm'><b>Technische Anforderungen an die Datei</b> <a href='#' className='showNextHidden'>...mehr</a>
              <ul className='adb-hidden'>
                <li>Sie können Dateien vom Typ <b>.csv</b> (kommagetrennte Textdatei) oder <b>.xlsx</b> (Excel-Datei) importieren</li>
                <li>Die erste Zeile enthält die Feldnamen</li>
                <li>Die weiteren Zeilen enthalten je einen Datensatz, d.h. die Eigenschaften für die betreffende Art oder den Lebensraum</li>
                <li>Alle Zeilen sollten dieselbe Anzahl Felder bzw. Spalten enthalten</li>
                <li>Achten Sie darauf, dass die Datei die Codierung "UTF 8" benutzt. Nur in diesem Format werden Umlaute und Sonderzeichen vollständig erkannt</li>
              </ul>
            </Well>
            <Well className='well-sm'><b>Zusätzliche Anforderungen an csv-Dateien</b> <a href='#' className='showNextHidden'>...mehr</a>
              <ul className='adb-hidden'>
                <li>Zeilen werden mit einem Zeilenumbruch getrennt</li>
                <li>Der Inhalt eines Felds bzw. einer Spalte sollte in der Regel in Anführungs- und Schlusszeichen eingefasst sein, z.B.: "Artwert"</li>
                <li>Ausnahmen: Zahlen und true/false-Werte brauchen keine Anführungs- und Schlusszeichen (es macht aber nichts, wenn sie sie haben)</li>
                <li>Felder sind mit Komma getrennt</li>
                <li>Die beschriebenen Anforderungen entsprechen der am häufigsten verwendeten Konfiguration des <a href='//de.wikipedia.org/wiki/CSV_(Dateiformat)'>"csv"-Formats</a></li>
              </ul>
            </Well>
            <Well className='well-sm last-well'><b>Inhaltliche Anforderungen</b> <a href='#' className='showNextHidden'>...mehr</a>
              <ul className='adb-hidden'>
                <li>Um die Art oder den Lebensraum zu identifizieren müssen Sie eine ID mitliefern. Entweder die GUID der ArtenDb. Oder die vom entsprechenden nationalen Artdatenzentrum für diese Artengruppe verwendete ID (z.B. Flora: SISF-Nr)</li>
                <li>Sie haben bloss eine andere ID? Vielleicht finden Sie sie in einer Eigenschaftensammlung der ArtenDb. Beispielsweise enthält die Flora Indicativa (= "CH Zeigerwerte (2010)") mehrere weitere ID`s aus anderen Florenwerken. Sie können diese Daten gemeinsam mit der GUID der ArtenDb exportieren (z.B. ins Excel-Arbeitsblatt "ID-Liste"). Danach können Sie z.B. in Excel in der Spalte neben ihrer ID mithilfe der Funktion "SVERWEIS" die jeweilige GUID der ArtenDb einfügen. Die Funktion "SVERWEIS" schlägt dabei in der "ID-Liste" für ihre ID die GUID nach</li>
                <li>Achten Sie bitte darauf, die Feldnamen und die enthaltenen Werte uncodiert und aussagekräftig zu gestalten. Auch Nutzer ohne Spezialwissen sollten sie verstehen können</li>
                <li>Sind für Ihre Daten Codierungen wichtig? Dann importieren Sie die Daten doch einfach in zwei Felder: Eines codiert, das andere uncodiert. Und ergänzen Sie Ihre Feldnamen mit den Zusätzen "codiert" bzw. "uncodiert"</li>
                <li>ArtenDb setzt beim Export von Daten den Namen der Eigenschaftensammlung vor den Feldnamen, z.B.: "ZH FNS (aktuell): Artwert". Das erleichtert das Verständnis der Daten in der "flachen" Tabelle. Beim Import hingegen ist es NICHT sinnvoll, die Felder so zu nennen. Denn den Namen der Eigenschaftensammlung haben Sie im letzten Arbeitsschritt schon erfasst und er wird den Daten beim Import in hierarchischer Form mitgegeben</li>
              </ul>
            </Well>
            <label className='sr-only' htmlFor='dsFile'>Datei wählen</label>
            <input type='file' className='form-control' id='dsFile' />
            <div id='dsTabelleEigenschaften' className='tabelle'>
            </div>
          </Panel>
          <Panel header="3. ID's identifizieren" eventKey='3'>
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
          <Panel header='4. Import ausführen' eventKey='4'>
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
