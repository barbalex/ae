'use strict'

import React from 'react'
import { Accordion, Panel, Well, FormControls, Input, Alert, Button } from 'react-bootstrap'

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
            <div className='well well-sm'><a href='//youtu.be/nqd-v6YxkOY' target='_blank'><b>Screencast sehen</b></a></div>
            <div className='well well-sm'><b>Erleichtern Sie den Benutzern, Ihre Daten zu verstehen</b> <a href='#' className='showNextHidden'>...mehr</a>
              <ul className='adb-hidden'>
                <li>Der Name sollte ungefähr dem ersten Teil eines Literaturzitats entsprechen. Beispiel: 'Blaue Liste (1998)'</li>
                <li>Wurden die Informationen spezifisch für einen bestimmten Kanton oder die ganze Schweiz erarbeitet? Wenn ja: Bitte das entsprechende Kürzel voranstellen. Beispiel: 'ZH Artwert (aktuell)'</li>
                <li>Die Beschreibung sollte im ersten Teil etwa einem klassischen Literaturzitat entsprechen. Beispiel: 'Gigon A. et al. (1998): Blaue Listen der erfolgreich erhaltenen oder geförderten Tier- und Pflanzenarten der Roten Listen. Methodik und Anwendung in der nördlichen Schweiz. Veröff. Geobot. Inst. ETH, Stiftung Rübel, Zürich 129: 1-137 + 180 pp. Appendicesn'</li>
                <li>In einem zweiten Teil sollte beschrieben werden, welche Informationen die Eigenschaftensammlung enthält. Beispiel: 'Eigenschaften von 207 Tierarten und 885 Pflanzenarten'</li>
                <li>Es kann hilfreich sein, den Zweck zu beschreiben, für den die Informationen zusammengestellt wurden</li>
                <li>Im Datenstand ist erkenntlich, wann die Eigenschaftensammlung zuletzt aktualisiert wurde</li>
                <li>Besonders hilfreich ist es, wenn die Originalpublikation verlinkt werden kann. Oder eine erläuternde Webseite</li>
              </ul>
            </div>
            <div className='well well-sm'><b>Für eine zusammenfassende Eigenschaftensammlung importieren Sie die Daten zwei mal</b> <a href='#' className='showNextHidden'>...mehr</a>
              <ul className='adb-hidden'>
                <li>zuerst in die Ursprungs-Eigenschaftensammlung</li>
                <li>dann in die zusammenfassende. Bitte die Ursprungs-Eigenschaftensammlung angeben</li>
                <li>Mehr Infos <a href='//github.com/FNSKtZH/artendb#zusammenfassende_datensammlungen' target='_blank'>hier</a></li>
              </ul>
            </div>
            <div className='well well-sm last-well'><b>Autorenrechte beachten</b> <a href='#' className='showNextHidden'>...mehr</a>
              <ul className='adb-hidden'>
                <li>Die Autoren müssen mit der Veröffentlichung einverstanden sein</li>
                <li>Dafür verantwortlich ist, wer Daten importiert</li>
              </ul>
            </div>
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
            <div className='form-group'>
              <label className='control-label' htmlFor='dsBeschreibung'>Beschreibung</label>
              <textarea className='form-control controls' id='dsBeschreibung'></textarea>
            </div>
            <div className='form-group'>
              <label className='control-label' htmlFor='dsDatenstand'>Datenstand</label>
              <textarea className='form-control controls' id='dsDatenstand'></textarea>
            </div>
            <div className='form-group'>
              <label className='control-label' htmlFor='dsNutzungsbedingungen'>Nutzungsbedingungen</label>
              <textarea className='form-control controls' id='dsNutzungsbedingungen' placeholder='Beispiel, wenn Fremddaten mit Einverständnis des Autors importiert werden:
"Importiert mit Einverständnis des Autors. Eine allfällige Weiterverbreitung ist nur mit dessen Zustimmung möglich"

Beispiel, wenn eigene Daten importiert werden:
"Open Data: Die veröffentlichten Daten dürfen mit Hinweis auf die Quelle vervielfältigt, verbreitet und weiter zugänglich gemacht, angereichert und bearbeitet sowie kommerziell genutzt werden. Für die Richtigkeit, Genauigkeit, Zuverlässigkeit und Vollständigkeit der bezogenen, ebenso wie der daraus erzeugten Daten und anderer mit Hilfe dieser Daten hergestellten Produkte wird indessen keine Haftung übernommen."

'                                    ></textarea>
            </div>
            <div className='form-group'>
              <label className='control-label' htmlFor='dsLink'>Link</label>
              <textarea className='form-control controls' id='dsLink'></textarea>
            </div>
            <Input type='text' label={'importiert von'} className='controls input-sm' id='dsImportiertVon' />
            <Input type='checkbox' label={'zusammenfassend'} id='dsZusammenfassend' />
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
            Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably havent heard of them accusamus labore sustainable VHS.
          </Panel>
          <Panel header="4. ID's identifizieren" eventKey='4'>
            Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably havent heard of them accusamus labore sustainable VHS.
          </Panel>
          <Panel header='5. Import ausführen' eventKey='5'>
            Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably havent heard of them accusamus labore sustainable VHS.
          </Panel>
        </Accordion>
      </div>
    )
  }

})
