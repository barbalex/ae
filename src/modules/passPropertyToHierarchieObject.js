/*
 * passes properties to hierarchy objects
 * accepts a path which is an array
 * and the group which is the lower case name of object.Gruppe
 */
'use strict'

import app from 'ampersand-app'
import _ from 'lodash'

export default function (guid, hierarchies, path, name, gruppe) {

  const objectToPass = { 'Name': name }
  if (hierarchies && _.keys(hierarchies).length > 0) objectToPass.Hierarchie = hierarchies
  if (guid) objectToPass.GUID = guid

  // console.log('passPropertyToHierarchieObject.js, objectToPass', objectToPass)

  switch (path.length) {
  case 1:
    app.hierarchieObject[gruppe] = objectToPass
    break
  case 2:
    console.log('passPropertyToHierarchieObject.js, hierarchies', hierarchies)
    console.log('passPropertyToHierarchieObject.js, path', path)
    console.log('passPropertyToHierarchieObject.js, name', name)
    console.log('passPropertyToHierarchieObject.js, gruppe', gruppe)
    console.log('passPropertyToHierarchieObject.js, objectToPass', objectToPass)
    app.hierarchieObject[gruppe].Hierarchie[path[1]].Hierarchie = objectToPass
    break
  /*case 3:
    app.hierarchieObject[gruppe].Hierarchie[path[1]].Hierarchie[path[2]] = objectToPass
    break
  case 4:
    app.hierarchieObject[gruppe].Hierarchie[path[1]].Hierarchie[path[2]].Hierarchie[path[3]].Hierarchie = objectToPass
    break
  case 5:
    app.hierarchieObject[gruppe].Hierarchie[path[1]].Hierarchie[path[2]].Hierarchie[path[3]].Hierarchie[path[4]].Hierarchie = objectToPass
    break
  case 6:
    app.hierarchieObject[gruppe].Hierarchie[path[1]].Hierarchie[path[2]].Hierarchie[path[3]].Hierarchie[path[4]].Hierarchie[path[5]].Hierarchie = objectToPass
    break
  case 7:
    app.hierarchieObject[gruppe].Hierarchie[path[1]].Hierarchie[path[2]].Hierarchie[path[3]].Hierarchie[path[4]].Hierarchie[path[5]].Hierarchie[path[6]].Hierarchie = objectToPass
    break
  case 8:
    app.hierarchieObject[gruppe].Hierarchie[path[1]].Hierarchie[path[2]].Hierarchie[path[3]].Hierarchie[path[4]].Hierarchie[path[5]].Hierarchie[path[6]].Hierarchie[path[7]].Hierarchie = objectToPass
    break
  case 9:
    app.hierarchieObject[gruppe].Hierarchie[path[1]].Hierarchie[path[2]].Hierarchie[path[3]].Hierarchie[path[4]].Hierarchie[path[5]].Hierarchie[path[6]].Hierarchie[path[7]].Hierarchie[path[8]].Hierarchie = objectToPass
    break*/
  }
  // console.log('passPropertyToHierarchieObject.js, app.hierarchieObject[gruppe] after', app.hierarchieObject[gruppe])
}
