'use strict'

import React from 'react'
import { Well } from 'react-bootstrap'

export default React.createClass({
  displayName: 'WellAnforderungenInhaltlich',

  propTypes: {
    isAnforderungenInhaltlichVisible: React.PropTypes.bool
  },

  getInitialState () {
    return {
      isAnforderungenInhaltlichVisible: false
    }
  },

  onClickAnforderungenInhaltlich (event) {
    event.preventDefault()
    this.setState({
      isAnforderungenInhaltlichVisible: !this.state.isAnforderungenInhaltlichVisible
    })
  },

  render () {
    const { isAnforderungenInhaltlichVisible } = this.state

    return (
      <Well className='well-sm last-well'><b>Inhaltliche Anforderungen </b> <a href='#' onClick={this.onClickAnforderungenInhaltlich} className='showNextHidden'>{isAnforderungenInhaltlichVisible ? '...weniger' : '...mehr'}</a>
        <ul className='adb-hidden' style={{'display': isAnforderungenInhaltlichVisible ? 'block' : 'none'}}>
          <li>Um die Art oder den Lebensraum zu identifizieren müssen Sie eine ID mitliefern. Entweder die GUID der ArtenDb. Oder die vom entsprechenden nationalen Artdatenzentrum für diese Artengruppe verwendete ID (z.B. Flora: SISF-Nr)</li>
          <li>Sie haben bloss eine andere ID? Vielleicht finden Sie sie in einer Eigenschaftensammlung der ArtenDb. Beispielsweise enthält die Flora Indicativa (= "CH Zeigerwerte (2010)") mehrere weitere ID`s aus anderen Florenwerken. Sie können diese Daten gemeinsam mit der GUID der ArtenDb exportieren (z.B. ins Excel-Arbeitsblatt "ID-Liste"). Danach können Sie z.B. in Excel in der Spalte neben ihrer ID mithilfe der Funktion "SVERWEIS" die jeweilige GUID der ArtenDb einfügen. Die Funktion "SVERWEIS" schlägt dabei in der "ID-Liste" für ihre ID die GUID nach</li>
          <li>Achten Sie bitte darauf, die Feldnamen und die enthaltenen Werte uncodiert und aussagekräftig zu gestalten. Auch Nutzer ohne Spezialwissen sollten sie verstehen können</li>
          <li>Sind für Ihre Daten Codierungen wichtig? Dann importieren Sie die Daten doch einfach in zwei Felder: Eines codiert, das andere uncodiert. Und ergänzen Sie Ihre Feldnamen mit den Zusätzen "codiert" bzw. "uncodiert"</li>
          <li>ArtenDb setzt beim Export von Daten den Namen der Eigenschaftensammlung vor den Feldnamen, z.B.: "ZH FNS (aktuell): Artwert". Das erleichtert das Verständnis der Daten in der "flachen" Tabelle. Beim Import hingegen ist es NICHT sinnvoll, die Felder so zu nennen. Denn den Namen der Eigenschaftensammlung haben Sie im letzten Arbeitsschritt schon erfasst und er wird den Daten beim Import in hierarchischer Form mitgegeben</li>
        </ul>
      </Well>
    )
  }
})