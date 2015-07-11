/*
 * passes properties to hierarchy objects
 * accepts a path which is an array
 * and the group which is the lower case name of object.Gruppe
 */
'use strict'

import app from 'ampersand-app'

export default function (hierarchies, path, gruppe) {
  let ho = app.hierarchieObject[gruppe]

  const objectToPass = {
    'Name': gruppe,
    'Hierarchie': hierarchies
  }

  switch (path.length) {
  case 0:
    ho = objectToPass
    break
  case 1:
    ho[path[0]].Hierarchie = objectToPass
    break
  case 2:
    ho[path[0]].Hierarchie[path[1]] = objectToPass
    break
  case 3:
    ho[path[0]].Hierarchie[path[1]].Hierarchie[path[2]].Hierarchie = objectToPass
    break
  case 4:
    ho[path[0]].Hierarchie[path[1]].Hierarchie[path[2]].Hierarchie[path[3]].Hierarchie = objectToPass
    break
  case 5:
    ho[path[0]].Hierarchie[path[1]].Hierarchie[path[2]].Hierarchie[path[3]].Hierarchie[path[4]].Hierarchie = objectToPass
    break
  case 6:
    ho[path[0]].Hierarchie[path[1]].Hierarchie[path[2]].Hierarchie[path[3]].Hierarchie[path[4]].Hierarchie[path[5]].Hierarchie = objectToPass
    break
  case 7:
    ho[path[0]].Hierarchie[path[1]].Hierarchie[path[2]].Hierarchie[path[3]].Hierarchie[path[4]].Hierarchie[path[5]].Hierarchie[path[6]].Hierarchie = objectToPass
    break
  case 8:
    ho[path[0]].Hierarchie[path[1]].Hierarchie[path[2]].Hierarchie[path[3]].Hierarchie[path[4]].Hierarchie[path[5]].Hierarchie[path[6]].Hierarchie[path[7]].Hierarchie = objectToPass
    break
  }
}
