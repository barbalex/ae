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
 * the function receives objects
 * it builds hierarchy
 * building principle:
 * 0. use the array in Eigenschaften.Hierarchie of the desired taxonomy
 * 1. build first level (first element)
 * 2. build the next level for each member of the passed in level
 * 3. repeat until there is no more hierarchy object
 *
 * later this function can be changed to build hierarchy objects for non standard taxonomies
 * in the meantime Standardtaxonomie is used
 */

'use strict'

// TODO: refactor to remove repeating code

import { clone } from 'lodash'
import replaceProblematicPathCharactersFromArray from './replaceProblematicPathCharactersFromArray.js'
import getHierarchyFromObject from './getHierarchyFromObject.js'

const buildEl = {
  1 (hierarchy, hArray) {
    return hierarchy.find((el) => el.Name === hArray[0].Name)
  },

  2 (el1, hArray) {
    return el1.children.find((el) => el.Name === hArray[1].Name)
  },

  3 (el2, hArray) {
    return el2.children.find((el) => el.Name === hArray[2].Name)
  },

  4 (el3, hArray) {
    return el3.children.find((el) => el.Name === hArray[3].Name)
  },

  5 (el4, hArray) {
    return el4.children.find((el) => el.Name === hArray[4].Name)
  },

  6 (el5, hArray) {
    return el5.children.find((el) => el.Name === hArray[5].Name)
  },

  7 (el6, hArray) {
    return el6.children.find((el) => el.Name === hArray[6].Name)
  },

  8 (el7, hArray) {
    return el7.children.find((el) => el.Name === hArray[7].Name)
  },

  9 (el8, hArray) {
    return el8.children.find((el) => el.Name === hArray[8].Name)
  }
}

function checkLevel1 (hierarchy, hArray) {
  let el1 = buildEl[1](hierarchy, hArray)
  if (!el1) {
    el1 = clone(hArray[0])
    el1.children = []
    el1.path = replaceProblematicPathCharactersFromArray([el1.Name])
    hierarchy.push(el1)
  }
}

function checkLevel2 (hierarchy, hArray) {
  checkLevel1(hierarchy, hArray)
  const el1 = buildEl[1](hierarchy, hArray)
  let el2 = buildEl[2](el1, hArray)
  if (!el2) {
    el2 = clone(hArray[1])
    el2.children = []
    el2.path = replaceProblematicPathCharactersFromArray([el1.Name, el2.Name])
    el1.children.push(el2)
  }
}

function checkLevel3 (hierarchy, hArray) {
  checkLevel1(hierarchy, hArray)
  checkLevel2(hierarchy, hArray)
  const el1 = buildEl[1](hierarchy, hArray)
  const el2 = buildEl[2](el1, hArray)
  let el3 = buildEl[3](el2, hArray)
  if (!el3) {
    el3 = clone(hArray[2])
    el3.children = []
    el3.path = replaceProblematicPathCharactersFromArray([el1.Name, el2.Name, el3.Name])
    el2.children.push(el3)
  }
}

function checkLevel4 (hierarchy, hArray) {
  checkLevel1(hierarchy, hArray)
  checkLevel2(hierarchy, hArray)
  checkLevel3(hierarchy, hArray)
  const el1 = buildEl[1](hierarchy, hArray)
  const el2 = buildEl[2](el1, hArray)
  const el3 = buildEl[3](el2, hArray)
  let el4 = buildEl[4](el3, hArray)
  if (!el4) {
    el4 = clone(hArray[3])
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
  const el1 = buildEl[1](hierarchy, hArray)
  const el2 = buildEl[2](el1, hArray)
  const el3 = buildEl[3](el2, hArray)
  const el4 = buildEl[4](el3, hArray)
  let el5 = buildEl[5](el4, hArray)
  if (!el5) {
    el5 = clone(hArray[4])
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
  const el1 = buildEl[1](hierarchy, hArray)
  const el2 = buildEl[2](el1, hArray)
  const el3 = buildEl[3](el2, hArray)
  const el4 = buildEl[4](el3, hArray)
  const el5 = buildEl[5](el4, hArray)
  let el6 = buildEl[6](el5, hArray)
  if (!el6) {
    el6 = clone(hArray[5])
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
  const el1 = buildEl[1](hierarchy, hArray)
  const el2 = buildEl[2](el1, hArray)
  const el3 = buildEl[3](el2, hArray)
  const el4 = buildEl[4](el3, hArray)
  const el5 = buildEl[5](el4, hArray)
  const el6 = buildEl[6](el5, hArray)
  let el7 = buildEl[7](el6, hArray)
  if (!el7) {
    el7 = clone(hArray[6])
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
  const el1 = buildEl[1](hierarchy, hArray)
  const el2 = buildEl[2](el1, hArray)
  const el3 = buildEl[3](el2, hArray)
  const el4 = buildEl[4](el3, hArray)
  const el5 = buildEl[5](el4, hArray)
  const el6 = buildEl[6](el5, hArray)
  const el7 = buildEl[7](el6, hArray)
  let el8 = buildEl[8](el7, hArray)
  if (!el8) {
    el8 = clone(hArray[7])
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
  const el1 = buildEl[1](hierarchy, hArray)
  const el2 = buildEl[2](el1, hArray)
  const el3 = buildEl[3](el2, hArray)
  const el4 = buildEl[4](el3, hArray)
  const el5 = buildEl[5](el4, hArray)
  const el6 = buildEl[6](el5, hArray)
  const el7 = buildEl[7](el6, hArray)
  const el8 = buildEl[8](el7, hArray)
  let el9 = buildEl[9](el8, hArray)
  if (!el9) {
    el9 = clone(hArray[8])
    el9.children = []
    el9.path = replaceProblematicPathCharactersFromArray([el1.Name, el2.Name, el3.Name, el4.Name, el5.Name, el6.Name, el7.Name, el8.Name, el9.Name])
    el8.children.push(el9)
  }
}

export default (objects) => {
  // prepare hierarchieObject
  let hierarchy = []

  // extract Hierarchie from objects
  // used to use .map but that contained undefined elements because it always returns a value
  const hierarchiesArray = []
  objects.forEach((object) => {
    const hArray = getHierarchyFromObject(object)
    if (hArray) hierarchiesArray.push(hArray)
  })

  hierarchiesArray.forEach((hArray) => {
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
