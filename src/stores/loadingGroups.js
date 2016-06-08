import app from 'ampersand-app'
import Reflux from 'reflux'
import { reject as _reject, union, without } from 'lodash'
import getGroupsLoadedFromLocalDb from '../modules/getGroupsLoadedFromLocalDb.js'
import addGroupsLoadedToLocalDb from '../modules/addGroupsLoadedToLocalDb.js'
import getGruppen from '../modules/gruppen.js'
import loadGroupFromRemote from '../modules/loadGroupFromRemote.js'

export default (Actions) => Reflux.createStore({
  /*
   * keeps a list of loading groups
   * {group: 'Fauna', allGroups: false, message: 'Lade Fauna...', progressPercent: 60, finishedLoading: false}
   * loading groups are shown in menu under tree
   * if progressPercent is passed, a progressbar is shown
   * message is Text or label in progressbar
   */
  listenables: Actions,

  groupsLoading: [],

  groupsLoaded() {
    return new Promise((resolve, reject) => {
      console.log('loadingGroupsStore, groupsLoaded running')
      getGroupsLoadedFromLocalDb()
        .then((groupsLoaded) => resolve(groupsLoaded))
        .catch((error) =>
          reject('objectStore, groupsLoaded: error getting groups loaded:', error)
        )
    })
  },

  isGroupLoaded(gruppe) {
    return new Promise((resolve, reject) => {
      this.groupsLoaded()
        .then((groupsLoaded) => {
          const groupIsLoaded = groupsLoaded.includes(gruppe)
          resolve(groupIsLoaded)
        })
        .catch((error) =>
          reject('objectStore, isGroupLoaded: error getting groups loaded:', error)
        )
    })
  },

  onShowGroupLoading(objectPassed) {
    // groups: after loading all groups in parallel from remoteDb
    // need to pass a single action for all
    // otherwise 5 addGroupsLoadedToLocalDb calls occur at the same moment...
    const { group, allGroups, finishedLoading } = objectPassed
    const gruppen = getGruppen()
    let groupsLoaded

    getGroupsLoadedFromLocalDb()
      .then((gl) => {
        groupsLoaded = gl
        // if an object with this group is contained in groupsLoading, remove it
        if (allGroups) {
          this.groupsLoading = []
        } else {
          this.groupsLoading = _reject(this.groupsLoading, (groupObject) =>
            groupObject.group === group
          )
        }
        // add the passed object, if it is not yet loaded
        if (!finishedLoading) {
          // add it to the beginning of the array
          this.groupsLoading.unshift(objectPassed)
        }
        groupsLoaded = allGroups ? gruppen : union(groupsLoaded, [group])
        if (finishedLoading) {
          // remove this group from groupsLoading
          this.groupsLoading = without(this.groupsLoading, group)
          // load next group if on is queued
          if (this.groupsLoading.length > 0) {
            // get group of last element
            const nextGroup = this.groupsLoading[this.groupsLoading.length - 1].group
            // load if
            loadGroupFromRemote(nextGroup)
              .then(() => app.objectStore.getHierarchy())
              .catch((error) => {
                const errorMsg = `Actions.loadObject, error loading group ${nextGroup}: ${error}`
                app.objectStore.onLoadObjectFailed(errorMsg, nextGroup)
              })
          }
          // write change to groups loaded to localDb
          const groupsToPass = allGroups ? gruppen : [group]
          addGroupsLoadedToLocalDb(groupsToPass)
            .catch((error) =>
              app.Actions.showError({
                title: 'loadingGroupsStore, onShowGroupLoading, error adding group(s) to localDb:',
                msg: error
              })
            )
        }
        // inform views
        const payload = {
          groupsLoadingObjects: this.groupsLoading,
          groupsLoaded
        }
        this.trigger(payload)
      })
      .then(() => {
        // if all groups are loaded, replicate
        if (gruppen.length === groupsLoaded.length && finishedLoading) {
          app.Actions.replicateFromRemoteDb('thenToRemoteDb')
        }
      })
      .catch((error) =>
        app.Actions.showError({
          title: 'loadingGroupsStore, onShowGroupLoading, error getting groups loaded from localDb:',
          msg: error
        })
      )
  }
})
