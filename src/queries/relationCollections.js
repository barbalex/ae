function (doc) {
  'use strict'

  import _ from 'lodash'

  const y

  if (doc.Typ && doc.Typ === 'Objekt') {
    if (doc.Beziehungssammlungen) {
      doc.Beziehungssammlungen.forEach(function (bs) {
        // bsZusammenfassend ergänzen
        const bsZusammenfassend = !!bs.zusammenfassend
        let felder = {}
        for (y in bs) {
          if (y !== 'Typ' && y !== 'Name' && y !== 'Beziehungen') {
            felder[y] = bs[y]
          }
        }
        emit(['Beziehungssammlung', bs.Name, bsZusammenfassend, bs['importiert von'], felder], doc._id)
      })
    }
  }
}
