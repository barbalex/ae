/*
 * build an object composed of the paths
 * example:
 * {
 *   'Amphibia': {
 *     'Anura': {
 *       'Bufonidae': {
 *         'Bufo bufo (Linnaeus, 1758) (Erdkröte)': '979233B6-9013-4820-9F7D-8ED9D826C2D3',
 *         'Bufo calamita Laurenti, 1768 (Kreuzkröte)': 'CA529422-0ED4-4BFD-94A2-4E788AEB9D70'
 *       }
 *     }
 *   }
 * }
 */
'use strict'

import app from 'ampersand-app'
import _ from 'lodash'
import passPropertyToHierarchieObject from './passPropertyToHierarchieObject.js'

const gruppe = 'Lebensräume'

function buildNextLevel (property, path, objects) {
  let nextPath = _.clone(path)
  nextPath.push(property)
  const level = nextPath.length

  console.log('buildHierarchyObjectForParent.js:  property:', property)
  console.log('buildHierarchyObjectForParent.js: path:', path)
  console.log('buildHierarchyObjectForParent.js: nextPath:', nextPath)
  console.log('buildHierarchyObjectForParent.js: objects:', objects)

  // if (property) {
  if (objects.length > 1) {
    const propertiesOfNextLevel = _.groupBy(objects, function (objekt) {
      if (objekt.Taxonomie && objekt.Taxonomie.Eigenschaften && objekt.Taxonomie.Eigenschaften.Hierarchie && objekt.Taxonomie.Eigenschaften.Hierarchie[level] && objekt.Taxonomie.Eigenschaften.Hierarchie[level].Name) return objekt.Taxonomie.Eigenschaften.Hierarchie[level].Name
    })
    // if objects had no next hierarchy with name, undefined is returned
    if (propertiesOfNextLevel.undefined) delete propertiesOfNextLevel.undefined

    console.log('buildHierarchyObjectForParent.js: ' + Object.keys(propertiesOfNextLevel).length + ' properties of Level ' + level + ':', propertiesOfNextLevel)

    if (propertiesOfNextLevel) {
      
      passPropertyToHierarchieObject(propertiesOfNextLevel, nextPath, gruppe)

      // console.log('buildHierarchyObjectForParent.js: propertiesOfNextLevel', propertiesOfNextLevel)

      _.forEach(propertiesOfNextLevel, function (values, property) {
        //if (values.length > 1) {
        // if (property && property !== undefined) {
          buildNextLevel(property, nextPath, values)
        /*} else {
          // oops
          console.log('buildHierarchyObjectForParent.js: values.length = 0,  property:', property)
          console.log('buildHierarchyObjectForParent.js: values.length = 0,  values:', values)
          console.log('buildHierarchyObjectForParent.js: values.length = 0,  values[0]:', values[0])
          console.log('buildHierarchyObjectForParent.js: values.length = 0,  values[0]._id:', values[0]._id)
          let prop = {}
          prop[property] = values[0]._id
          const lastPath = _.clone(nextPath)
          lastPath.push(property)
          passPropertyToHierarchieObject(prop, lastPath, gruppe)
          // buildNextLevel(property, nextPath, values)
        }*/
      })
    }
  } else {
    console.log('buildHierarchyObjectForParent.js: objects.length = 0,  property:', property)
    console.log('buildHierarchyObjectForParent.js: objects.length = 0,  objects:', objects)
    console.log('buildHierarchyObjectForParent.js: objects.length = 0,  objects[0]:', objects[0])
    console.log('buildHierarchyObjectForParent.js: objects.length = 0,  objects[0]._id:', objects[0]._id)
    let prop = {}
    prop[property] = objects[0]._id
    const lastPath = _.clone(nextPath)
    lastPath.push(property)
    setTimeout(function () {
      passPropertyToHierarchieObject(prop, nextPath, gruppe)
    }, 500)
  }
}

export default function (objects) {

  // console.log('buildHierarchyObjectForParent.js: objects', objects)

  // prepare hierarchieObject
  app.hierarchieObject = app.hierarchieObject || {}
  app.hierarchieObject[gruppe] = {}

  // build first level
  const propertiesOfLevel1 = _.groupBy(objects, function (objekt) {
    if (objekt.Taxonomie && objekt.Taxonomie.Name) return objekt.Taxonomie.Name
  })

  app.hierarchieObject[gruppe] = propertiesOfLevel1

  console.log('buildHierarchyObjectForParent.js: ' + Object.keys(propertiesOfLevel1).length + ' properties of Level 0:', propertiesOfLevel1)

  const path = []

  // buildNextLevel('Agrofutura (2004): Wiesenkartierschlüssel', path, propertiesOfLevel1['Agrofutura (2004): Wiesenkartierschlüssel'])

  // get next level built
  _.forEach(propertiesOfLevel1, function (values, property) {
    buildNextLevel(property, path, values)
  })

  return app.hierarchieObject[gruppe]
}
