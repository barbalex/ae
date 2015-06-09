'use strict'

import app from 'ampersand-app'
import React from 'react'
import 'reflux'
import Button from 'react-bootstrap/lib/Button'
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup'
import ResizeButton from './resizeButton'
import Filter from 'react-select'
import TreeFauna from './treeFauna.js'

let searchOptions = []

export default React.createClass({
  // mixins: [Reflux.listenTo(faunaStore, 'onFaunaStoreChange')],

  displayName: 'Menu',

  getInitialState () {
    // creat mock species
    for (var i = 0; i < 200; i++) {
      searchOptions.push({value: i, label: 'Art_' + i})
    }

    return {
      // ??
    }
  },

  componentDidMount () {
    // this.unsubscribe = app.Stores.faunaStore.listen(this.onFaunaStoreChange)
    // console.log('menu: faunaStore=', window.Stores.faunaStore)
  },

  componentWillUnmount () {
    // this.unsubscribe
  },

  showFauna () {
    console.log('showFauna clicked')
    // TODO
    // call action initializeFaunaStore
    app.Actions.initializeFaunaStore()
    // render treeFauna in tree
    React.render(<TreeFauna/>, document.getElementById('tree'))
  },

  onFaunaStoreChange (data) {
    console.log('fauaStore changed, data:', data)
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

  filter (val) {
    console.log('filtered:', val)
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
        <Filter
          name='test'
          placeholder='filtern'
          noResultsText='keine Treffer'
          options={searchOptions}
          onChange={this.filter}/>

        <div id='treeMitteilung' style={{display: 'none'}}>hole Daten...</div>
        <div className='treeBeschriftung'></div>
        <div id='tree' className='baum'></div>

      </fieldset>
    )
  }
})
