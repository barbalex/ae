/*
 * build an object composed of the Hierarchies, Names, paths and GUID's
 * GUID's mark that this object can be shown
 * example:
    {
      'name': 'Fauna',
      'path': ['Fauna'],
      'children': [
        {
          'name': 'Amphibia',
          'path': ['Fauna', 'Amphibia'],
          'children': [
            {
              'name': 'Anura',
              'path': ['Fauna', 'Amphibia', 'Anura'],
              'children': [
                {
                  'name': 'Bufonidae',
                  'path': ['Fauna', 'Amphibia', 'Anura', 'Bufonidae'],
                  'children': [
                    {
                      'name': 'Bufo bufo (Linnaeus, 1758) (Erdkröte)',
                      'path': ['Fauna', 'Amphibia', 'Anura', 'Bufonidae', 'Bufo bufo (Linnaeus, 1758) (Erdkröte)'],
                      'guid': '979233B6-9013-4820-9F7D-8ED9D826C2D3'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
 * the function recieves objects
 * it builds hierarchy
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

// TODO: refactor to remove repeating code

import _ from 'lodash'
import replaceProblematicPathCharactersFromArray from './replaceProblematicPathCharactersFromArray.js'

function checkLevel1 (hierarchy, hArray) {
  let el1 = _.find(hierarchy, function (el) {
    return el.Name === hArray[0].Name
  })
  if (!el1) {
    el1 = _.clone(hArray[0])
    el1.children = []
    el1.path = replaceProblematicPathCharactersFromArray([el1.Name])
    hierarchy.push(el1)
  }
}

function checkLevel2 (hierarchy, hArray) {
  checkLevel1(hierarchy, hArray)
  const el1 = _.find(hierarchy, function (el) {
    return el.Name === hArray[0].Name
  })
  let el2 = _.find(el1.children, function (el) {
    return el.Name === hArray[1].Name
  })
  if (!el2) {
    el2 = _.clone(hArray[1])
    el2.children = []
    el2.path = replaceProblematicPathCharactersFromArray([el1.Name, el2.Name])
    el1.children.push(el2)
  }
}

function checkLevel3 (hierarchy, hArray) {
  checkLevel1(hierarchy, hArray)
  checkLevel2(hierarchy, hArray)
  const el1 = _.find(hierarchy, function (el) {
    return el.Name === hArray[0].Name
  })
  const el2 = _.find(el1.children, function (el) {
    return el.Name === hArray[1].Name
  })
  let el3 = _.find(el2.children, function (el) {
    return el.Name === hArray[2].Name
  })
  if (!el3) {
    el3 = _.clone(hArray[2])
    el3.children = []
    el3.path = replaceProblematicPathCharactersFromArray([el1.Name, el2.Name, el3.Name])
    el2.children.push(el3)
  }
}

function checkLevel4 (hierarchy, hArray) {
  checkLevel1(hierarchy, hArray)
  checkLevel2(hierarchy, hArray)
  checkLevel3(hierarchy, hArray)
  const el1 = _.find(hierarchy, function (el) {
    return el.Name === hArray[0].Name
  })
  const el2 = _.find(el1.children, function (el) {
    return el.Name === hArray[1].Name
  })
  const el3 = _.find(el2.children, function (el) {
    return el.Name === hArray[2].Name
  })
  let el4 = _.find(el3.children, function (el) {
    return el.Name === hArray[3].Name
  })
  if (!el4) {
    el4 = _.clone(hArray[3])
    el4.children = []
    el4.path = replaceProblematicPathCharactersFromArray([el1.Name, el2.Name, el3.Name, el4.Name])
    el3.children.push(el4)
  }
}

function checkLevel5 (hierarchy, hArray) {
  checkLevel1(hierarchy, hArray)
  checkLevel2(hierarchy, hArray)
  checkLevel3(hierarchy, hArray)
  checkLevel4(hierarchy, hArray)
  const el1 = _.find(hierarchy, function (el) {
    return el.Name === hArray[0].Name
  })
  const el2 = _.find(el1.children, function (el) {
    return el.Name === hArray[1].Name
  })
  const el3 = _.find(el2.children, function (el) {
    return el.Name === hArray[2].Name
  })
  const el4 = _.find(el3.children, function (el) {
    return el.Name === hArray[3].Name
  })
  let el5 = _.find(el4.children, function (el) {
    return el.Name === hArray[4].Name
  })
  if (!el5) {
    el5 = _.clone(hArray[4])
    el5.children = []
    el5.path = replaceProblematicPathCharactersFromArray([el1.Name, el2.Name, el3.Name, el4.Name, el5.Name])
    el4.children.push(el5)
  }
}

function checkLevel6 (hierarchy, hArray) {
  checkLevel1(hierarchy, hArray)
  checkLevel2(hierarchy, hArray)
  checkLevel3(hierarchy, hArray)
  checkLevel4(hierarchy, hArray)
  checkLevel5(hierarchy, hArray)
  const el1 = _.find(hierarchy, function (el) {
    return el.Name === hArray[0].Name
  })
  const el2 = _.find(el1.children, function (el) {
    return el.Name === hArray[1].Name
  })
  const el3 = _.find(el2.children, function (el) {
    return el.Name === hArray[2].Name
  })
  const el4 = _.find(el3.children, function (el) {
    return el.Name === hArray[3].Name
  })
  const el5 = _.find(el4.children, function (el) {
    return el.Name === hArray[4].Name
  })
  let el6 = _.find(el5.children, function (el) {
    return el.Name === hArray[5].Name
  })
  if (!el6) {
    el6 = _.clone(hArray[5])
    el6.children = []
    el6.path = replaceProblematicPathCharactersFromArray([el1.Name, el2.Name, el3.Name, el4.Name, el5.Name, el6.Name])
    el5.children.push(el6)
  }
}

function checkLevel7 (hierarchy, hArray) {
  checkLevel1(hierarchy, hArray)
  checkLevel2(hierarchy, hArray)
  checkLevel3(hierarchy, hArray)
  checkLevel4(hierarchy, hArray)
  checkLevel5(hierarchy, hArray)
  checkLevel6(hierarchy, hArray)
  const el1 = _.find(hierarchy, function (el) {
    return el.Name === hArray[0].Name
  })
  const el2 = _.find(el1.children, function (el) {
    return el.Name === hArray[1].Name
  })
  const el3 = _.find(el2.children, function (el) {
    return el.Name === hArray[2].Name
  })
  const el4 = _.find(el3.children, function (el) {
    return el.Name === hArray[3].Name
  })
  const el5 = _.find(el4.children, function (el) {
    return el.Name === hArray[4].Name
  })
  const el6 = _.find(el5.children, function (el) {
    return el.Name === hArray[5].Name
  })
  let el7 = _.find(el6.children, function (el) {
    return el.Name === hArray[6].Name
  })
  if (!el7) {
    el7 = _.clone(hArray[6])
    el7.children = []
    el7.path = replaceProblematicPathCharactersFromArray([el1.Name, el2.Name, el3.Name, el4.Name, el5.Name, el6.Name, el7.Name])
    el6.children.push(el7)
  }
}

function checkLevel8 (hierarchy, hArray) {
  checkLevel1(hierarchy, hArray)
  checkLevel2(hierarchy, hArray)
  checkLevel3(hierarchy, hArray)
  checkLevel4(hierarchy, hArray)
  checkLevel5(hierarchy, hArray)
  checkLevel6(hierarchy, hArray)
  checkLevel7(hierarchy, hArray)
  const el1 = _.find(hierarchy, function (el) {
    return el.Name === hArray[0].Name
  })
  const el2 = _.find(el1.children, function (el) {
    return el.Name === hArray[1].Name
  })
  const el3 = _.find(el2.children, function (el) {
    return el.Name === hArray[2].Name
  })
  const el4 = _.find(el3.children, function (el) {
    return el.Name === hArray[3].Name
  })
  const el5 = _.find(el4.children, function (el) {
    return el.Name === hArray[4].Name
  })
  const el6 = _.find(el5.children, function (el) {
    return el.Name === hArray[5].Name
  })
  const el7 = _.find(el6.children, function (el) {
    return el.Name === hArray[6].Name
  })
  let el8 = _.find(el7.children, function (el) {
    return el.Name === hArray[7].Name
  })
  if (!el8) {
    el8 = _.clone(hArray[7])
    el8.children = []
    el8.path = replaceProblematicPathCharactersFromArray([el1.Name, el2.Name, el3.Name, el4.Name, el5.Name, el6.Name, el7.Name, el8.Name])
    el7.children.push(el8)
  }
}

function checkLevel9 (hierarchy, hArray) {
  checkLevel1(hierarchy, hArray)
  checkLevel2(hierarchy, hArray)
  checkLevel3(hierarchy, hArray)
  checkLevel4(hierarchy, hArray)
  checkLevel5(hierarchy, hArray)
  checkLevel6(hierarchy, hArray)
  checkLevel7(hierarchy, hArray)
  checkLevel8(hierarchy, hArray)
  const el1 = _.find(hierarchy, function (el) {
    return el.Name === hArray[0].Name
  })
  const el2 = _.find(el1.children, function (el) {
    return el.Name === hArray[1].Name
  })
  const el3 = _.find(el2.children, function (el) {
    return el.Name === hArray[2].Name
  })
  const el4 = _.find(el3.children, function (el) {
    return el.Name === hArray[3].Name
  })
  const el5 = _.find(el4.children, function (el) {
    return el.Name === hArray[4].Name
  })
  const el6 = _.find(el5.children, function (el) {
    return el.Name === hArray[5].Name
  })
  const el7 = _.find(el6.children, function (el) {
    return el.Name === hArray[6].Name
  })
  const el8 = _.find(el7.children, function (el) {
    return el.Name === hArray[7].Name
  })
  let el9 = _.find(el8.children, function (el) {
    return el.Name === hArray[8].Name
  })
  if (!el9) {
    el9 = _.clone(hArray[8])
    el9.children = []
    el9.path = replaceProblematicPathCharactersFromArray([el1.Name, el2.Name, el3.Name, el4.Name, el5.Name, el6.Name, el7.Name, el8.Name, el9.Name])
    el8.children.push(el9)
  }
}

export default function (objects) {
  // prepare hierarchieObject
  let hierarchy = []

  // extract Hierarchie from objects
  // used to use _.map but that contained undefined elements because it always returns a value
  const hierarchiesArray = []
  _.forEach(objects, function (object) {
    if (object.Taxonomien && object.Taxonomien[0] && object.Taxonomien[0].Eigenschaften && object.Taxonomien[0].Eigenschaften.Hierarchie && object.Gruppe) {
      const hArray = _.get(object, 'Taxonomien[0].Eigenschaften.Hierarchie')
      const gruppenObjekt = {'Name': object.Gruppe}
      hArray.unshift(gruppenObjekt)
      hierarchiesArray.push(hArray)
    }
  })

  _.forEach(hierarchiesArray, function (hArray) {
    switch (hArray.length) {
    case 1:
      checkLevel1(hierarchy, hArray)
      break
    case 2:
      checkLevel2(hierarchy, hArray)
      break
    case 3:
      checkLevel3(hierarchy, hArray)
      break
    case 4:
      checkLevel4(hierarchy, hArray)
      break
    case 5:
      checkLevel5(hierarchy, hArray)
      break
    case 6:
      checkLevel6(hierarchy, hArray)
      break
    case 7:
      checkLevel7(hierarchy, hArray)
      break
    case 8:
      checkLevel8(hierarchy, hArray)
      break
    case 9:
      checkLevel9(hierarchy, hArray)
      break
    }
  })

  // console.log('buildHierrchy, hierarchy:', hierarchy)
  return hierarchy
}
