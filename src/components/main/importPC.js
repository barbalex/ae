'use strict'

import React from 'react'
import { Accordion, Panel, Well, FormControls, Input, Alert, Button } from 'react-bootstrap'
// import Textarea from 'react-textarea-autosize'

export default React.createClass({
  displayName: 'Import',

  propTypes: {
    userEmail: React.PropTypes.string
  },

  render () {
    console.log('importPC.js, render')
    return (
      <div>
        <h4>Eigenschaften importieren</h4>
        <Accordion>
          <Panel header='1. Anmelden' eventKey='1'>
            <Well className='well-sm anmelden'>Um Daten zu bearbeiten, müssen Sie angemeldet sein. <a href='mailto:alex@gabriel-software.ch'>Mailen Sie mir</a>, um ein Login zu erhalten.</Well>
            <Input type='email' id='emailArt' label={'Email'} bsSize='small' className={'controls'} placeholder='Email' required />
            <Alert id='emailHinweisArt' className='controls emailHinweis hinweis alert-danger feldInFormgroup'>Bitte Email erfassen</Alert>
            <Input type='password' id='passwortArt' label={'Passwort'} className={'controls'} placeholder='Passwort' required />
            <Alert id='passwortHinweisArt' className='controls passwortHinweis hinweis alert-danger feldInFormgroup'>Bitte Passwort erfassen</Alert>
            <div className='controls signup feldInFormgroup'>Vorsicht: Email und Passwort können später nicht mehr geändert werden!</div>
            <div className='controls signup feldInFormgroup'>Es wird eine verschlüsselte Version des Passworts gespeichert. Das Original kennt ausser Ihnen niemand.</div>
            <FormControls.Static className='Passwort'>Passwort vergessen? <a href='mailto:alex@gabriel-software.ch'>Mailen Sie mir</a>, möglichst mit derselben email-Adresse, die Sie für das Konto verwenden.</FormControls.Static>
            <div className='signup'>
              <Input type='password' id='passwort2Art' label={'Passwort bestätigen'} className='controls form-control passwort2' placeholder='Passwort bestätigen' required />
              <Alert id='passwort2HinweisArt' className='controls passwort2Hinweis hinweis alert-danger feldInFormgroup'>Bitte Passwort bestätigen</Alert>
              <Alert id='passwort2HinweisFalschArt' className='controls passwort2HinweisFalsch hinweis alert-danger feldInFormgroup'>Die Passwörter stimmen nicht überein</Alert>
            </div>
            <FormControls.Static style={{'paddingBottom': 6 + 'px'}}>
              <Button className='btn-primary'>anmelden</Button>
              <Button className='btn-primary' style={{'display': 'none'}}>abmelden</Button>
              <Button className='btn-primary'>neues Konto erstellen</Button>
              <Button className='btn-primary' style={{'display': 'none'}}>neues Konto speichern</Button>
            </FormControls.Static>
            <FormControls.Static>
              <Alert className='alert-danger'></Alert>
            </FormControls.Static>
            <FormControls.Static>
              <Alert className='alert-warning'></Alert>
            </FormControls.Static>
          </Panel>
          <Panel header='2. Eigenschaftensammlung beschreiben' eventKey='2'>
            <Well className='well-sm'><a href='//youtu.be/nqd-v6YxkOY' target='_blank'><b>Screencast sehen</b></a></Well>
            <Well className='well-sm'><b>Erleichtern Sie den Benutzern, Ihre Daten zu verstehen</b> <a href='#' className='showNextHidden'>...mehr</a>
              <ul className='adb-hidden'>
                <li>Der Name sollte ungefähr dem ersten Teil eines Literaturzitats entsprechen. Beispiel: 'Blaue Liste (1998)'</li>
                <li>Wurden die Informationen spezifisch für einen bestimmten Kanton oder die ganze Schweiz erarbeitet? Wenn ja: Bitte das entsprechende Kürzel voranstellen. Beispiel: 'ZH Artwert (aktuell)'</li>
                <li>Die Beschreibung sollte im ersten Teil etwa einem klassischen Literaturzitat entsprechen. Beispiel: 'Gigon A. et al. (1998): Blaue Listen der erfolgreich erhaltenen oder geförderten Tier- und Pflanzenarten der Roten Listen. Methodik und Anwendung in der nördlichen Schweiz. Veröff. Geobot. Inst. ETH, Stiftung Rübel, Zürich 129: 1-137 + 180 pp. Appendicesn'</li>
                <li>In einem zweiten Teil sollte beschrieben werden, welche Informationen die Eigenschaftensammlung enthält. Beispiel: 'Eigenschaften von 207 Tierarten und 885 Pflanzenarten'</li>
                <li>Es kann hilfreich sein, den Zweck zu beschreiben, für den die Informationen zusammengestellt wurden</li>
                <li>Im Datenstand ist erkenntlich, wann die Eigenschaftensammlung zuletzt aktualisiert wurde</li>
                <li>Besonders hilfreich ist es, wenn die Originalpublikation verlinkt werden kann. Oder eine erläuternde Webseite</li>
              </ul>
            </Well>
            <Well className='well-sm'><b>Für eine zusammenfassende Eigenschaftensammlung importieren Sie die Daten zwei mal</b><a href='#' className='showNextHidden'>...mehr</a>
              <ul className='adb-hidden'>
                <li>zuerst in die Ursprungs-Eigenschaftensammlung</li>
                <li>dann in die zusammenfassende. Bitte die Ursprungs-Eigenschaftensammlung angeben</li>
                <li>Mehr Infos <a href='//github.com/FNSKtZH/artendb#zusammenfassende_datensammlungen' target='_blank'>hier</a></li>
              </ul>
            </Well>
            <Well className='well-sm last-well'><b>Autorenrechte beachten</b> <a href='#' className='showNextHidden'>...mehr</a>
              <ul className='adb-hidden'>
                <li>Die Autoren müssen mit der Veröffentlichung einverstanden sein</li>
                <li>Dafür verantwortlich ist, wer Daten importiert</li>
              </ul>
            </Well>
            <div className='form-group'>
              <label className='control-label' htmlFor='dsWaehlen'>Bestehende wählen</label>
              <select className='form-control controls' id='dsWaehlen'></select>
            </div>
            <div className='controls feld'>
              <button type='button' className='btn btn-primary btn-default' id='dsLoeschen' style={{'display': 'none', 'marginBottom': 6 + 'px'}}>Gewählte Eigenschaftensammlung und alle ihre Eigenschaften aus allen Arten und/oder Lebensräumen entfernen</button>
              <div id='importierenDsDsBeschreibenHinweis' className='alert alert-info'></div>
            </div>
            <hr />
            <Input type='text' label={'Name'} className='controls input-sm' id='dsName' />
            <Input type='textarea' className='form-control controls' label={'Beschreibung'} id='dsBeschreibung' rows={1} />
            <Input type='textarea' className='form-control controls' label={'Datenstand'} id='dsDatenstand' rows={1} />
            <Input type='textarea' className='form-control controls' label={'Nutzungsbedingungen'} id='dsNutzungsbedingungen' rows={6} placeholder='Beispiel, wenn Fremddaten mit Einverständnis des Autors importiert werden:
"Importiert mit Einverständnis des Autors. Eine allfällige Weiterverbreitung ist nur mit dessen Zustimmung möglich"
.
Beispiel, wenn eigene Daten importiert werden:
"Open Data: Die veröffentlichten Daten dürfen mit Hinweis auf die Quelle vervielfältigt, verbreitet und weiter zugänglich gemacht, angereichert und bearbeitet sowie kommerziell genutzt werden. Für die Richtigkeit, Genauigkeit, Zuverlässigkeit und Vollständigkeit der bezogenen, ebenso wie der daraus erzeugten Daten und anderer mit Hilfe dieser Daten hergestellten Produkte wird indessen keine Haftung übernommen."

' />
            <Input type='textarea' className='form-control controls' label={'Link'} id='dsLink' rows={1} />
            <Input type='text' label={'importiert von'} className='controls input-sm' id='dsImportiertVon' />
            <div className={'form-group'}>
              <label className={'control-label'} htmlFor={'dsZusammenfassend'}>zusammenfassend</label>
              <input type='checkbox' label={'zusammenfassend'} id='dsZusammenfassend' />
            </div>
            <div className='form-group' id='dsUrsprungsDsDiv' style={{'display': 'none'}}>
              <label className='control-label dsUrsprungsDs' htmlFor='dsUrsprungsDs' id='dsUrsprungsDsLabel'>Ursprungs-Eigenschaftensammlung</label>
              <select className='form-control controls dsUrsprungsDs input-sm' id='dsUrsprungsDs'></select>
            </div>
            <div className='form-group'>
              <label className='control-label' htmlFor='dsAnzDs' id='dsAnzDsLabel'></label>
              <div id='dsAnzDs' className='feldtext controls'></div>
            </div>
            <div id='importDsDsBeschreibenHinweis2' className='alert alert-info'></div>
            <div id='importDsDsBeschreibenError' className='alert alert-danger'>
              <button type='button' className='close' data-dismiss='alert'>&times;</button>
              <div id='importDsDsBeschreibenErrorText'></div>
            </div>
          </Panel>
          <Panel header='3. Eigenschaften laden' eventKey='3'>
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
          <Panel header="4. ID's identifizieren" eventKey='4'>
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
          <Panel header='5. Import ausführen' eventKey='5'>
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
