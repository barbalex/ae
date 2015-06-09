'use strict'

import app from 'ampersand-app'
import React from 'react'
import Button from 'react-bootstrap/lib/Button'
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup'
import ResizeButton from './resizeButton.js'
import Filter from './filter.js'
// import TreeFauna from './treeFauna.js'

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
    this.unsubscribe
  },

  showFauna () {
    console.log('showFauna clicked')
    // cancel listeners to stores
    this.unsubscribe
    // call action initializeFaunaStore
    app.Actions.initializeFaunaStore()
    // start listening to the store
    this.unsubscribe = window.faunaStore.listen(this.onFaunaStoreChange)
    // TODO: show that fetching data
  },

  onFaunaStoreChange (data) {
    // TODO: insert Filter
    React.render(<Filter data={data}/>, document.getElementById('filter'))
    // turn of to test filter
    // React.render(<TreeFauna data={data}/>, document.getElementById('tree'))
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
            <div id='gruppe_label'>Gruppe wählen:</div>
          </div>
          <ButtonGroup id='gruppe' className='gruppeButtonGroup'>
            <Button bsStyle='primary' className='gruppe' onClick={this.showFauna} Gruppe='Fauna'>Fauna</Button>
            <Button bsStyle='primary' className='gruppe' onClick={this.showFlora} Gruppe='Flora'>Flora</Button>
            <Button bsStyle='primary' className='gruppe' onClick={this.showMoose} Gruppe='Moose'>Moose</Button>
            <Button bsStyle='primary' className='gruppe' onClick={this.showPilze} Gruppe='Macromycetes'>Pilze</Button>
            <Button bsStyle='primary' className='gruppe' onClick={this.showLr} Gruppe='Lebensräume'>Lebensräume</Button>
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
