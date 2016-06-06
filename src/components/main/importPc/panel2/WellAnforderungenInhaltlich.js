'use strict'

import React from 'react'
import { Well } from 'react-bootstrap'

export default React.createClass({
  displayName: 'WellAnforderungenInhaltlich',

  propTypes: {
    visible: React.PropTypes.bool
  },

  getInitialState() {
    return {
      visible: false
    }
  },

  onClickToggle(event) {
    event.preventDefault()
    this.setState({ visible: !this.state.visible })
  },

  render() {
    const { visible } = this.state

    return (
      <Well
        bsSize="small"
        style={{ marginBottom: 15 }}
      >
        <b>Inhaltliche Anforderungen</b>
        &nbsp;
        <a
          href="#"
          onClick={this.onClickToggle}
          className="showNextHidden"
        >
          {visible ? '...weniger' : '...mehr'}
        </a>
        <ul
          style={{ display: visible ? 'block' : 'none' }}
        >
          <li>
            Um die Art oder den Lebensraum zu identifizieren müssen Sie eine <strong>ID</strong> mitliefern.<br />
            Entweder die GUID der ArtenDb.<br />
            Oder die vom entsprechenden nationalen Artdatenzentrum
            für diese Artengruppe verwendete ID (z.B. Flora: SISF-Nr)
          </li>
          <li>
            Sie haben bloss eine <strong>andere ID?</strong><br />
            Vielleicht finden Sie sie in einer Eigenschaftensammlung der ArtenDb.<br />
            Beispielsweise enthält die Flora Indicativa
            (= "CH Zeigerwerte (2010)") mehrere weitere ID`s aus anderen Florenwerken.<br />
            Sie können diese Daten gemeinsam mit der GUID der ArtenDb exportieren
            (z.B. ins Excel-Arbeitsblatt "ID-Liste").<br />
            Danach können Sie z.B. in Excel in der Spalte neben ihrer ID mithilfe der Funktion "SVERWEIS" die jeweilige
            GUID der ArtenDb einfügen.<br />
            Die Funktion "SVERWEIS" schlägt dabei in der "ID-Liste" für ihre ID die GUID nach
          </li>
          <li>
            Achten Sie bitte darauf, die <strong>Feldnamen und</strong> die enthaltenen <strong>Werte
            uncodiert und aussagekräftig</strong> zu gestalten.<br />
            Auch Nutzer ohne Spezialwissen sollten sie verstehen können
          </li>
          <li>
            Sind für Ihre Daten <strong>Codierungen</strong> wichtig?<br />
            Dann importieren Sie die Daten doch einfach in zwei Felder:<br />
            Eines codiert, das andere uncodiert.<br />
            Und ergänzen Sie Ihre Feldnamen mit den Zusätzen "codiert" bzw. "uncodiert"
          </li>
          <li>
            ArtenDb setzt beim Export von Daten den
            <strong>Namen der Eigenschaftensammlung vor den Feldnamen</strong>,<br />
            z.B.: "ZH FNS (aktuell): Artwert". Das erleichtert das Verständnis der Daten in der "flachen" Tabelle.<br />
            Beim Import hingegen ist es NICHT sinnvoll, die Felder so zu nennen.<br />
            Denn den Namen der Eigenschaftensammlung haben Sie im letzten Arbeitsschritt schon erfasst
            und er wird den Daten beim Import in hierarchischer Form mitgegeben
          </li>
        </ul>
      </Well>
    )
  }
})
