/*
 * passes properties to hierarchy objects
 * accepts a path which is an array
 * and the group which is the lower case name of object.Gruppe
 */
'use strict'

import app from 'ampersand-app'

export default function (property, path, gruppe) {
  let ho = app.hierarchieObject[gruppe]

  switch (path.length) {
  case 0:
    ho = property
    break
  case 1:
    ho[path[0]] = property
    break
  case 2:
    ho[path[0]][path[1]] = property
    break
  case 3:
    ho[path[0]][path[1]][path[2]] = property
    break
  case 4:
    ho[path[0]][path[1]][path[2]][path[3]] = property
    break
  case 5:
    ho[path[0]][path[1]][path[2]][path[3]][path[4]] = property
    break
  case 6:
    ho[path[0]][path[1]][path[2]][path[3]][path[4]][path[5]] = property
    break
  case 7:
    ho[path[0]][path[1]][path[2]][path[3]][path[4]][path[5]][path[6]] = property
    break
  case 8:
    ho[path[0]][path[1]][path[2]][path[3]][path[4]][path[5]][path[6]][path[7]] = property
    break
  }
}
