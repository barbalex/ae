/*
 * passes properties to hierarchy objects
 * accepts a path which is an array
 * and the group which is the lower case name of object.Gruppe
 */
'use strict'

import app from 'ampersand-app'
import _ from 'lodash'

export default function (hierarchies, path, name, gruppe) {

  /*console.log('passPropertyToHierarchieObject.js, hierarchies', hierarchies)
  console.log('passPropertyToHierarchieObject.js, path', path)
  console.log('passPropertyToHierarchieObject.js, name', name)
  console.log('passPropertyToHierarchieObject.js, gruppe', gruppe)
  console.log('passPropertyToHierarchieObject.js, app.hierarchieObject[gruppe] before adding objectToPass', _.cloneDeep(app.hierarchieObject[gruppe]))*/

  const objectToPass = {
    'Name': name,
    'Hierarchie': hierarchies
  }

  // console.log('passPropertyToHierarchieObject.js, objectToPass', objectToPass)

  switch (path.length) {
  case 0:
    app.hierarchieObject[gruppe] = objectToPass
    break
  case 1:
    app.hierarchieObject[gruppe][path[0]].Hierarchie = objectToPass
    break
  case 2:
    app.hierarchieObject[gruppe][path[0]].Hierarchie[path[1]] = objectToPass
    break
  case 3:
    app.hierarchieObject[gruppe][path[0]].Hierarchie[path[1]].Hierarchie[path[2]].Hierarchie = objectToPass
    break
  case 4:
    app.hierarchieObject[gruppe][path[0]].Hierarchie[path[1]].Hierarchie[path[2]].Hierarchie[path[3]].Hierarchie = objectToPass
    break
  case 5:
    app.hierarchieObject[gruppe][path[0]].Hierarchie[path[1]].Hierarchie[path[2]].Hierarchie[path[3]].Hierarchie[path[4]].Hierarchie = objectToPass
    break
  case 6:
    app.hierarchieObject[gruppe][path[0]].Hierarchie[path[1]].Hierarchie[path[2]].Hierarchie[path[3]].Hierarchie[path[4]].Hierarchie[path[5]].Hierarchie = objectToPass
    break
  case 7:
    app.hierarchieObject[gruppe][path[0]].Hierarchie[path[1]].Hierarchie[path[2]].Hierarchie[path[3]].Hierarchie[path[4]].Hierarchie[path[5]].Hierarchie[path[6]].Hierarchie = objectToPass
    break
  case 8:
    app.hierarchieObject[gruppe][path[0]].Hierarchie[path[1]].Hierarchie[path[2]].Hierarchie[path[3]].Hierarchie[path[4]].Hierarchie[path[5]].Hierarchie[path[6]].Hierarchie[path[7]].Hierarchie = objectToPass
    break
  }
  // console.log('passPropertyToHierarchieObject.js, app.hierarchieObject[gruppe] after', app.hierarchieObject[gruppe])
}
