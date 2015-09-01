'use strict'

import React from 'react'
import { OverlayTrigger, Popover } from 'react-bootstrap'

export default React.createClass({
  displayName: 'InputNutzungsbedingungen',

  propTypes: {
    nutzungsbedingungen: React.PropTypes.string,
    validNutzungsbedingungen: React.PropTypes.bool,
    onChangeNutzungsbedingungen: React.PropTypes.func
  },

  onChange (event) {
    const nutzungsbedingungen = event.target.value
    this.props.onChangeNutzungsbedingungen(nutzungsbedingungen)
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

  render () {
    const { nutzungsbedingungen, validNutzungsbedingungen } = this.props

    return (
      <div className={validNutzungsbedingungen ? 'form-group' : 'form-group has-error'}>
        <OverlayTrigger trigger='click' rootClose placement='right' overlay={this.nutzungsbedingungenPopover()}>
          <OverlayTrigger trigger={['hover', 'focus']} placement='right' overlay={this.nutzungsbedingungenPopover()}>
            <label className='control-label withPopover'>Nutzungsbedingungen</label>
          </OverlayTrigger>
        </OverlayTrigger>
        <textarea className='form-control controls' rows={1} value={nutzungsbedingungen} onChange={this.onChange}></textarea>
        {validNutzungsbedingungen ? null : <div className='validateDiv feld'>Nutzungsbedingungen sind erforderlich</div>}
      </div>
    )
  }
})