'use strict'

import app from 'ampersand-app'
import React from 'react'
import Button from 'react-bootstrap/lib/Button'
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup'
import ResizeButton from './resizeButton.js'
import Filter from './filter.js'
import TreeFauna from './treeFauna/fauna.js'

export default React.createClass({
  displayName: 'Menu',

  getInitialState () {
    return {
      // ??
    }
  },

  componentDidMount () {
    // can't subscribe to store here because store is different depending on group chosen
  },

  componentWillUnmount () {
    this.unsubscribeFaunaStore
  },

  showFauna () {
    // cancel listeners to stores
    this.unsubscribeFaunaStore
    // loadFaunaStore if necessary
    if (!window.faunaStore.loaded) {
      app.Actions.loadFaunaStore()
    }
    // start listening to the store
    this.unsubscribeFaunaStore = window.faunaStore.listen(this.onFaunaStoreChange)
    // TODO: show that fetching data
  },

  onFaunaStoreChange (items) {
    React.render(<Filter items={items}/>, document.getElementById('filter'))
    const treeState = { klasse: null, ordnung: null, familie: null, guid: null }
    React.render(<TreeFauna items={items} treeState={treeState}/>, document.getElementById('tree'))
  },

  showFlora () {
    console.log('showFlora clicked')
    // TODO
  },

  showMoose () {
    console.log('showMoose clicked')
    // TODO
  },

  showPilze () {
    console.log('showPilze clicked')
    // TODO
  },

  showLr () {
    console.log('showLr clicked')
    // TODO
  },

  render () {
    return (
      <fieldset id='menu' className='menu'>
        <div>
          <ResizeButton/>
          <div id='menu-div'>
            <div id='gruppeLabel'>Gruppe wählen:</div>
          </div>
          <ButtonGroup>
            <Button bsStyle='primary' onClick={this.showFauna}>Fauna</Button>
            <Button bsStyle='primary' onClick={this.showFlora}>Flora</Button>
            <Button bsStyle='primary' onClick={this.showMoose}>Moose</Button>
            <Button bsStyle='primary' onClick={this.showPilze}>Pilze</Button>
            <Button bsStyle='primary' onClick={this.showLr}>Lebensräume</Button>
          </ButtonGroup>
        </div>
        <div id='filter'></div>

        <div id='treeMitteilung' style={{display: 'none'}}>hole Daten...</div>
        <div className='treeBeschriftung'></div>
        <div id='tree' className='baum'></div>

      </fieldset>
    )
  }
})
