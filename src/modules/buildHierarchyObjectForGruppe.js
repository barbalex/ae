/*
 * build an object composed of the Hierarchies, Names and GUID's
 * GUID's mark that this object can be shown
 * example:
    {
      'Fauna': {
        'name': 'Fauna',
        'children': {
          'Amphibia': {
            'name': 'Amphibia',
            'children': {
              'Anura': {
                'name': 'Anura',
                'children': {
                  'Bufonidae': {
                    'name': 'Bufonidae',
                    'children': {
                      'Bufo bufo (Linnaeus, 1758) (Erdkröte)': {
                        'name': 'Bufo bufo (Linnaeus, 1758) (Erdkröte)',
                        'guid': '979233B6-9013-4820-9F7D-8ED9D826C2D3'
                      }
                      ...
                    }
                  }
                  ...
                }
              }
              ...
            }
          }
          ...
        }
      }
      'Flora': ...
      'Moose': ...
      ...
    }
 * the function recieves the objects of a group
 * it builds app.hierarchieObject[gruppe]
 * building principle:
 * 0. use the array in Eigenschaften.Hierarchie of the desired taxonomy
 * 1. build first level (first element)
 * 2. build the next level for each member of the passed in level
 * 3. repeat until there is no more hierarchy object
 *
 * later this function can be changed to build hierarchy objects for taxonomies
 * in the meantime Taxonomien[0] is used
 */

'use strict'

import app from 'ampersand-app'
import _ from 'lodash'
import passPropertyToHierarchieObject from './passPropertyToHierarchieObject.js'

function buildNextLevel (name, path, hierarchy, gruppe) {
  if (path.length > 3) return

  console.log('buildNextLevel name', name)
  console.log('buildNextLevel path', path)
  console.log('buildNextLevel hierarchy', hierarchy)

  const hierarchiesWithName = _.filter(hierarchy, function (hierarchyArray) {
    return hierarchyArray[0] && hierarchyArray[0].Name
  })
  const hierarchies = _.groupBy(hierarchiesWithName, function (hierarchyArray) {
    return hierarchyArray[0].Name
  })

  if (hierarchy.length > 1) {

    console.log('buildNextLevel, hierarchies', hierarchies)

    if (hierarchies) {
      passPropertyToHierarchieObject(hierarchy.GUID, hierarchies, path, name, gruppe)
      _.forEach(hierarchies, function (propHierarchy, propName) {
        if (propName) {
          let nextPath = _.clone(path)
          nextPath.push(propName)
          buildNextLevel(propName, nextPath, propHierarchy)
        }
      })
    }
  } else {
    // this is last level
    passPropertyToHierarchieObject(hierarchy.GUID, hierarchies, path, name, gruppe)
  }
}

function structurize (hierarchiesArray) {
  let items = []
  const l = hierarchiesArray.length
  for (let i = 0; i < l; i++) {
    const hierarchy = hierarchiesArray[i]
    const name = hierarchy[0].Name
    const guid = hierarchy[0].GUID
    const rest = hierarchy.slice(1)
    let item = null
    const itemsLength = items.length
    for (let j = 0; j < itemsLength; j++) {
      if (items[j].name === name) {
        item = items[j]
        break
      }
    }
    if (item === null) {
      item = {}
      item.name = name
      if (guid) item.guid = guid
      if (rest.length > 0) {
        item.children = [rest]
      } else {
        item.children = []
      }
      item.children = rest.length > 0 ? [rest] : []
      items.push(item)
    }
  }
  return items
}

export default function (objects, gruppe) {
  // prepare hierarchieObject
  app.hierarchieObject = app.hierarchieObject || {}
  // app.hierarchieObject[gruppe] = {}

  // extract Hierarchie from objects
  const hierarchiesArray = _.map(objects, function (object) {
    if (object.Taxonomien[0].Eigenschaften.Hierarchie) return _.get(object, 'Taxonomien[0].Eigenschaften.Hierarchie')
  })

  const items = structurize(hierarchiesArray)
  console.log('buildHierarchyObjectForGruppe.js: items', items)
  /*const l = items.length
  for (let i = 0; i < l; i++) {
    let item = items[i]
    item.children = structurize(item.children)
  }*/
  console.log('buildHierarchyObjectForGruppe.js: items after adding children', items)

  const gruppeItem = {
    name: gruppe,
    children: items
  }

  console.log('buildHierarchyObjectForGruppe.js: gruppeItem', gruppeItem)

  return gruppeItem
}
