import app from 'ampersand-app'
import Reflux from 'reflux'
import { get } from 'lodash'
import getItemsFromLocalDb from '../modules/getItemsFromLocalDb.js'
import getItemFromLocalDb from '../modules/getItemFromLocalDb.js'
import getItemFromRemoteDb from '../modules/getItemFromRemoteDb.js'
import getGruppen from '../modules/gruppen.js'
import changePathOfObjectInLocalDb from '../modules/changePathOfObjectInLocalDb.js'
import updateActivePathFromObject from '../modules/updateActivePathFromObject.js'

export default (Actions) => Reflux.createStore({
  /*
   * keeps an array of objects, of hierarchy objects and of groups loaded (i.e. their names)
   * they are managed with the same store (but different databases)
   * because they depend on each other / always change together
   *
   * objects are kept in the pouch in localDb,
   * hierarchies in localDb,
   * groups in localDb
  */
  listenables: Actions,

  // getObjects and getObject get Object(s) from pouch if loaded
  getObjects() {
    return getItemsFromLocalDb()
  },

  getObject(guid) {
    return new Promise((resolve, reject) => {
      getItemFromLocalDb(guid)
        .then((item) => {
          // if no item is found in localDb, get from remote
          // important on first load of an object url
          // in order for this to work, getItemFromLocalDb returns null when not finding the doc
          if (!item) return getItemFromRemoteDb(guid)
          return item
        })
        .then((item) => resolve(item))
        .catch((error) =>
          reject(`objectStore, getObject: error getting item from guid ${guid}: ${error}`)
        )
    })
  },

  onSaveObject(object, save) {
    /**
     * 1. write object to localDb
     * 2. update object rev
     * 3. if object is active: update activeObjectStore
     * if save was passed i.e. field was blured:
     * 4. replace path in pathStore
     * 5. replace path in activePathStore
     * 5. replace filter options in filterOptionsStore
     * 6. update hierarchy
     * 7. replicate changes to remoteDb
     */

    // 1. write object to localDb
    app.localDb.put(object)
      .then((result) => {
        // 2. update object rev
        object._rev = result.rev
        // 3. if object is active: update activeObjectStore
        const objectIsActive = (
          app.activeObjectStore.item &&
          app.activeObjectStore.item.id &&
          app.activeObjectStore.item.id === object.id
        )
        if (objectIsActive) {
          app.Actions.loadActiveObject(object.id)
        }
        if (save) {
          // 4. replace path in pathStore
          changePathOfObjectInLocalDb(object)
          updateActivePathFromObject(object)
          // 5. replace filter options in filterOptionsStore
          app.Actions.changeFilterOptionsForObject(object)
          // 6. update hierarchy
          this.updateHierarchyForObject(object)
          // 7. replicate changes to remoteDb
          app.Actions.replicateToRemoteDb()
        }
      })
      .catch((error) => {
        addError({
          title: 'objectStore, onSaveObject: error saving object:',
          msg: error
        })
      })
  },

  getHierarchy() {
    getHierarchyFromLocalDb()
      .then((hierarchy) => this.trigger(hierarchy))
      .catch((error) =>
        addError({
          title: 'objectStore, onSaveObject, error getting hierarchy:',
          msg: error
        })
      )
  },

  updateHierarchieInChildObject(guid, index, name) {
    this.getObject(guid)
      .then((object) => {
        const taxonomies = object.Taxonomien
        if (taxonomies) {
          const taxonomy = taxonomies.find((tax) =>
            tax.Standardtaxonomie
          )
          if (taxonomy) {
            const hierarchy = get(taxonomy, 'Eigenschaften.Hierarchie')
            if (
              hierarchy &&
              hierarchy.length &&
              hierarchy.length > 0 &&
              hierarchy[index] &&
              hierarchy[index].Name
            ) {
              hierarchy[index].Name = name
              return app.localDb.put(object)
            }
          }
        }
      })
      .catch((error) => addError({
        title: 'objectStore: error updating hierarchy in child object:',
        msg: error
      }))
  },

  updateChildrensPath(child, index, name) {
    // 1. update path of child
    child.path[index] = name
    // 2. update Hierarchie in child object
    if (child.GUID) {
      this.updateHierarchieInChildObject(child.GUID, index - 1, name)
    }
    // 3. update it's children
    const children = child.children
    if (children && children.length && children.length > 0) {
      children.forEach((chld) =>
        this.updateChildrensPath(chld, index, name)
      )
    }
  },

  updateHierarchyForObject(object) {
    // if lr need to update names in child lr's hierarchies
    // idea: use _local/hierarchy and follow its hierarchy down
    // then change _local/hierarchy AND the objects themselves
    const taxonomies = object.Taxonomien
    const group = object.Gruppe

    if (group && taxonomies) {
      const taxonomy = taxonomies.find((tax) =>
        tax.Standardtaxonomie
      )
      if (taxonomy) {
        const objectHierarchy = get(taxonomy, 'Eigenschaften.Hierarchie')
        if (
          objectHierarchy &&
          objectHierarchy.length &&
          objectHierarchy.length > 0
        ) {
          const objectHierarchyObject = objectHierarchy[objectHierarchy.length - 1]
          if (
            objectHierarchyObject &&
            objectHierarchyObject.Name &&
            objectHierarchyObject.GUID
          ) {
            let globalHierarchy
            // TODO: adapt to new structure
            app.localDb.get('_local/hierarchy')
              .then((doc) => {
                globalHierarchy = doc.hierarchy
                // drill down to this object's hierarchy
                const gruppeHierarchy = globalHierarchy.find((h) =>
                  h.Name === group
                )
                let hierarchyPart = gruppeHierarchy
                objectHierarchy.forEach((hO) => {
                  if (hO.GUID) {
                    hierarchyPart = hierarchyPart.children.find((child) =>
                      child.GUID === hO.GUID
                    )
                  } else {
                    // non-LR: upper hierarchy levels have no guid
                    hierarchyPart = hierarchyPart.children.find((child) =>
                      child.Name === hO.Name
                    )
                  }
                })
                // update Name
                hierarchyPart.Name = objectHierarchyObject.Name
                // now update path Name in all childrens hierarchy objects
                const children = hierarchyPart.children
                if (children && children.length && children.length > 0) {
                  children.forEach((child) =>
                    this.updateChildrensPath(
                      child,
                      objectHierarchy.length,
                      objectHierarchyObject.Name
                    )
                  )
                }
                // save doc
                return app.localDb.put(doc)
              })
              .then(() => this.trigger(globalHierarchy))
              .catch((error) =>
                addError({
                  title: 'objectStore: error updating hierarchy for object:',
                  msg: error
                })
              )
          }
        }
      }
    }
  },

  onLoadPouchFromLocal() {
    Actions.loadFilterOptions()
    this.getHierarchy()
  },

  onLoadObject(gruppe) {
    // make sure gruppe was passed
    if (!gruppe) return false
    // make sure a valid group was passed
    const gruppen = getGruppen()
    const validGroup = gruppen.includes(gruppe)
    if (!validGroup) {
      return this.onLoadObjectFailed('Actions.loadObject: the group passed is not valid', gruppe)
    }

    // app.loadingGroupsStore.groupsLoading is a task list that is worked off one by one
    // if a loadGroupFromRemote call is started while the last is still active, bad things happen
    // > add this group to the tasklist
    const groupsLoadingObject = {
      group: gruppe,
      message: `Werde ${gruppe} laden...`
    }
    app.loadingGroupsStore.groupsLoading.unshift(groupsLoadingObject)
    // check if there are groups loading now
    // if yes: when finished, loadGroupFromRemote will begin loading the next group in the queue

  },

  onLoadObjectFailed(error, gruppe) {
    // remove loading indicator
    Actions.showGroupLoading({
      group: gruppe,
      finishedLoading: true
    })
    addError({
      title: 'objectStore: loading items failed with error:',
      msg: error
    })
  }
})
