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

// TODO: refactor to remove repeating code

import { clone } from 'lodash'
import getHierarchyFromObject from './getHierarchyFromObject.js'

const buildEl = {
  1(hierarchy, hierarchyOfObject) {
    return hierarchy.find((el) => el.Name === hierarchyOfObject[0].Name)
  },

  2(el1, hierarchyOfObject) {
    return el1.children.find((el) => el.Name === hierarchyOfObject[1].Name)
  },

  3(el2, hierarchyOfObject) {
    return el2.children.find((el) => el.Name === hierarchyOfObject[2].Name)
  },

  4(el3, hierarchyOfObject) {
    return el3.children.find((el) => el.Name === hierarchyOfObject[3].Name)
  },

  5(el4, hierarchyOfObject) {
    return el4.children.find((el) => el.Name === hierarchyOfObject[4].Name)
  },

  6(el5, hierarchyOfObject) {
    return el5.children.find((el) => el.Name === hierarchyOfObject[5].Name)
  },

  7(el6, hierarchyOfObject) {
    return el6.children.find((el) => el.Name === hierarchyOfObject[6].Name)
  },

  8(el7, hierarchyOfObject) {
    return el7.children.find((el) => el.Name === hierarchyOfObject[7].Name)
  },

  9(el8, hierarchyOfObject) {
    return el8.children.find((el) => el.Name === hierarchyOfObject[8].Name)
  }
}

function checkLevel1(hierarchy, hierarchyOfObject) {
  let el1 = buildEl[1](hierarchy, hierarchyOfObject)
  if (!el1) {
    el1 = clone(hierarchyOfObject[0])
    el1.children = []
    el1.path = [el1.Name]
    hierarchy.push(el1)
  }
}

function checkLevel2(hierarchy, hierarchyOfObject) {
  checkLevel1(hierarchy, hierarchyOfObject)
  const el1 = buildEl[1](hierarchy, hierarchyOfObject)
  let el2 = buildEl[2](el1, hierarchyOfObject)
  if (!el2) {
    el2 = clone(hierarchyOfObject[1])
    el2.children = []
    el2.path = [
      el1.Name,
      el2.Name
    ]
    el1.children.push(el2)
  }
}

function checkLevel3(hierarchy, hierarchyOfObject) {
  checkLevel1(hierarchy, hierarchyOfObject)
  checkLevel2(hierarchy, hierarchyOfObject)
  const el1 = buildEl[1](hierarchy, hierarchyOfObject)
  const el2 = buildEl[2](el1, hierarchyOfObject)
  let el3 = buildEl[3](el2, hierarchyOfObject)
  if (!el3) {
    el3 = clone(hierarchyOfObject[2])
    el3.children = []
    el3.path = [
      el1.Name,
      el2.Name,
      el3.Name
    ]
    el2.children.push(el3)
  }
}

function checkLevel4(hierarchy, hierarchyOfObject) {
  checkLevel1(hierarchy, hierarchyOfObject)
  checkLevel2(hierarchy, hierarchyOfObject)
  checkLevel3(hierarchy, hierarchyOfObject)
  const el1 = buildEl[1](hierarchy, hierarchyOfObject)
  const el2 = buildEl[2](el1, hierarchyOfObject)
  const el3 = buildEl[3](el2, hierarchyOfObject)
  let el4 = buildEl[4](el3, hierarchyOfObject)
  if (!el4) {
    el4 = clone(hierarchyOfObject[3])
    el4.children = []
    el4.path = [
      el1.Name,
      el2.Name,
      el3.Name,
      el4.Name
    ]
    el3.children.push(el4)
  }
}

function checkLevel5(hierarchy, hierarchyOfObject) {
  checkLevel1(hierarchy, hierarchyOfObject)
  checkLevel2(hierarchy, hierarchyOfObject)
  checkLevel3(hierarchy, hierarchyOfObject)
  checkLevel4(hierarchy, hierarchyOfObject)
  const el1 = buildEl[1](hierarchy, hierarchyOfObject)
  const el2 = buildEl[2](el1, hierarchyOfObject)
  const el3 = buildEl[3](el2, hierarchyOfObject)
  const el4 = buildEl[4](el3, hierarchyOfObject)
  let el5 = buildEl[5](el4, hierarchyOfObject)
  if (!el5) {
    el5 = clone(hierarchyOfObject[4])
    el5.children = []
    el5.path = [
      el1.Name,
      el2.Name,
      el3.Name,
      el4.Name,
      el5.Name
    ]
    el4.children.push(el5)
  }
}

function checkLevel6(hierarchy, hierarchyOfObject) {
  checkLevel1(hierarchy, hierarchyOfObject)
  checkLevel2(hierarchy, hierarchyOfObject)
  checkLevel3(hierarchy, hierarchyOfObject)
  checkLevel4(hierarchy, hierarchyOfObject)
  checkLevel5(hierarchy, hierarchyOfObject)
  const el1 = buildEl[1](hierarchy, hierarchyOfObject)
  const el2 = buildEl[2](el1, hierarchyOfObject)
  const el3 = buildEl[3](el2, hierarchyOfObject)
  const el4 = buildEl[4](el3, hierarchyOfObject)
  const el5 = buildEl[5](el4, hierarchyOfObject)
  let el6 = buildEl[6](el5, hierarchyOfObject)
  if (!el6) {
    el6 = clone(hierarchyOfObject[5])
    el6.children = []
    el6.path = [
      el1.Name,
      el2.Name,
      el3.Name,
      el4.Name,
      el5.Name,
      el6.Name
    ]
    el5.children.push(el6)
  }
}

function checkLevel7(hierarchy, hierarchyOfObject) {
  checkLevel1(hierarchy, hierarchyOfObject)
  checkLevel2(hierarchy, hierarchyOfObject)
  checkLevel3(hierarchy, hierarchyOfObject)
  checkLevel4(hierarchy, hierarchyOfObject)
  checkLevel5(hierarchy, hierarchyOfObject)
  checkLevel6(hierarchy, hierarchyOfObject)
  const el1 = buildEl[1](hierarchy, hierarchyOfObject)
  const el2 = buildEl[2](el1, hierarchyOfObject)
  const el3 = buildEl[3](el2, hierarchyOfObject)
  const el4 = buildEl[4](el3, hierarchyOfObject)
  const el5 = buildEl[5](el4, hierarchyOfObject)
  const el6 = buildEl[6](el5, hierarchyOfObject)
  let el7 = buildEl[7](el6, hierarchyOfObject)
  if (!el7) {
    el7 = clone(hierarchyOfObject[6])
    el7.children = []
    el7.path = [
      el1.Name,
      el2.Name,
      el3.Name,
      el4.Name,
      el5.Name,
      el6.Name,
      el7.Name
    ]
    el6.children.push(el7)
  }
}

function checkLevel8(hierarchy, hierarchyOfObject) {
  checkLevel1(hierarchy, hierarchyOfObject)
  checkLevel2(hierarchy, hierarchyOfObject)
  checkLevel3(hierarchy, hierarchyOfObject)
  checkLevel4(hierarchy, hierarchyOfObject)
  checkLevel5(hierarchy, hierarchyOfObject)
  checkLevel6(hierarchy, hierarchyOfObject)
  checkLevel7(hierarchy, hierarchyOfObject)
  const el1 = buildEl[1](hierarchy, hierarchyOfObject)
  const el2 = buildEl[2](el1, hierarchyOfObject)
  const el3 = buildEl[3](el2, hierarchyOfObject)
  const el4 = buildEl[4](el3, hierarchyOfObject)
  const el5 = buildEl[5](el4, hierarchyOfObject)
  const el6 = buildEl[6](el5, hierarchyOfObject)
  const el7 = buildEl[7](el6, hierarchyOfObject)
  let el8 = buildEl[8](el7, hierarchyOfObject)
  if (!el8) {
    el8 = clone(hierarchyOfObject[7])
    el8.children = []
    el8.path = [
      el1.Name,
      el2.Name,
      el3.Name,
      el4.Name,
      el5.Name,
      el6.Name,
      el7.Name,
      el8.Name
    ]
    el7.children.push(el8)
  }
}

function checkLevel9(hierarchy, hierarchyOfObject) {
  checkLevel1(hierarchy, hierarchyOfObject)
  checkLevel2(hierarchy, hierarchyOfObject)
  checkLevel3(hierarchy, hierarchyOfObject)
  checkLevel4(hierarchy, hierarchyOfObject)
  checkLevel5(hierarchy, hierarchyOfObject)
  checkLevel6(hierarchy, hierarchyOfObject)
  checkLevel7(hierarchy, hierarchyOfObject)
  checkLevel8(hierarchy, hierarchyOfObject)
  const el1 = buildEl[1](hierarchy, hierarchyOfObject)
  const el2 = buildEl[2](el1, hierarchyOfObject)
  const el3 = buildEl[3](el2, hierarchyOfObject)
  const el4 = buildEl[4](el3, hierarchyOfObject)
  const el5 = buildEl[5](el4, hierarchyOfObject)
  const el6 = buildEl[6](el5, hierarchyOfObject)
  const el7 = buildEl[7](el6, hierarchyOfObject)
  const el8 = buildEl[8](el7, hierarchyOfObject)
  let el9 = buildEl[9](el8, hierarchyOfObject)
  if (!el9) {
    el9 = clone(hierarchyOfObject[8])
    el9.children = []
    el9.path = [
      el1.Name,
      el2.Name,
      el3.Name,
      el4.Name,
      el5.Name,
      el6.Name,
      el7.Name,
      el8.Name,
      el9.Name
    ]
    el8.children.push(el9)
  }
}

export default (objects) => {
  // prepare hierarchieObject
  const hierarchy = []

  // extract Hierarchie from objects
  // used to use .map but that contained undefined elements because it always returns a value
  const hierarchiesArray = []
  objects.forEach((object) => {
    const hierarchyOfObject = getHierarchyFromObject(object)
    if (hierarchyOfObject) hierarchiesArray.push(hierarchyOfObject)
  })

  hierarchiesArray.forEach((hierarchyOfObject) => {
    switch (hierarchyOfObject.length) {
      case 1:
        checkLevel1(hierarchy, hierarchyOfObject)
        break
      case 2:
        checkLevel2(hierarchy, hierarchyOfObject)
        break
      case 3:
        checkLevel3(hierarchy, hierarchyOfObject)
        break
      case 4:
        checkLevel4(hierarchy, hierarchyOfObject)
        break
      case 5:
        checkLevel5(hierarchy, hierarchyOfObject)
        break
      case 6:
        checkLevel6(hierarchy, hierarchyOfObject)
        break
      case 7:
        checkLevel7(hierarchy, hierarchyOfObject)
        break
      case 8:
        checkLevel8(hierarchy, hierarchyOfObject)
        break
      case 9:
        checkLevel9(hierarchy, hierarchyOfObject)
        break
    }
  })

  // console.log('buildHierrchy, hierarchy:', hierarchy)
  return hierarchy
}
