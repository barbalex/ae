'use strict'

export default ({ id, name, beschreibung, datenstand, nutzungsbedingungen, link, importiertVon, zusammenfassend, nameUrsprungsEs }) => {
  let rc = {}
  rc._id = id
  rc.Name = name
  rc.Beschreibung = beschreibung
  rc.Datenstand = datenstand
  rc.Nutzungsbedingungen = nutzungsbedingungen
  if (link) rc.Link = link
  rc['importiert von'] = importiertVon
  if (zusammenfassend) rc.zusammenfassend = zusammenfassend
  if (nameUrsprungsEs) rc.Ursprungsdatensammlung = nameUrsprungsEs
  rc.Beziehungen = {}
  return rc
}
