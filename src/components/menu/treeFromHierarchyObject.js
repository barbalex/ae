'use strict'

import app from 'ampersand-app'
import React from 'react'
import { State, Navigation } from 'react-router'
import { ListenerMixin } from 'reflux'
import _ from 'lodash'
import PouchDB from 'pouchdb'
import pouchUrl from '../../modules/getCouchUrl.js'
import Nodes from './treeNodesFromHierarchyObject.js'
import isGuid from '../../modules/isGuid.js'
import getPathFromGuid from '../../modules/getPathFromGuid.js'

export default React.createClass({
  displayName: 'TreeLevel1',

  mixins: [ListenerMixin, State, Navigation],

  propTypes: {
    hO: React.PropTypes.object,  // = hierarchy-object
    gruppe: React.PropTypes.string,
    activeKey: React.PropTypes.string
  },

  getInitialState () {
    const pathString = this.getParams().splat
    const path = pathString.split('/')
    // guidPath is when only a guid is contained in url
    const isGuidPath = path.length === 1 && isGuid(path[0])
    const that = this
    let gruppe = null
    let hO = null
    let activeKey = null

    console.log('treeFromHierarchyObject.js, getInitialState: isGuidPath:', isGuidPath)

    /*if (isGuidPath) {
      // constuct path from object with guid
      // it's possible that this object's group has not yet been loaded
      const guid = path[0]
      const object = window.objectStore.getItemByGuid(guid)

      if (object) {

        console.log('treeFromHierarchyObject.js, getInitialState, got object loaded, transitioning')

        // navigate to the new url
        const url = getPathFromGuid(guid)
        this.transitionTo(url)
        this.forceUpdate()
      } else {

        console.log('treeFromHierarchyObject.js, getInitialState, going to load object')

        // get Object from remote
        const couchUrl = pouchUrl()
        const db = new PouchDB(couchUrl, function (error, response) {
          if (error) { return console.log('error instantiating remote db: ', error) }
          db.get(guid, { include_docs: true })
            .then(function (object) {
              // load data of this group
              app.Actions.loadObjectStore(object.Gruppe)
              // wait until store changes
              const taxonomieForMetadata = object.Gruppe === 'Lebensräume' ? 'CH Delarze (2008): Allgemeine Umgebung (Areale)' : object.Taxonomie.Name

              console.log('treeFromHierarchyObject.js, getInitialState: object:', object)

              // check if metadata is here
              const metaData = window.objectStore.getDsMetadata()

              console.log('treeFromHierarchyObject.js, getInitialState: metaData in objectStore:', metaData)

              if (metaData && metaData[taxonomieForMetadata]) {

                console.log('treeFromHierarchyObject.js, getInitialState: calling getPathFromGuid with guid and object')

                // navigate to the new url
                const url = getPathFromGuid(guid, object)
                that.transitionTo(url)
              } else {
                db.query('artendb/dsMetadataNachDsName', { include_docs: true })
                  .then(function (result) {
                    // extract metadata doc from result
                    const metaDataDoc = result.rows.map(function (row) {
                      return row.doc
                    })
                    const metaData = _.indexBy(metaDataDoc, 'Name')

                    console.log('treeFromHierarchyObject.js, getInitialState: got metaData:', metaData)

                    // navigate to the new url
                    const url = getPathFromGuid(guid, object, metaData[taxonomieForMetadata])
                    // that.transitionTo(url)
                    // that.forceUpdate()
                    window.open(url, '_self')
                  })
                  .catch(function (err) {
                    console.log('error fetching metadata:', err)
                  })
              }
            })
            .catch(function (err) {
              console.log('error fetching doc from ' + couchUrl + ' with guid ' + guid + ':', err)
            })
        })
      }
    } else {*/
      gruppe = path[0]
      hO = window.objectStore.getHierarchy()
      activeKey = gruppe
    // }

    const state = {
      hO: hO,
      gruppe: gruppe,
      activeKey: activeKey
    }

    // console.log('treeFromHierarchyObject.js getInitialState: state', state)

    return state
  },

  componentDidUpdate () {

    /*console.log('treeFromHierarchyObject.js is updated')

    const pathString = this.getParams().splat
    const path = pathString.split('/')
    // guidPath is when only a guid is contained in url
    const isGuidPath = path.length === 1 && isGuid(path[0])
    const that = this

    if (isGuidPath) {
      // constuct path from object with guid
      // it's possible that this object's group has not yet been loaded
      const guid = path[0]
      const object = window.objectStore.getItemByGuid(guid)

      if (object) {

        console.log('treeFromHierarchyObject.js componentDidUpdate, got object loaded, transitioning')

        // navigate to the new url
        const url = getPathFromGuid(guid)
        this.transitionTo(url)
        this.forceUpdate()
      } else {

        console.log('treeFromHierarchyObject.js componentDidUpdate, going to load object')

        // get Object from remote
        const couchUrl = pouchUrl()
        const db = new PouchDB(couchUrl, function (error, response) {
          if (error) { return console.log('error instantiating remote db: ', error) }
          db.get(guid, { include_docs: true })
            .then(function (object) {
              // load data of this group
              app.Actions.loadObjectStore(object.Gruppe)
              // wait until store changes
              const taxonomieForMetadata = object.Gruppe === 'Lebensräume' ? 'CH Delarze (2008): Allgemeine Umgebung (Areale)' : object.Taxonomie.Name

              console.log('treeFromHierarchyObject.js componentDidUpdate: object:', object)

              // check if metadata is here
              const metaData = window.objectStore.getDsMetadata()

              console.log('treeFromHierarchyObject.js componentDidUpdate: metaData in objectStore:', metaData)

              if (metaData && metaData[taxonomieForMetadata]) {

                console.log('treeFromHierarchyObject.js componentDidUpdate: calling getPathFromGuid with guid and object')

                // navigate to the new url
                const url = getPathFromGuid(guid, object)
                that.transitionTo(url)
              } else {
                db.query('artendb/dsMetadataNachDsName', { include_docs: true })
                  .then(function (result) {
                    // extract metadata doc from result
                    const metaDataDoc = result.rows.map(function (row) {
                      return row.doc
                    })
                    const metaData = _.indexBy(metaDataDoc, 'Name')

                    console.log('treeFromHierarchyObject.js componentDidUpdate: got metaData:', metaData)

                    // navigate to the new url
                    const url = getPathFromGuid(guid, object, metaData[taxonomieForMetadata])
                    that.transitionTo(url)
                    that.forceUpdate()
                    // window.open(url, '_self')
                  })
                  .catch(function (err) {
                    console.log('error fetching metadata:', err)
                  })
              }
            })
            .catch(function (err) {
              console.log('error fetching doc from ' + couchUrl + ' with guid ' + guid + ':', err)
            })
        })
      }
    }*/
  },

  componentDidMount () {
    this.listenTo(window.objectStore, this.onStoreChange)
  },

  onStoreChange (items, hO, gruppe) {
    console.log('treeFromHierarchyObject.js, onStoreChange: store has changed')
    // console.log('treeFromHierarchyObject.js, onStoreChange: gruppe', gruppe)

    const pathString = this.getParams().splat
    const path = pathString.split('/')
    // guidPath is when only a guid is contained in url
    const isGuidPath = path.length === 1 && isGuid(path[0])

    if (isGuidPath) {
      // constuct path from object with guid
      // it's possible that this object's group has not yet been loaded
      const guid = path[0]
      const object = window.objectStore.getItemByGuid(guid)

      if (object) {

        console.log('treeFromHierarchyObject.js onStoreChange, got object loaded, transitioning from guidPath')

        // navigate to the new url
        const url = getPathFromGuid(guid)
        this.setState({
          gruppe: object.Gruppe
        })
        this.transitionTo(url)
        this.forceUpdate()
      }
    }

    this.setState({
      hO: hO,
      gruppe: gruppe
    })
    this.forceUpdate()
  },

  render () {
    const hO = this.state.hO
    const loading = app.loadingObjectStore && app.loadingObjectStore.length > 0
    const loadingGruppe = loading ? app.loadingObjectStore[0] : 'Daten'

    // console.log('treeFromHierarchyObject.js is rendered')

    const tree = (
      <div>
        <Nodes hO={hO} level={1}/>
      </div>
    )

    const loadingMessage = <p>Lade {loadingGruppe}...</p>

    return (
      <div>
        <div id='tree' className='baum'>
          {tree}
        </div>
        {loading ? loadingMessage : ''}
      </div>
    )
  }
})
