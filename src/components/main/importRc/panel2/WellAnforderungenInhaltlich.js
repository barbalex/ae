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
      <Well bsSize="small">
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
            Um die Art oder den Lebensraum zu identifizieren, an den die Beziehung angefügt werden soll,
            müssen Sie eine ID mitliefern.<br />
            Entweder die GUID der ArtenDb.<br />
            Oder die vom entsprechenden nationalen Artdatenzentrum
            für diese Artengruppe verwendete ID (z.B. Flora: SISF-Nr)
          </li>
          <li>
            Sie haben bloss eine andere ID? Vielleicht finden Sie sie
            in einer Eigenschaftensammlung der ArtenDb. Beispielsweise enthält
            die Flora Indicativa (= "CH Zeigerwerte (2010)") mehrere weitere
            ID`s aus anderen Florenwerken. Sie können diese Daten gemeinsam
            mit der GUID der ArtenDb exportieren (z.B. ins Excel-Arbeitsblatt "ID-Liste").
            Danach können Sie z.B. in Excel in der Spalte neben ihrer ID mithilfe
            der Funktion "SVERWEIS" die jeweilige GUID der ArtenDb einfügen.
            Die Funktion "SVERWEIS" schlägt dabei in der "ID-Liste" für ihre ID die GUID nach
          </li>
          <li>
            Es braucht ein Feld namens "Beziehungspartner".
            Dieses muss jeweils ein oder mehrere GUID's der ArtenDb enthalten
            (andere ID's werden hier - zumindest vorläufig - nicht erkannt)
          </li>
          <li>Es können beliebig viele weitere, die Beziehung beschreibende Felder enthalten sein
          </li>
          <li>
            Achten Sie bitte darauf, die Feldnamen und die enthaltenen Werte
            uncodiert und aussagekräftig zu gestalten.
            Auch Nutzer ohne Spezialwissen sollten sie verstehen können
          </li>
          <li>
            Sind für Ihre Daten Codierungen wichtig?
            Dann importieren Sie die Daten doch einfach in zwei Felder:
            Eines codiert, das andere uncodiert.
            Und ergänzen Sie Ihre Feldnamen mit den Zusätzen "codiert" bzw. "uncodiert"
          </li>
          <li>
            ArtenDb setzt beim Export von Daten den Namen der Eigenschaftensammlung
            vor den Feldnamen, z.B.: "ZH FNS (aktuell): Artwert".
            Das erleichtert das Verständnis der Daten in der "flachen" Tabelle.<br />
            Beim Import hingegen ist es NICHT sinnvoll, die Felder so zu nennen.
            Denn den Namen der Eigenschaftensammlung haben Sie im letzten Arbeitsschritt
            schon erfasst und er wird den Daten beim Import in hierarchischer Form mitgegeben
          </li>
        </ul>
      </Well>
    )
  }
})
